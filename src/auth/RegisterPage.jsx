import { useState } from 'react'
import { API_BASE_URL } from '../lib/api'
import { useNavigate } from 'react-router-dom'
import { paths } from '../router/paths'

export default function RegisterPage(){
  const nav = useNavigate()
  const [mail, setMail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    fetch(`${API_BASE_URL}/api/v1/user/signup`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ email: mail, username, password })
    })
    .then(r => { if(!r.ok) throw new Error('회원가입 실패'); return r.text() })
    .then(text => {
      (text ? JSON.parse(text) : {})
      alert('회원가입이 완료되었습니다.')
      nav(paths.login, { replace:true })
    })
    .catch(err => {
      alert('회원가입에 실패했습니다: ' + err.message)
    })
  }

  const sendCode = () => {
    if (!mail) return alert('이메일을 입력하세요.')
    fetch(`${API_BASE_URL}/api/v1/user/send`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ mail })
    })
    .then(r => { if(!r.ok) throw 0; return r.text() })
    .then(()=> alert('인증번호가 전송되었습니다.'))
    .catch(()=> alert('인증번호 전송에 실패했습니다.'))
  }

  const verifyCode = () => {
    if (!mail || !verificationCode) return alert('이메일과 인증번호를 입력하세요.')
    fetch(`${API_BASE_URL}/api/v1/user/verify`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ mail, code: verificationCode })
    })
    .then(r => { if(!r.ok) throw 0; return r.text() })
    .then(()=> alert('인증번호가 검증되었습니다.'))
    .catch(()=> alert('인증번호 검증에 실패했습니다.'))
  }

  return (
    <div className='page-center'>
        <div className="register-container">
        <h2>회원가입</h2>
        <form id="registerForm" onSubmit={onSubmit}>
            <input type="email" name="mail" placeholder="이메일" required value={mail} onChange={e=>setMail(e.target.value)} />
            <button type="button" id="sendCodeBtn" onClick={sendCode}>인증번호 전송</button>

            <input type="text" name="verificationCode" placeholder="인증번호 입력" required value={verificationCode} onChange={e=>setVerificationCode(e.target.value)} />
            <button type="button" id="verifyBtn" onClick={verifyCode}>검증</button>

            <input type="text" name="username" placeholder="닉네임" required value={username} onChange={e=>setUsername(e.target.value)} />
            <input type="password" name="password" placeholder="비밀번호" required value={password} onChange={e=>setPassword(e.target.value)} />
            <button type="submit">회원가입</button>
        </form>
        </div>
    </div>
  )
}
