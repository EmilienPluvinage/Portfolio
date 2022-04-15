import React, { useState, useContext } from "react";
import { moveToFirst, sortByDepartment } from "../Functions";

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
      var res = await fetchResponse.json();

      // we first order it by putting all the cities from one department at the top
      // ideally we would get the department number from the user's address but for now this will do.
      res = sortByDepartment(res, "34");

      // then take only the info we need (ie city name and postcode)
      var result = res.map(function (a) {
        return a.nom + " (" + a.codesPostaux[0] + ")";
      });

      // finally we move the most used city to the top
      // right now this is hardcoded but once there is enough data in the DB
      // it could be done by looking at the actual data of the most types cities.

      moveToFirst(result, "Saint-Clément-de-Rivière (34980)");
      moveToFirst(result, "Paris (75001)");
      moveToFirst(result, "Montpellier (34070)");
      moveToFirst(result, "Teyran (34820)");
      moveToFirst(result, "Assas (34820)");
      moveToFirst(result, "Prades-le-Lez (34730)");
      moveToFirst(result, "Saint-Vincent-de-Barbeyrargues (34730)");
      setCities(result);
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
