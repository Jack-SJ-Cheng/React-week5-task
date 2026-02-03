import axios from "axios";
import { use, useEffect, useState } from "react"
import { useParams } from "react-router"

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const api_path = import.meta.env.VITE_API_PATH;

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState({});

  useEffect(()=>{
    (async () => {
      try {
        const res = await axios.get(`${apiUrl}/v2/api/${api_path}/product/${id}`)
        setProduct(res.data.product);
      } catch (error) {
        console.warn(error);
      }
    })();
  },[])

  return (
    <>
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-6">
            <img src={product.imageUrl} className="img-fluid" alt={product.name} />
          </div>
          <div className="col-sm-6">
            <h2>{product.title}</h2>
            <p>建議焙度：{product.content}</p>
            <p>風味描述：{product.description}</p>
            <p>原價：<del>{product.origin_price}</del></p>
            <h4 className="mt-4">價格：${product.price}</h4>
            <button className="btn btn-primary mt-3">加入購物車</button>
          </div>
        </div>
      </div>
    </>
  )
}