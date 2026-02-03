
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { createHashRouter, RouterProvider } from 'react-router'
import './assets/all.scss'
import routes from './routes/index.jsx'

const router = createHashRouter(routes)

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
)
