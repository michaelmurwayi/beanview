import Index from "views/Index.js";
import Profile from "views/features/Profile.js";
import Maps from "views/features/CoffeeTable";
import Register from "views/features/Register.js";
import Login from "views/features/Login.js";
import Tables from "views/features/Tables.js";
import AddCoffee from "views/features/AddCoffee.js";
import UserRecords from "views/features/userRecords";
import CreateCatalogue from "views/features/CreateCatalogue"

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
    path: "/catalogue",
    name: "Catalogue",
    icon: "ni ni-planet text-blue",
    component: <CreateCatalogue />,
    layout: "/admin",
  },
  // {
  //   path: "/catalogue-records",
  //   name: "Catalogue Records",
  //   icon: "ni ni-pin-3 text-orange",
  //   component: <Maps />,
  //   layout: "/admin",
  // },
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
