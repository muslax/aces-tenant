export default function Heading({ title, children }) {
  return (
    <div className="mt-6 mb-6">
      <div className="flex items-end justify-center sm:justify-start h-8">
        <h3 className="flex-grow text-2xl text-gray-400s font-bolds">{title ?? 'Daftar XX'}</h3>
        {children}
      </div>
    </div>
  )
}