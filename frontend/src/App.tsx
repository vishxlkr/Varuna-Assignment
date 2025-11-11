import './index.css'
import { useEffect, useState } from 'react'
import { RoutesBasic } from './basic/RoutesBasic'
import { CompareBasic } from './basic/CompareBasic'
import { BankingBasic } from './basic/BankingBasic'
import { PoolingBasic } from './basic/PoolingBasic'

type TabKey = 'routes' | 'compare' | 'banking' | 'pooling'

const TAB_LABELS: Record<TabKey, string> = {
  routes: 'Routes',
  compare: 'Compare',
  banking: 'Banking',
  pooling: 'Pooling',
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('routes')

  useEffect(() => {
    const saved = localStorage.getItem('activeTab') as TabKey | null
    if (saved) setTab(saved)
  }, [])

  useEffect(() => {
    localStorage.setItem('activeTab', tab)
  }, [tab])

  return (
    <div>
      <header>
        <h1>FuelEU Compliance</h1>
        
      </header>

      <nav role="tablist" aria-label="Sections" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
        {(Object.keys(TAB_LABELS) as TabKey[]).map(key => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
          >
            {TAB_LABELS[key]}
          </button>
        ))}
      </nav>

      <section role="tabpanel">
        {tab === 'routes' && <RoutesBasic />}
        {tab === 'compare' && <CompareBasic />}
        {tab === 'banking' && <BankingBasic />}
        {tab === 'pooling' && <PoolingBasic />}
      </section>
    </div>
  )
}

