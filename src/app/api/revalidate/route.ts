import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = { _type: string }

/**
 * Sanity calls this when Mark publishes. It busts the matching cache tag so
 * the change appears within seconds, with no redeploy.
 *
 * Configure in Sanity: API > Webhooks, POST to /api/revalidate,
 * secret = SANITY_REVALIDATE_SECRET, projection `{_type}`.
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      process.env.SANITY_REVALIDATE_SECRET,
    )

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 })
    }
    if (!body?._type) {
      return new NextResponse('Bad request: missing _type', { status: 400 })
    }

    // 'max' purges the tag regardless of how recently it was cached (Next 16
    // requires a cacheLife profile here).
    revalidateTag(body._type, 'max')
    return NextResponse.json({ revalidated: true, tag: body._type, now: Date.now() })
  } catch (err) {
    console.error('Revalidation failed', err)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
