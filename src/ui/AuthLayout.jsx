import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div style={{ minHeight:'100vh', display:'grid', placeItems:'center' }}>
      <div style={{ width: 380 }}>
        <Outlet />
      </div>
    </div>
  )
}
