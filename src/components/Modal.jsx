import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE_URL
const apiPath = import.meta.env.VITE_API_PATH

export default function Modal ({modalInstance, modalRef, modalHeadBg, modalType, product, setProduct, modalBtn, handleGetProducts}) {
  return (
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
                    <input type="number" min={0} className="form-control" id="originPrice" value={product.origin_price || ''}
                      onChange={(e)=>{
                        const newProduct = {...product, origin_price: e.target.value*1};
                        setProduct(newProduct);
                      }}/>
                  </div>
                </div>
                <div className="d-flex mt-3">
                  <label htmlFor="price" className="me-2 col-form-label text-nowrap flex-shrink-0">售價</label>
                  <div className="flex-grow-1">
                    <input type="number" min={0} className="form-control" id="price" value={product.price || ''}
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
                      const res = await axios.post(`${apiUrl}/v2/api/${apiPath}/admin/product`,{data: product});
                      handleGetProducts();
                      modalInstance.current.hide();
                    } catch (error) {
                      const cache = error.response.data.message.join('\n');
                      alert(cache);
                      console.warn("新增失敗：", error.response.data.message)};
                  })()
                } else if(modalType === "編輯商品"){
                  (async()=>{
                    try{
                      const res = await axios.put(`${apiUrl}/v2/api/${apiPath}/admin/product/${product.id}`,{data: product});
                      handleGetProducts();
                      modalInstance.current.hide();
                    }catch(error){
                      const cache = error.response.data.message.join('\n');
                      alert(cache);
                      console.warn("編輯失敗：", error.response.data.message);
                    }
                  })()
                  return
                }
              }}
            >送出</button>
            <button type="button" className="btn btn-secondary"
              onClick={()=>{
                modalInstance.current.hide();
              }}
            >Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}