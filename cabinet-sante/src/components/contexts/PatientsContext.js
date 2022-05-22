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
  const [payements, setPayements] = useState([]);
  const [sharedBalance, setSharedBalance] = useState([]);
  const [checkOpen, setCheckOpen] = useState(false);
  const [relatives, setRelatives] = useState([]);
  const [reminders, setReminders] = useState([]);

  async function initData(token) {
    console.log("enter");
    await Promise.allSettled([
      updatePatientsList(token),
      updateAppointmentsList(token),
      updatePayementsList(token),
      updateSharedBalance(token),
      updateRelatives(token),
      updateReminders(token),
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

  async function updateAppointmentsList(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetHistory",
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
      setAppointments(res.data);
    } catch (e) {
      return e;
    }
  }

  async function updatePayementsList(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetPayements",
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
      setPayements(res.data);
    } catch (e) {
      return e;
    }
  }

  async function updateSharedBalance(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetSharedBalance",
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
      setSharedBalance(res.data);
    } catch (e) {
      return e;
    }
  }

  async function updateRelatives(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetRelatives",
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
      setRelatives(res.data);
    } catch (e) {
      return e;
    }
  }

  async function updateReminders(token) {
    try {
      const fetchResponse = await fetch(
        process.env.REACT_APP_API_DOMAIN + "/GetReminders",
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
      setReminders(res.data);
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
        payements: payements,
        sharedBalance: sharedBalance,
        relatives: relatives,
        reminders: reminders,
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
