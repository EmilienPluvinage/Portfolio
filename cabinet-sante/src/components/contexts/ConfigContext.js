import React, { useState, useContext } from "react";

const ConfigContext = React.createContext();
const UpdateConfigContext = React.createContext();

export function useConfig() {
  return useContext(ConfigContext);
}

export function useUpdateConfig() {
  return useContext(UpdateConfigContext);
}

export function ConfigurationProvider({ children }) {
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [priceScheme, setPriceScheme] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [pathologies, setPathologies] = useState([]);

  async function initData(token) {
    await Promise.allSettled([
      updateAppointmentTypesList(token),
      getPathologiesList(token),
    ]);
  }

  async function updateAppointmentTypesList(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetConfigData",
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
      if (res.success) {
        setAppointmentTypes(res.data.appointmentTypes);
        setPatientTypes(res.data.patientTypes);
        setPackages(res.data.packages);
        setPriceScheme(res.data.priceScheme);
        setParameters(res.data.parameters);
      }
    } catch (e) {
      return e;
    }
  }

  async function getPathologiesList(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetPathologiesList",
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
      if (res.success) {
        setPathologies(res.data);
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <ConfigContext.Provider
      value={{
        appointmentTypes: appointmentTypes,
        patientTypes: patientTypes,
        packages: packages,
        priceScheme: priceScheme,
        parameters: parameters,
        pathologies: pathologies,
      }}
    >
      <UpdateConfigContext.Provider value={initData}>
        {children}
      </UpdateConfigContext.Provider>
    </ConfigContext.Provider>
  );
}
