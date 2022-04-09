import "../styles/styles.css";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "./contexts/AuthContext";
import NewPatient from "./NewPatient";
import PatientList from "./PatientList";
import MyCalendar from "./MyCalendar";

function Main({ menu }) {
  const events = [
    {
      id: 34,
      day: new Date(Date.now()),
      start: "9:00",
      end: "10:00",
      title: "RDV",
    },
    {
      id: 35,
      day: new Date(Date.now()),
      start: "11:00",
      end: "11:30",
      title: "RDV",
    },
    {
      id: 36,
      day: new Date(Date.now()),
      start: "14:00",
      end: "17:00",
      title: "RDV",
    },
  ];
  const loggedIn = useLogin().login;
  return (
    loggedIn && (
      <div id="Main">
        <Routes>
          <Route exact path="/Nouveau-Patient/:id" element={<NewPatient />} />
          <Route exact path="/Nouveau-Patient" element={<NewPatient />} />
          <Route exact path="/Listing-Patients" element={<PatientList />} />
          <Route
            exact
            path="/Agenda"
            element={
              <div className="main-content">
                <MyCalendar
                  options={{ dayStart: 8, dayEnd: 21 }}
                  events={events}
                />
              </div>
            }
          />
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
