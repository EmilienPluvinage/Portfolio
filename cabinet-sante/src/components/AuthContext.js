import React, { useState, useContext } from "react";

const LoginContext = React.createContext();
const LoggingContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function useLogging() {
  return useContext(LoggingContext);
}

export function AuthProvider({ children }) {
  const [login, setLogin] = useState(false);

  function logging(bool) {
    setLogin(bool);
  }
  return (
    <LoginContext.Provider value={login}>
      <LoggingContext.Provider value={logging}>
        {children}
      </LoggingContext.Provider>
    </LoginContext.Provider>
  );
}
