// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import store from "./store/store"; // adjust path if needed

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-48vrii7xsykextuk.us.auth0.com" // e.g. dev-abc123.us.auth0.com
      clientId="gcPdRHpDodOG9dLTmM0CiXwlqqmHQdr1" // e.g. XyzAbc123456
      authorizationParams={{
        redirect_uri: window.location.origin + "/home",
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
