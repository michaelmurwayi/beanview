// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App";
import store from "./store/store"; // adjust path if needed

// 🔑 Redirect callback handler
const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-48vrii7xsykextuk.us.auth0.com" // your tenant domain
      clientId="gcPdRHpDodOG9dLTmM0CiXwlqqmHQdr1" // your app clientId
      authorizationParams={{
        redirect_uri: window.location.origin + "/home",
      }}
      onRedirectCallback={onRedirectCallback} // 👈 added this
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
