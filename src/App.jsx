import axios from "axios"
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useEffect, useRef, useState } from "react"

const apiUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

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

    {/* modal */}
    <div className="modal fade" tabIndex="-1" ref={modalRef} aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className={`modal-header ${modalHeadBg}`}>
            <h5 className="modal-title text-white" id="exampleModalLabel">{modalType}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={()=> modalInstance.current.hide()}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-4">
                <div className="d-flex">
                  <label htmlFor="title" className="me-2 col-form-label text-nowrap flex-shrink-0">標題</label>
                  <div className="flex-grow-1">
                    <input type="text" id="title" className="form-control" value={product.title || ''}
                      onChange={(e)=>{
                        const newProduct = {...product, title: e.target.value};
                        setProduct(newProduct);
                      }}/>
                  </div>
                </div>
                <div className="d-flex mt-3">
                  <label htmlFor="category" className="me-2 col-form-label text-nowrap flex-shrink-0">分類</label>
                  <div className="flex-grow-1">
                    <input type="text" id="category" className="form-control" value={product.category || ''}
                      onChange={(e)=>{
                        const newProduct = {...product, category: e.target.value};
                        setProduct(newProduct);
                      }}/>
                  </div>
                </div>
                <div className="d-flex mt-3">
                  <label htmlFor="originPrice" className="me-2 col-form-label text-nowrap flex-shrink-0">原價</label>
                  <div className="flex-grow-1">
                    <input type="number" className="form-control" id="originPrice" value={product.origin_price || ''}
                      onChange={(e)=>{
                        const newProduct = {...product, origin_price: e.target.value*1};
                        setProduct(newProduct);
                      }}/>
                  </div>
                </div>
                <div className="d-flex mt-3">
                  <label htmlFor="price" className="me-2 col-form-label text-nowrap flex-shrink-0">售價</label>
                  <div className="flex-grow-1">
                    <input type="number" className="form-control" id="price" value={product.price || ''}
                      onChange={(e)=>{
                        const newProduct = {...product, price: e.target.value*1};
                        setProduct(newProduct);
                      }}/>
                  </div>
                </div>
                <div className="form-floating mt-3">
                  <input className="form-control" placeholder="內容" id="content" value={product.content || ''}
                    onChange={(e)=>{
                      const newProduct = {...product, content: e.target.value};
                        setProduct(newProduct);
                    }}/>
                  <label htmlFor="content">焙度</label>
                </div>
                <div className="form-floating mt-3">
                  <textarea className="form-control" placeholder="description" id="description" style={{height: "150px"}}
                    value={product.description || ""}
                    onChange={(e)=>{
                      const newProduct = {...product, description: e.target.value};
                        setProduct(newProduct);
                    }}></textarea>
                  <label htmlFor="description">風味敘述</label>
                </div>
              </div>
              <div className="col-8">
                <div className="form-floating">
                  <input type="url" className="form-control" name="imageUrl" id="imageUrl" value={product.imageUrl || ""} 
                    placeholder="主圖網址"
                    onChange={(e)=>{
                      const newProduct = {...product, imageUrl: e.target.value};
                      setProduct(newProduct);
                    }}/>
                    <label htmlFor="imageUrl">主圖網址</label>
                </div>
                {product.imageUrl ? <img src={product.imageUrl} alt="示意圖" className="img-fluid" style={{objectFit: "cover"}} /> : null}
                {product?.imagesUrl?.map((img, index)=>{
                  return (
                    <div className="mt-3" key={'img'+index}>
                      <div className="form-floating">
                        <input type="url" className="form-control" name="imageUrl" id={"imagesUrl"+index} value={img} 
                          placeholder="副圖網址"
                          onChange={(e)=>{
                            const newProduct = {...product};
                            newProduct.imagesUrl[index]=e.target.value;
                            setProduct(newProduct);
                          }}/>
                          <label htmlFor={"imagesUrl"+index}>副圖網址</label>
                      </div>
                      {img ? <img key={index} src={img} alt="副圖" className="img-fluid" style={{objectFit: "cover"}}/> : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className={`btn ${modalBtn}`}
              onClick={()=>{
                if(modalType === "新增商品") {
                  (async()=>{
                    try {
                      const res = await axios.post(`${apiUrl}/v2/api/${apiPath}/admin/product`,{data: product})
                      console.log(res);
                      handleGetProducts();
                      modalInstance.current.hide();
                    } catch (error) {
                      alert('新增失敗');
                      console.warn("新增失敗：", error.response)}
                  })()
                } else if(modalType === "編輯商品"){
                  (async()=>{
                    try{
                      const res = await axios.put(`${apiUrl}/v2/api/${apiPath}/admin/product/${product.id}`,{data: product});
                      handleGetProducts();
                      modalInstance.current.hide();
                    }catch(error){console.warn("編輯失敗：", error.response)}
                  })()
                  return
                }
              }}
            >送出</button>
            <button type="button" className="btn btn-secondary"
              onClick={()=>{
                // tableRef.current.focus();
                modalInstance.current.hide();
              }}
            >Close</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default App
