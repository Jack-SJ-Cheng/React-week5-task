import axios from "axios"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useEffect, useRef, useState } from "react"

const apiUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [token, setToken] = useState("");

  const handleSubmit = async (username, password) => {
    try{
      if(username === "" || password === ""){
        alert("請輸入帳號密碼");
        return;
      }
      const loginRes = await axios.post(`${apiUrl}/v2/admin/signin`, {
        username: username,
        password: password
      })
      setIsLogin(true);
      setToken(loginRes.data.token);
      axios.defaults.headers.common["Authorization"] = `${loginRes.data.token}`;
      const productsRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products/all`)
      setProducts(Object.values(productsRes.data.products));
    } catch(error){
      console.error("失敗", error.response);
    }
  }

  const handleDelete =  async (item) => {
    try {
      const res = await axios.delete(`${apiUrl}/v2/api/${apiPath}/admin/product/${item.id}`);
      const productsRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products/all`)
      setProducts(Object.values(productsRes.data.products));
    } catch(error){
      console.warn('錯誤：', error.response);
    }
  }

  return (
    <>
    <div className="container pt-5">
    {/* {JSON.stringify(products)} */}
      {isLogin ? (
        <div className="text-primary">
          <table className="table">
            <thead>
              <tr>
                <th>編號</th>
                <th>分類</th>
                <th>名稱</th>
                <th>原價</th>
                <th>售價</th>
                <th>啟用</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index)=>{
                return (
                  <tr key={product.id}>
                    <td>{index+1}</td>
                    <td>{product.category}</td>
                    <td>{product.title}</td>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id={"isEnabled"+index} checked={product.is_enabled}
                          onChange={(e)=>{
                            const check = e.target.checked;
                            setProducts(prev=>
                              prev.map((item, i) => i===index ? {...item, is_enabled: check} : item)
                            )
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-success" type="button"
                          data-bs-toggle="modal" data-bs-target="#productModal"
                          onClick={()=>{
                            setProduct(product);
                          }}
                        >編輯</button>
                        <button className="btn btn-sm btn-outline-danger" type="button"
                          onClick={()=>{
                            setProduct(product);
                            handleDelete(product);
                          }}
                        >刪除</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="row justify-content-center">
          <form className="col-sm-3">
            <div className="d-flex">
              <label className="text-primary col-form-label text-nowrap flex-shrink-0 px-3" htmlFor="username">
                帳號
              </label>
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="請輸入帳號"
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
            <div className="d-flex mt-4">
              <label className="text-primary col-form-label text-nowrap flex-shrink-0 px-3" htmlFor="password">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="請輸入密碼"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary w-100 mt-4" type="button"
              onClick={(e)=>{
                e.preventDefault();
                handleSubmit(username, password);
              }}
            >登入</button>
          </form>
        </div>
      )}
    </div>

    {/* modal */}
    <div className="modal fade" id="productModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">{product.title}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-3">
                <h6 className="h6">分類: {product.category}</h6>
                <p>原價：<del>{product.origin_price}</del></p>
                <p>售價：{product.price}</p>
              </div>
              <div className="col-9">
                <img src={product.imageUrl} alt="示意圖" className="img-fluid" style={{objectFit: "cover"}} />
                {product?.imagesUrl?.map((img, index)=>{
                  return (
                    <img key={index} src={img} alt="副圖" className="img-fluid" style={{objectFit: "cover"}}/>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
