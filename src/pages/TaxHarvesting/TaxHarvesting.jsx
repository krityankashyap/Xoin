import { CapitalGainsSection } from '@/components/organisms/CapitalGainsSection/CapitalGainsSection'
import { HoldingsTable } from '@/components/organisms/HoldingsTable/HoldingsTable'
import { ImportantNotes } from '@/components/molecules/ImportantNotes/ImportantNotes'

export function TaxHarvesting() {
  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="px-6 py-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-1">
            <span className="text-white font-extrabold text-2xl tracking-tight">Koin</span>
            <span className="text-yellow-400 font-extrabold text-2xl">X</span>
            <span className="text-yellow-400 text-xs align-super">®</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-5">
        <div className="flex items-center gap-4">
          <h1 className="text-white font-bold text-2xl">Tax Harvesting</h1>
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            How it works?
          </a>
        </div>

        <ImportantNotes />
        <CapitalGainsSection />
        <HoldingsTable />
      </main>
    </div>
  )
}
