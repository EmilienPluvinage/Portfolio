import React, { useState, useContext } from "react";
import { calculateAge } from "../Functions";

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
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetPatients",
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
      res.data.forEach((element) => {
        element.fullname =
          element.firstname +
          " " +
          element.lastname +
          (element.birthday !== ""
            ? " (" + calculateAge(element.birthday) + " ans)"
            : "");
      });
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
