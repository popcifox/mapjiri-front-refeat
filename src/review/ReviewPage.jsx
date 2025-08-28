import { useState } from 'react'
import { API_BASE_URL } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { paths } from '../router/paths'

export default function LoginPage(){
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    fetch(`${API_BASE_URL}/api/v1/user/signin`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(res => { if(!res.ok) throw new Error('로그인 실패'); return res.json() })
    .then(result => {
      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)
      nav(paths.search, { replace:true })
    })
    .catch(err => {
      console.error(err)
      alert('로그인에 실패했습니다.')
    })
  }

  return (
    <div className="login-container">
      <h2>로그인</h2>
      <form id="loginForm" onSubmit={onSubmit}>
        <input type="text" name="email" placeholder="아이디" required value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" name="password" placeholder="비밀번호" required value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit">로그인</button>
      </form>
      <button type="button" className="signup-btn" onClick={()=>nav(paths.register)}>회원가입</button>
    </div>
  )
}
