import React from "react";
import { WaveLoading } from "react-loadingg";

function LoginForm({
  onClickCreate,
  password,
  email,
  handleLogin,
  handleLoginForm,
  isLoading,
  isError,
  loginErrorMessage,
}) {
  return (
    <div className="loginFormMainDiv">
      <input
        type="email"
        value={email}
        name="email"
        onChange={handleLoginForm}
        placeholder="Email address"
      />
      <input
        type="password"
        value={password}
        onChange={handleLoginForm}
        name="password"
        placeholder="Password"
      />
      {isError && (
        <div className="errorMessageContainer">
          <p>{loginErrorMessage}</p>
        </div>
      )}
      <button disabled={isLoading} onClick={handleLogin}>
        {!isLoading ? (
          "Log In"
        ) : (
          <WaveLoading
            size="small"
            color="var(--primary-background)"
            style={{ margin: "auto" }}
          />
        )}
      </button>
      <hr className="hrLoginForm" />
      <button onClick={onClickCreate}>Create New Account</button>
    </div>
  );
}

export default LoginForm;
