import axios from "axios"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useEffect, useRef, useState } from "react"
import Modal from "./components/Modal"


const apiUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

const getToken = () => 
  document.cookie.replace(/(?:(?:^|.*;\s*)hexTaskToken\s*\=\s*([^;]*).*$)|^.*$/,
    "$1");

function App() {
  const modalRef = useRef(null);
  const modalInstance = useRef(null);
  const tableRef = useRef(null);
  const [isLogin, setIsLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({imagesUrl:[""],unit: "個",is_enabled:false});
  const [editItem, setEditItem] = useState({});
  const [modalType, setModalType] = useState("");
  const [token, setToken] = useState("");
  
  const modalHeadBg = modalType === "新增商品" ? "bg-primary" : (modalType === "編輯商品" ? "bg-success" : "")
  const modalBtn = modalType === "新增商品" ? "btn-primary" : (modalType === "編輯商品" ? "btn-success" : "")

  const handleGetProducts = async() => {
    try{
      const productsRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products/all`)
      setProducts(Object.values(productsRes.data.products));
    } catch(error){console.warn('取得商品失敗：', error.response)}
  }
  // 登入
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
      document.cookie = `hexTaskToken=${loginRes.data.token}; expires=${new Date(loginRes.data.expired)}`;
      axios.defaults.headers.common["Authorization"] = `${loginRes.data.token}`;
      handleGetProducts();
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
  useEffect(()=>{
    modalInstance.current = new bootstrap.Modal(modalRef.current);
  },[])
  // 啟用狀態變更
  useEffect(()=>{
    (async ()=>{
      if(!editItem?.id) return
      try{
        const res = await axios.put(`${apiUrl}/v2/api/${apiPath}/admin/product/${editItem.id}`,{data: editItem})
      }catch(error){console.warn('變更失敗：', error.response)}
    })()
  },[editItem])

  // 檢查cookie
  useEffect(()=>{
    (async function verifySignin(){
      const hexTaskToken = getToken();
      axios.defaults.headers.common["Authorization"] = hexTaskToken;
      handleGetProducts();
      try{
        const res = await axios.post(`${apiUrl}/v2/api/user/check`);
        setIsLogin(true);
      } catch(error){
        console.error("驗證錯誤:", error);
      }
    })()
  },[])

  return (
    <>
    <div className="container pt-5">
      {isLogin ? (
        <div>
          <div className="d-flex flex-row-reverse">
            <button type="button" className="btn btn-secondary"
              onClick={()=>{
                setModalType("新增商品");
                setProduct({imagesUrl:[""],unit: "個",is_enabled:false});
                modalInstance.current.show();
              }}
            >新增商品</button>
          </div>
          <table className="table" tabIndex={-1} ref={tableRef}>
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
              {products.map((bean, index)=>{
                return (
                  <tr key={bean.id} className={bean.is_enabled ? "" : "table-secondary"}>
                    <td>{index+1}</td>
                    <td>{bean.category}</td>
                    <td>{bean.title}</td>
                    <td>{bean.origin_price}</td>
                    <td>{bean.price}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id={"isEnabled"+index} checked={bean.is_enabled || false}
                          onChange={(e)=>{
                            const editedCheckItem = {...bean, is_enabled: e.target.checked};
                            setProducts(prev=>
                              prev.map((item, i) => i===index ? editedCheckItem : item)
                            )
                            setEditItem(editedCheckItem);
                          }}
                        />
                      </div>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-success" type="button"
                          onClick={()=>{
                            if(bean?.imagesUrl?.length === 0 || !bean.imagesUrl) {
                              const newOne = {...bean, imagesUrl:[""]}
                              setProduct(newOne);
                            } else {
                              setProduct(bean);
                            }
                            setModalType("編輯商品");
                            modalInstance.current.show();
                          }}
                        >編輯</button>
                        <button className="btn btn-sm btn-outline-danger" type="button"
                          onClick={()=>{
                            handleDelete(bean);
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
              <label className="text-primary col-form-label text-nowrap flex-shrink-0 pe-3" htmlFor="username">
                帳號
              </label>
              <input
                type="email"
                className="form-control"
                id="username"
                placeholder="請輸入帳號"
                autoComplete="username"
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>
            <div className="d-flex mt-4">
              <label className="text-primary col-form-label text-nowrap flex-shrink-0 pe-3" htmlFor="password">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="請輸入密碼"
                autoComplete="current-password"
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
    <Modal modalInstance={modalInstance} modalRef={modalRef} modalHeadBg={modalHeadBg} modalType={modalType}
      product={product} setProduct={setProduct} modalBtn={modalBtn}
      handleGetProducts={handleGetProducts}
    />
    </>
  )
}

export default App
