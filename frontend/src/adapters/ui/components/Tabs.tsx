import { useEffect, useState } from 'react'

type TabKey = 'routes' | 'compare' | 'banking' | 'pooling'

export function Tabs({ onChange, initial = 'routes' as TabKey }: { onChange: (k: TabKey) => void; initial?: TabKey }) {
  const [active, setActive] = useState<TabKey>(initial)
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'routes', label: 'Routes' },
    { key: 'compare', label: 'Compare' },
    { key: 'banking', label: 'Banking' },
    { key: 'pooling', label: 'Pooling' },
  ]

  useEffect(() => {
    onChange(active)
    localStorage.setItem('activeTab', active)
  }, [active, onChange])

  return (
    <div role="tablist" className="sticky top-4 z-10 mb-6 rounded-xl border border-white/10 bg-slate-900/70 p-1 backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            onClick={() => setActive(t.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${active === t.key ? 'bg-white/10 text-white shadow-glow' : 'text-slate-400 hover:text-slate-100'}`}
          >{t.label}</button>
        ))}
      </div>
    </div>
  )
}
