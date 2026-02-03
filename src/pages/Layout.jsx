import { NavLink, Outlet } from "react-router"


export default function Layout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <h1 className="logo">咖啡天地</h1>
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">Home</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/products/washed">產品列表</NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin">後台管理</NavLink>
              </li>
            </ul>
            <div className="cart ms-auto">
              <NavLink className="nav-link" to="/cart"><i className="bi bi-cart4 fs-5"></i></NavLink>
            </div>
          </div>
        </div>
      </nav>
      <Outlet />
    </>
  )
}