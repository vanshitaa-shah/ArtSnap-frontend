import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import AddArt from './pages/AddArt'
import Arts from './pages/Arts'
import Art from './pages/Art'
import ErrorPage from './pages/ErrorPage'
import Root from './Root'
import registerSW from './lib/registerSW'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/arts',
        element: <Arts />,
      },
      {
        path: '/',
        element: <AddArt />,
      },
      {
        path: 'arts/:artId',
        element: <Art />,
      },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

// register custom service worker
registerSW()