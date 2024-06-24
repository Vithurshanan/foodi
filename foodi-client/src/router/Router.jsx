import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import Signup from "../components/Signup";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import CartsPage from "../pages/shop/CartsPage";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Main /> ,
      children: [
        {
            path:"/",
            element:<Home />
        },
        {
          path:"/menu",
          element:<Menu />
      },
      {
        path: "/update-profile",
        element: <UpdateProfile/>
      },
      {
        path:"/cart-page",
        element: <CartsPage />
      }
      ]
    },
    {
      path:"/signup",
      element:<Signup />
  }
  ]);

  export default router;