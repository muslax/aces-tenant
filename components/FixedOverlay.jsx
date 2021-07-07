export default function FixedOverlay({ children, dark = true }) {
  const base = "flex items-center justify-center fixed w-full h-screen top-0 left-0";
  const klas = dark ? base + ' bg-gray-300 bg-opacity-50' : base;

  return (
    <div className={klas} style={{ zIndex: 999 }}>
      {children}
    </div>
  )
}