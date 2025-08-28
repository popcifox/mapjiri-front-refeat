import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SearchPage from '@/search/SearchPage'
import LoginPage from '@/auth/LoginPage'
import RegisterPage from '@/auth/RegisterPage'

export default function AppRouter(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

/*
import { createBrowserRouter, RouterProvider, Navigate, lazy } from 'react-router-dom'
import RootLayout from '../ui/RootLayout.jsx'
import AuthLayout from '../ui/AuthLayout.jsx'
import { paths } from './paths'

const SearchPage   = lazy(() => import('../search/SearchPage.jsx'))
const ReviewPage   = lazy(() => import('../review/ReviewPage.jsx'))
const LoginPage    = lazy(() => import('../auth/LoginPage.jsx'))
const RegisterPage = lazy(() => import('../auth/RegisterPage.jsx'))

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to={paths.search} replace /> },
      { path: paths.search, element: <SearchPage /> },
      { path: paths.review, element: <ReviewPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: paths.login, element: <LoginPage /> },
      { path: paths.register, element: <RegisterPage /> },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
*/