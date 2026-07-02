import { useEffect, useMemo, useRef, useState } from 'react'
import type { CelestialBodyData } from '../data/planets'

interface BodySearchProps {
  bodies: CelestialBodyData[]
  selectedId: string | null
  onJump: (body: CelestialBodyData) => void
  isDarkMode: boolean
}

function isTypingTarget(element: Element | null): boolean {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement
  )
}

export default function BodySearch({ bodies, selectedId, onJump, isDarkMode }: BodySearchProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return bodies
    return bodies.filter(
      (body) =>
        body.name.toLowerCase().includes(q) ||
        (body.kind === 'moon' && body.parentName.toLowerCase().includes(q))
    )
  }, [bodies, query])

  // Globale Pfeiltasten ←/→ schalten den ausgewählten Körper durch — außer man tippt gerade.
  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (isTypingTarget(document.activeElement)) return
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      if (!bodies.length) return

      event.preventDefault()
      const currentIndex = bodies.findIndex((body) => body.id === selectedId)
      const direction = event.key === 'ArrowRight' ? 1 : -1
      const base = currentIndex === -1 ? 0 : currentIndex + direction
      const nextIndex = ((base % bodies.length) + bodies.length) % bodies.length
      onJump(bodies[nextIndex])
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [bodies, selectedId, onJump])

  // Dropdown bei Klick außerhalb schließen.
  useEffect(() => {
    if (!open) return
    function handlePointer(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    window.addEventListener('mousedown', handlePointer)
    return () => window.removeEventListener('mousedown', handlePointer)
  }, [open])

  function jumpTo(body: CelestialBodyData) {
    onJump(body)
    setQuery('')
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlight((current) => Math.min(current + 1, matches.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setHighlight((current) => Math.max(current - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const body = matches[highlight]
      if (body) jumpTo(body)
    } else if (event.key === 'Escape') {
      setQuery('')
      setOpen(false)
      inputRef.current?.blur()
    }
  }

  const panelClass = isDarkMode
    ? 'border-white/10 bg-slate-950/72 text-slate-50'
    : 'border-white/70 bg-white/85 text-slate-950'
  const inputClass = isDarkMode
    ? 'bg-slate-900/70 text-slate-100 placeholder:text-slate-500'
    : 'bg-white/70 text-slate-900 placeholder:text-slate-400'

  return (
    <div ref={containerRef} className="pointer-events-auto relative w-56">
      <div className={`rounded-lg border px-3 py-2 shadow-xl backdrop-blur-xl ${panelClass}`}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setHighlight(0)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Körper suchen (←/→ blättern)"
          aria-label="Himmelskörper suchen und anspringen"
          className={`w-full rounded-md px-1 py-1 text-xs font-semibold outline-none ${inputClass}`}
        />
      </div>

      {open && matches.length > 0 && (
        <ul
          className={`absolute left-0 right-0 top-full z-30 mt-2 max-h-72 overflow-y-auto rounded-lg border py-1 shadow-2xl backdrop-blur-xl ${panelClass}`}
        >
          {matches.map((body, index) => {
            const isActive = index === highlight
            const isSelected = body.id === selectedId
            return (
              <li key={body.id}>
                <button
                  type="button"
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => jumpTo(body)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold transition ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-100'
                      : isDarkMode
                        ? 'text-slate-200 hover:bg-slate-800/70'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full ring-1 ring-white/60"
                    style={{ backgroundColor: body.color }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{body.name}</span>
                  {body.kind === 'moon' && (
                    <span className="ml-auto shrink-0 text-[0.62rem] font-medium opacity-60">
                      {body.parentName}
                    </span>
                  )}
                  {isSelected && (
                    <span className="ml-auto shrink-0 text-[0.62rem] opacity-70" aria-hidden="true">
                      ●
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
