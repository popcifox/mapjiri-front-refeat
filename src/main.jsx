// src/main.jsx
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import AppRouter from './router/router.jsx'
import './styles/globals.css'  

ReactDOM.createRoot(document.getElementById('root')).render(
  <Suspense fallback={<div style={{padding:16}}>로딩중...</div>}>
    <AppRouter />
  </Suspense>
)
