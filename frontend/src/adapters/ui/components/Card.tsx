export function Card({ title, children, right }: { title?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 text-slate-100 shadow-glow backdrop-blur">
      {(title || right) && (
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <div className="text-sm font-medium text-slate-200 uppercase tracking-wide">{title}</div>
          {right}
        </div>
      )}
      <div className="p-4 text-sm leading-relaxed">{children}</div>
    </div>
  )
}
