import React, { useState, useContext } from "react";
import { moveToFirst } from "../Functions";

const GovDataContext = React.createContext();
const UpdateGovDataContext = React.createContext();

export function useGovData() {
  return useContext(GovDataContext);
}

export function useUpdateGovData() {
  return useContext(UpdateGovDataContext);
}

export function GovDataProvider({ children }) {
  // True or False
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);

  async function initData() {
    updateCitiesList();
    updateCountriesList();
  }

  async function updateCitiesList() {
    try {
      const fetchResponse = await fetch("https://geo.api.gouv.fr/communes", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await fetchResponse.json();
      setCities(res);
    } catch (e) {
      return e;
    }
  }

  async function updateCountriesList() {
    try {
      const fetchResponse = await fetch("https://happyapi.fr/api/getLands", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      const res = await fetchResponse.json();

      var result = Object.values(res.result.result);
      moveToFirst(result, "Italie");
      moveToFirst(result, "Espagne");
      moveToFirst(result, "États-Unis");
      moveToFirst(result, "Royaume-Uni");
      moveToFirst(result, "France");
      setCountries(result);
    } catch (e) {
      return e;
    }
  }

  return (
    <GovDataContext.Provider value={{ cities: cities, countries: countries }}>
      <UpdateGovDataContext.Provider value={initData}>
        {children}
      </UpdateGovDataContext.Provider>
    </GovDataContext.Provider>
  );
}
