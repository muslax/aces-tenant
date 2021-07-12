export default function Subhead({ children, title }) {
  return (
    <div className="flex items-center space-x-6 py--2">
      <div className="flex-grow h-8 pt-2 flex items-center text-lg trackingwide text-green-500 font--bold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">{title}</span>
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  )
}