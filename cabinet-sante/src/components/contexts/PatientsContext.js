import React, { useState, useContext } from "react";

const PatientsContext = React.createContext();
const UpdatePatientsContext = React.createContext();

export function usePatients() {
  return useContext(PatientsContext);
}

export function useUpdatePatients() {
  return useContext(UpdatePatientsContext);
}

export function PatientsProvider({ children }) {
  // True or False
  const [patients, setPatients] = useState([]);

  async function updatePatientsList(token) {
    try {
      const fetchResponse = await fetch("http://localhost:3001/GetPatients", {
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
      setPatients(res.data);
    } catch (e) {
      return e;
    }
  }

  return (
    <PatientsContext.Provider value={patients}>
      <UpdatePatientsContext.Provider value={updatePatientsList}>
        {children}
      </UpdatePatientsContext.Provider>
    </PatientsContext.Provider>
  );
}