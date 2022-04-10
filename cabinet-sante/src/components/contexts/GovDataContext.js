import React, { useState, useContext } from "react";

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

  return (
    <GovDataContext.Provider value={{ cities: cities }}>
      <UpdateGovDataContext.Provider value={updateCitiesList}>
        {children}
      </UpdateGovDataContext.Provider>
    </GovDataContext.Provider>
  );
}
