import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/DataTable";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import AddCoffee from "views/examples/AddCoffee.js";
import UserRecords from "views/examples/userRecords";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
  },
  {
    path: "/coffee",
    name: "Coffee",
    icon: "ni ni-planet text-blue",
    component: <AddCoffee />,
    layout: "/admin",
  },
  {
    path: "/coffee-records",
    name: "Coffee Records",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
  },
  {
    path: "/add-users",
    name: "Add Users",
    icon: "ni ni-single-02 text-yellow",
    component: <Profile />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Users Records",
    icon: "ni ni-bullet-list-67 text-red",
    component: <UserRecords />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
  },
];
export default routes;
