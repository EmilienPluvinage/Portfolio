import React, { useState, useContext } from "react";
import { useUpdatePatients } from "./PatientsContext";
import { useUpdateGovData } from "./GovDataContext";

const LoginContext = React.createContext();
const LoggingContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function useLogging() {
  return useContext(LoggingContext);
}

export function AuthProvider({ children }) {
  const getPatients = useUpdatePatients();
  const getGovData = useUpdateGovData();
  // True or False
  const [login, setLogin] = useState(false);
  // Token to be passed to any SQL query and compared with the one in DB
  const [token, setToken] = useState(null);

  async function removeToken(token) {
    try {
      const fetchResponse = await fetch("http://localhost:3001/DeleteToken", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
        }),
      });
      const res = await fetchResponse.json();
      return res;
    } catch (e) {
      return e;
    }
  }

  function logging(bool, newToken) {
    setLogin(bool);
    if (bool) {
      setToken(newToken);
      getPatients(newToken);
      getGovData();
    } else {
      removeToken(token);
      localStorage.removeItem("token");
      setToken(null);
    }
  }
  return (
    <LoginContext.Provider value={{ login: login, token: token }}>
      <LoggingContext.Provider value={logging}>
        {children}
      </LoggingContext.Provider>
    </LoginContext.Provider>
  );
}
