export default function Subheading({ children, title }) {
  return (
    <div className="flex items-center space-x-6 py-2">
      <h3 className={`flex-grow text-base font-bold`}>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-400">{title}</span>
      </h3>
      {children}
    </div>
  )
}