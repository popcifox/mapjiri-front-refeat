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
