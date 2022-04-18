import "../styles/styles.css";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "./contexts/AuthContext";
import NewPatient from "./NewPatient";
import PatientList from "./PatientList";
import MyFullCalendar from "./MyFullCalendar";
import Parameters from "./Parameters";

function Main({ menu }) {
  const loggedIn = useLogin().login;
  return (
    loggedIn && (
      <div id="Main">
        <Routes>
          <Route exact path="/Nouveau-Patient/:id" element={<NewPatient />} />
          <Route exact path="/Nouveau-Patient" element={<NewPatient />} />
          <Route exact path="/Listing-Patients" element={<PatientList />} />
          <Route exact path="/Agenda" element={<MyFullCalendar />} />
          <Route exact path="/Parametres" element={<Parameters />} />
          {menu.map(({ link, name }) => (
            <Route
              key={link}
              exact
              path={link}
              element={
                <div>
                  <h2>{name}</h2>
                  <div className="main-content"> {name}</div>
                </div>
              }
            />
          ))}
        </Routes>
      </div>
    )
  );
}

export default Main;
