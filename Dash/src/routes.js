import Dashboard from "views/Index.js";
import AddUser from "views/features/AddUser.js";
import DataTable from "views/features/CoffeeTable";
import ViewCatalogue from "views/features/ViewCatalogues.js";
import Login from "views/features/Login.js";
import Tables from "views/features/Tables.js";
import AddCoffee from "views/features/AddCoffee.js";
import UserRecords from "views/features/userRecords";
import CreateCatalogue from "views/features/CreateCatalogue";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary", // Updated to a more fitting icon for Dashboard
    component: <Dashboard />,
    layout: "/admin",
  },
  {
    path: "/coffee",
    name: "Add New Coffee",
    icon: "fas fa-coffee text-success", // Updated to a more specific coffee-related icon
    component: <AddCoffee />,
    layout: "/admin",
  },
  {
    path: "/coffee-records",
    name: "Coffee Records",
    icon: "fas fa-list-ul text-warning", // List icon to match records
    component: <DataTable />,
    layout: "/admin",
  },
  {
    path: "/catalogue",
    name: "Generate Catalogue",
    icon: "ni ni-archive-2 text-info", // More appropriate icon for catalogue generation
    component: <CreateCatalogue />,
    layout: "/admin",
  },
  {
    path: "/catalogue-view",
    name: "View Catalogues",
    icon: "ni ni-ungroup text-danger", // More fitting icon for viewing catalogues
    component: <ViewCatalogue />,
    layout: "/admin",
  },
  {
    path: "/add-users",
    name: "Add Farmer",
    icon: "ni ni-single-02 text-primary", // 'Add Farmer' fits with 'user-add' icon
    component: <AddUser />,
    layout: "/admin",
  },
  {
    path: "/users",
    name: "Farmer Records",
    icon: "ni ni-bullet-list-67 text-info", // Updated to a more relevant icon
    component: <UserRecords />,
    layout: "/admin",
  },
  {
    path: "/login",
    name: "Payment Schedules",
    icon: "ni ni-credit-card text-warning", // 'credit-card' fits better for payment schedules
    component: <Login />,
    layout: "/auth",
  },

];

export default routes;
