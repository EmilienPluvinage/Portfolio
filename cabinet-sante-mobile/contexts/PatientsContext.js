import React, { useState, useContext } from "react";
import { calculateAge } from "../Functions/Functions";
import { REACT_APP_API_DOMAIN } from "@env";

const PatientsContext = React.createContext();
const UpdatePatientsContext = React.createContext();

export function usePatients() {
  return useContext(PatientsContext);
}

export function useUpdatePatients() {
  return useContext(UpdatePatientsContext);
}

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [missedAppointments, setMissedAppointments] = useState([]);
  const [payements, setPayements] = useState([]);
  const [sharedBalance, setSharedBalance] = useState([]);

  const [reminders, setReminders] = useState([]);

  async function initData(token) {
    await Promise.allSettled([
      updatePatientsList(token),
      getData(token, "/GetHistory", setAppointments),
      getData(token, "/GetPayements", setPayements),
      getData(token, "/GetSharedBalance", setSharedBalance),
      getData(token, "/GetReminders", setReminders),
      getData(token, "/GetMissedAppointments", setMissedAppointments),
    ]);
  }

  function clear() {
    setPatients([]);
    setAppointments([]);
    setMissedAppointments([]);
    setPayements([]);
    setSharedBalance([]);
    setReminders([]);
  }

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
            ? " (" + calculateAge(element.birthday, element.death) + " ans)"
            : "");
        // we stringify this before storing it in DB since this is an array of 0 to 2 values.
        element.hand = element.hand === "" ? "" : JSON.parse(element.hand);
      });
      setPatients(res.data);
    } catch (e) {
      return e;
    }
  }

  async function getData(token, path, callback) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + path,
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
      callback(res.data);
    } catch (e) {
      return e;
    }
  }

  return (
    <PatientsContext.Provider
      value={{
        patients: patients,
        appointments: appointments,
        missedAppointments: missedAppointments,
        payements: payements,
        sharedBalance: sharedBalance,
        reminders: reminders,
      }}
    >
      <UpdatePatientsContext.Provider
        value={{ update: initData, clear: clear }}
      >
        {children}
      </UpdatePatientsContext.Provider>
    </PatientsContext.Provider>
  );
}
