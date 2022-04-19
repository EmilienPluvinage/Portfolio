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

  async function initData(token) {
    updateAppointmentTypesList(token);
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
      }
    } catch (e) {
      return e;
    }
  }

  return (
    <ConfigContext.Provider
      value={{ appointmentTypes: appointmentTypes, patientTypes: patientTypes }}
    >
      <UpdateConfigContext.Provider value={initData}>
        {children}
      </UpdateConfigContext.Provider>
    </ConfigContext.Provider>
  );
}
