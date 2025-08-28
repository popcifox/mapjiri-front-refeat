import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'

export default function RootLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main style={{ padding: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}
