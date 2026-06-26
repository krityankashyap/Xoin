import { useState } from 'react'

const NOTES = [
  'Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.',
  'Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.',
  'Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.',
  'Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.',
  'Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.',
]

export function ImportantNotes() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-blue-500/40 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 bg-[#131b2e] text-white hover:bg-[#1a2540] transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-5 h-5 rounded-full border border-blue-400 text-blue-400 text-xs font-bold flex-shrink-0">
            i
          </span>
          <span className="font-semibold text-sm">Important Notes &amp; Disclaimers</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="bg-[#0f1623] px-5 py-4 border-t border-blue-500/20">
          <ul className="space-y-2">
            {NOTES.map((note, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
