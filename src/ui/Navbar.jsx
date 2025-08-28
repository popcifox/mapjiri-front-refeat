import { Link, NavLink, useNavigate } from 'react-router-dom'
import { paths } from '../router/paths'

export default function Navbar() {
  const nav = useNavigate()
  const accessToken = localStorage.getItem('accessToken')

  const onClickAuth = () => {
    if (accessToken) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      alert('로그아웃 되었습니다.')
      location.reload()
    } else {
      nav(paths.login)
    }
  }

  const Item = ({ to, label }) => (
    <NavLink to={to} style={({isActive}) => ({
      fontWeight: isActive ? 700 : 400, marginRight: 12
    })}>{label}</NavLink>
  )

  return (
    <header style={{ borderBottom:'1px solid #eee', padding: 12, position:'relative' }}>
      <Link to={paths.search} style={{ fontWeight:800, marginRight: 20 }}>음식점 검색 서비스</Link>
      <Item to={paths.search} label="검색" />
      <Item to={paths.review + '?name=샘플&address=주소'} label="리뷰 샘플" />
      <button className="login-button" onClick={onClickAuth}>
        {accessToken ? '로그아웃' : '로그인'}
      </button>
    </header>
  )
}
