import React, { useState, useContext } from "react";

const LoginContext = React.createContext();
const LoginUpdateContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function useLoginUpdate() {
  return useContext(LoginUpdateContext);
}

export function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);

  function toggleLogin() {
    setLogin((prev) => !prev);
  }
  return (
    <LoginContext.Provider value={login}>
      <LoginUpdateContext.Provider value={toggleLogin}>
        {children}
      </LoginUpdateContext.Provider>
    </LoginContext.Provider>
  );
}
