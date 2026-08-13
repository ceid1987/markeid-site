import type { Settings } from '@/lib/types'

const link =
  'font-body text-[15px] text-white/90 transition-all duration-200 hover:font-bold hover:text-accent'

export function Footer({ settings }: { settings: Settings | null }) {
  const email = settings?.email ?? 'contact@markeid.work'

  return (
    <footer className="w-full overflow-hidden">
      <div className="flex items-center justify-around gap-y-[50px] pt-[12vh] pb-[5vh] text-center max-md:flex-col max-md:gap-y-6">
        <div className="flex flex-col items-start justify-center">
          {settings?.vimeoUrl && (
            <a className={link} href={settings.vimeoUrl} target="_blank" rel="noopener noreferrer">
              Vimeo
            </a>
          )}
          {settings?.instagramUrl && (
            <a
              className={link}
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          )}
        </div>
        <a className={`${link} leading-[50px]`} href={`mailto:${email}`}>
          {email}
        </a>
      </div>
    </footer>
  )
}
