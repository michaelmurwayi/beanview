// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import App from "./App";
import store from "./store/store";
import { attachAuthInterceptor } from "../apiClient"; // 👈 interceptor

// 🔑 Redirect callback handler
const onRedirectCallback = (appState) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

// 🔑 Wrapper to attach the interceptor
const AuthWrapper = ({ children }) => {
  const { getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    attachAuthInterceptor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-48vrii7xsykextuk.us.auth0.com" // ✅ your tenant domain
      clientId="gcPdRHpDodOG9dLTmM0CiXwlqqmHQdr1" // ✅ your clientId
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "https://f90c6cbbfc26.ngrok-free.app/api", // ✅ must match Django API identifier in Auth0
      }}
      onRedirectCallback={onRedirectCallback}
    >
      <Provider store={store}>
        <AuthWrapper>
          <App />
        </AuthWrapper>
      </Provider>
    </Auth0Provider>
  </React.StrictMode>
);
