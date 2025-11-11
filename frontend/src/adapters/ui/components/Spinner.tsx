export function Spinner({ size = 16 }: { size?: number }) {
  const s = `${size}px`
  return (
    <span className="inline-block animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" style={{ width: s, height: s }} />
  )
}

