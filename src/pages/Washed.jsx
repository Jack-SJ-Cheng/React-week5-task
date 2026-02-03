import { Link, useOutletContext } from "react-router";


export default function Washed() {
  const products = useOutletContext();

  return (
    <>
      <div className="container mt-3">
        <div className="text-center mb-4">
          <h4>水洗處理咖啡豆</h4>
        </div>
        <div className="row row-cols-sm-2 row-cols-md-3 g-3">
          {products.map((product, index)=>{
            if(product.category !== "水洗") return;
            return (
              <div className="col" key={index}>
                <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
                  <div className="card p-0">
                    <img src={product.imageUrl} className="card-img-top" alt={product.title} />
                    <div className="card-body">
                      <h5 className="card-title">{product.title}</h5>
                      <p className="card-text fw-bold">NT${product.price}</p>
                      <button className="btn btn-primary w-100">加入購物車</button>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}