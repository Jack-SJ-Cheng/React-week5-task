

export default function DeleteModal ({deleteModalRef, handleDelete, deleteModalInstance, product, handleGetProducts}) {
  return (<div className="modal" tabIndex="-1" ref={deleteModalRef}>
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header bg-danger">
        <h5 className="modal-title text-light">刪除</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <p>確認要刪除 <strong>{product.title}</strong> 嗎？</p>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={()=>{deleteModalInstance.current.hide()}}>取消</button>
        <button type="button" className="btn btn-danger text-light" onClick={()=>{
          handleDelete(product);
          handleGetProducts();
          deleteModalInstance.current.hide();
          }}>確認刪除</button>
      </div>
    </div>
  </div>
</div>)
}