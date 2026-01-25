

export default function Signin ({handleSubmit, username, setUsername, password, setPassword}) {
  return (
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
      )
}