'use client'

import { useState } from 'react'
import type { Work } from '@/lib/types'
import { WorkTile } from './WorkTile'
import { Lightbox } from './Lightbox'

/** Two-column, gapless grid. One column on phones. */
export function WorkGrid({ works }: { works: Work[] }) {
  const [open, setOpen] = useState<{ index: number; rect: DOMRect | null } | null>(null)

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-0 max-[479px]:grid-cols-1">
        {works.map((work, i) => (
          <WorkTile
            key={work._id}
            work={work}
            index={i}
            onOpen={(index, rect) => setOpen({ index, rect })}
          />
        ))}
      </div>

      <Lightbox
        works={works}
        index={open?.index ?? null}
        originRect={open?.rect ?? null}
        onClose={() => setOpen(null)}
        onNavigate={(index) => setOpen({ index, rect: null })}
      />
    </>
  )
}
