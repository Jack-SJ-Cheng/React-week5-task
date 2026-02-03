import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;


export default function Products() {

  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/v2/api/${api_path}/products`);
      setProducts(res.data.products);
    } catch (error) {
      console.warn(error);
    }
  }

  useEffect(()=>{
    getProducts();
  },[])

  return (
    <>
        <div className="row g-0" style={{height: "calc(100vh - 82px)", overflow: "hidden"}}>
          <div className="sidebar col-sm-3 p-4" style={{overflowY: "auto", height: "100%"}}>
            <div className="brand-zone">
              <h4 className="fw-bold m-0 productsZoneTitle">咖啡天地</h4>
              <small className="text-muted">處理法分類</small>
            </div>
            <nav className="nav flex-column">
              <NavLink className="nav-link active" to="/products/washed"><i className="bi bi-droplet-half me-2"></i> 水洗處理</NavLink>
              <NavLink className="nav-link" to="/products/natured"><i className="bi bi-brightness-high me-2"></i> 日曬處理</NavLink>
              <NavLink className="nav-link" to="/products/honey"><i className="bi bi-cookie me-2"></i> 蜜處理</NavLink>
              <NavLink className="nav-link" to="/products/anaerobic"><i className="bi bi-clock-history me-2"></i> 厭氧處理</NavLink>
              <NavLink className="nav-link" to="/products/special"><i className="bi bi-command me-2"></i> 特殊處理</NavLink>
            </nav>
          </div>
          <div className="col-sm-9 p-4" style={{overflowY: "auto", height: "100%"}}>
              <Outlet context={products}/>
          </div>
        </div>
    </>
  )
}