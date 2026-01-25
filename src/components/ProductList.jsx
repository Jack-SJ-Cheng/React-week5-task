import DeleteModal from "./DeleteModal";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js"
import { useRef, useEffect } from "react";


export default function ProductList ({products, setProducts, modalInstance, setModalType, setEditItem, handleDelete, product, setProduct, tableRef, handleGetProducts}) {

  const deleteModalInstance = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(()=>{
    deleteModalInstance.current = new bootstrap.Modal(deleteModalRef.current);
  },[])

  return (
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
              {
              products.map((bean, index)=>{
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
                            setProduct(bean);
                            deleteModalInstance.current.show();
                            // handleDelete(bean);
                          }}
                        >刪除</button>
                      </div>
                    </td>
                  </tr>
                )
              })
              }
            </tbody>
          </table>
          <DeleteModal deleteModalRef={deleteModalRef} deleteModalInstance={deleteModalInstance} 
            handleDelete={handleDelete} product={product} handleGetProducts={handleGetProducts} />
        </div>
      ) 
}