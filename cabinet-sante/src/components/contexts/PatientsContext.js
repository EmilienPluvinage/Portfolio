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
  const [checkOpen, setCheckOpen] = useState(false);

  async function initData(token) {
    updatePatientsList(token);
    updateAppointmentsList(token);
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
            ? " (" + calculateAge(element.birthday) + " ans)"
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
      value={{ patients: patients, appointments: appointments }}
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
