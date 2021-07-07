export function FormBox({ children }) {
  return (
    <div>
      {children}
    </div>
  )
}

export function CardBox({ children, icon }) {
  return (
    <div className="flex items-start space-x-3 rounded-sm border hover:border-gray-300 hover:shadow-sm p-3 py-2">
      <div className="pt-px">
        {icon}
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  )
}