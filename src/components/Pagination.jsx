export default function Pagination({pagination, handleChangePage}) {



  return (
    <nav aria-label="Product pagination">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${pagination.has_pre ? "" : "disabled"}`}>
          <a className="page-link" href="#" aria-label="Previous"
          onClick={(e)=>{
            e.preventDefault();
            handleChangePage(pagination.current_page - 1);
          }}
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {
          [...Array(pagination.total_pages)].map((_, index)=>{
            return (
              <li className="page-item"><a className={`page-link ${pagination.current_page === index +1 ? "active" : ""}`} href="#"
                onClick={(e)=>{
                  e.preventDefault();
                  handleChangePage(index+1)
                }}
              >{index + 1}</a></li>
            )
          })
        }
        <li className={`page-item ${pagination.has_next ? "" : "disabled"}`}>
          <a className="page-link" href="#" aria-label="Next"
          onClick={(e)=>{
            e.preventDefault();
            handleChangePage(pagination.current_page + 1);
          }}
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}