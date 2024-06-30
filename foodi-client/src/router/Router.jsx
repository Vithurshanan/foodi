import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Home from "../pages/home/Home";
import Menu from "../pages/shop/Menu";
import Signup from "../components/Signup";
import UpdateProfile from "../pages/dashboard/UpdateProfile";
import PrivateRouter from "../PrivateRouter/PrivateRouter";
import CartsPage from "../pages/shop/CartsPage";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/dashboard/admin/Dashboard";
import Users from "../pages/dashboard/admin/Users";
import AddMenu from "../pages/dashboard/admin/Addmenu";
import ManageItems from "../pages/dashboard/admin/ManageItems";
import UpdateMenu from "../pages/dashboard/admin/UpdateMenu";
import Login from "../components/Login";
import ManageBooking from "../pages/dashboard/admin/ManageBooking";
import Payment from "../pages/shop/Payment";

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
      },
      {
        path:"/process-checkout",
        element: <Payment />
      }
      ]
    },
    {
      path:"/signup",
      element:<Signup />
  },
    {
      path:"/login",
      element:<Login />
  },
  {
    path:"/dashboard",
    element:<PrivateRouter><DashboardLayout /></PrivateRouter>,
    children:[
      {
        path: '',
        element: <Dashboard/>
      },
      {
        path: 'users', 
        element: <Users/>
      },
      {
        path: 'manage-bookings', 
        element: <ManageBooking />
      },
      {
        path: 'add-menu',
        element: <AddMenu/>
      }, 
      {
        path: "manage-items",
        element: <ManageItems/>
      },
      {
        path: "update-menu/:id",
        element: <UpdateMenu/>,
        loader: ({params}) => fetch(`http://localhost:8080/menu/${params.id}`)
      }
    ]
}
  ]);

  export default router;