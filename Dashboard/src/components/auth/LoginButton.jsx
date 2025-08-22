import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (!isAuthenticated) {
    return (
      <>
        <button
          className="btn btn-success loginBtn"
          onClick={() => loginWithRedirect()}
        >
          Log In
        </button>
        <br />
      </>
    );
  }
  return null; // don't show login if user is already authenticated
};

export default LoginButton;
