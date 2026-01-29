import axios from "axios"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useEffect, useRef, useState } from "react"
import Modal from "./components/Modal"
import Signin from "./components/Signin"
import ProductList from "./components/ProductList"
import Pagination from "./components/Pagination"



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
  const [pagination, setPagination] = useState({});
  
  const modalHeadBg = modalType === "新增商品" ? "bg-primary" : (modalType === "編輯商品" ? "bg-success" : "")
  const modalBtn = modalType === "新增商品" ? "btn-primary" : (modalType === "編輯商品" ? "btn-success" : "")

  const handleGetProducts = async(page = 1) => {
    try{
      const productsRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products/?page=${page}`)
      setProducts(Object.values(productsRes.data.products));
      setPagination(productsRes.data.pagination);
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
        {isLogin ? 
        <>
          <ProductList 
            products={products} setProducts={setProducts} modalInstance={modalInstance} 
            setModalType={setModalType} setEditItem={setEditItem} handleDelete={handleDelete} 
            setProduct={setProduct} tableRef={tableRef} product={product}
            handleGetProducts={handleGetProducts}
          />
          <Pagination pagination={pagination} handleChangePage={handleGetProducts}/>
        </>
        : <Signin handleSubmit={handleSubmit} username={username} setUsername={setUsername}
              password={password}  setPassword={setPassword} />
        }
      </div>
      <Modal modalInstance={modalInstance} modalRef={modalRef} modalHeadBg={modalHeadBg} modalType={modalType}
        product={product} setProduct={setProduct} modalBtn={modalBtn}
        handleGetProducts={handleGetProducts}
      />
    </>
  )
}

export default App
