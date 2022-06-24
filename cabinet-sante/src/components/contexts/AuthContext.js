import React, { useState, useContext } from "react";
import { useUpdatePatients } from "./PatientsContext";
import { useUpdateGovData } from "./GovDataContext";
import { useUpdateConfig } from "./ConfigContext";
import { useNavigate } from "react-router-dom";

const LoginContext = React.createContext();
const LoggingContext = React.createContext();

export function useLogin() {
  return useContext(LoginContext);
}

export function useLogging() {
  return useContext(LoggingContext);
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const CheckAppointments = useUpdatePatients().check;
  const getPatients = useUpdatePatients().update;
  const clearPatients = useUpdatePatients().clear;
  const clearConfig = useUpdateConfig().clear;
  const getGovData = useUpdateGovData();
  const getConfig = useUpdateConfig().initData;
  // True or False
  const [login, setLogin] = useState(false);
  // Token to be passed to any SQL query and compared with the one in DB
  const [token, setToken] = useState(null);

  async function removeToken(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/DeleteToken",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
          }),
        }
      );
      const res = await fetchResponse.json();
      return res;
    } catch (e) {
      return e;
    }
  }

  async function logging(bool, newToken) {
    if (bool) {
      setToken(newToken);

      await Promise.allSettled([
        getPatients(newToken),
        getGovData(),
        getConfig(newToken),
      ]);

      CheckAppointments();
      navigate("/CabinetSante/");
    } else {
      clearConfig();
      clearPatients();
      removeToken(token);
      localStorage.removeItem("token");
      setToken(null);
    }
    setLogin(bool);
  }
  return (
    <LoginContext.Provider value={{ login: login, token: token }}>
      <LoggingContext.Provider value={logging}>
        {children}
      </LoggingContext.Provider>
    </LoginContext.Provider>
  );
}
