import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import store from './store/store';

// Your Auth0 domain and client ID from your Auth0 dashboard
const domain = 'dev-48vrii7xsykextuk.us.auth0.com';
const clientId = 'gcPdRHpDodOG9dLTmM0CiXwlqqmHQdr1';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={domain}
        clientId={clientId}
        authorizationParams={{ redirect_uri: window.location.origin + '/home' }}
      >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>
);
