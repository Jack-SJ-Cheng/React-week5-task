


export default function Cart() {
  return (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-4">
          <h3 className="h3">購物車</h3>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">商品名稱</th>
              <th scope="col">單價</th>
              <th scope="col">數量</th>
              <th scope="col">小計</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>商品A</td>
              <td>$100</td>
              <td>
                <select className="form-select w-auto" name="number" id="number">
                  <option value="1">1</option>
                </select>
              </td>
              <td>$100</td>
              <td>
                <button className="btn btn-sm text-light btn-danger">刪除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}