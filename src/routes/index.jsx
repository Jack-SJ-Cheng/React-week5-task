import App from "../App";
import Cart from "../pages/Cart";
import Layout from "../pages/Layout";
import Products from "../pages/Products";
import Washed from "../pages/Washed";
import Natured from "../pages/Natured";
import Honey from "../pages/Honey";
import Anaerobic from "../pages/Anaerobic";
import Special from "../pages/Special";
import Product from "../pages/Product";
import Home from "../pages/Home";


const routes = [
  {
    path: "/admin",
    element: <App />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "products",
        element: <Products />,
        children: [
          {
            index: true,
            path: "washed",
            element: <Washed />
          },
          {
            path: "natured",
            element: <Natured />
          },
          {
            path: "honey",
            element: <Honey />
          },
          {
            path: "anaerobic",
            element: <Anaerobic />
          },
          {
            path: "special",
            element: <Special />
          }
        ]
      },
      {
        path: "product/:id",
        element: <Product />
      },
      {
        path: "cart",
        element: <Cart />
      }
    ]
  }
]

export default routes;