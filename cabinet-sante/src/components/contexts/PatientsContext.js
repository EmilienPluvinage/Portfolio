import React, { useState, useContext } from "react";
import { calculateAge } from "../Functions";
import CheckForIncorrectPrices from "../CheckForIncorrectPrices";

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
  const [checkOpen, setCheckOpen] = useState(false);
  const [relatives, setRelatives] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [pathologies, setPathologies] = useState([]);

  async function initData(token) {
    console.log("enter");
    await Promise.allSettled([
      updatePatientsList(token),
      getData(token, "/GetHistory", setAppointments),
      getData(token, "/GetPayements", setPayements),
      getData(token, "/GetSharedBalance", setSharedBalance),
      getData(token, "/GetRelatives", setRelatives),
      getData(token, "/GetReminders", setReminders),
      getData(token, "/GetPathologies", setPathologies),
      getData(token, "/GetMissedAppointments", setMissedAppointments),
    ]);
    console.log("exit");
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

  function checkPrices() {
    const checks = appointments.map((e) => {
      return {
        check: e.price !== 0 || e.priceSetByUser === true,
        id: e.id,
      };
    });
    const numberOfIncorrectPrices = checks.reduce(
      (acc, item) => (item.check === false ? acc + 1 : acc),
      0
    );
    setCheckOpen(numberOfIncorrectPrices > 0);
  }

  return (
    <PatientsContext.Provider
      value={{
        patients: patients,
        appointments: appointments,
        missedAppointments: missedAppointments,
        payements: payements,
        sharedBalance: sharedBalance,
        relatives: relatives,
        reminders: reminders,
        pathologies: pathologies,
      }}
    >
      <UpdatePatientsContext.Provider
        value={{ update: initData, check: checkPrices }}
      >
        <CheckForIncorrectPrices open={checkOpen} setOpen={setCheckOpen} />
        {children}
      </UpdatePatientsContext.Provider>
    </PatientsContext.Provider>
  );
}
