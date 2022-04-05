import "../styles/styles.css";
import { Routes, Route } from "react-router-dom";
import { useLogin } from "./AuthContext";

function Main({ menu }) {
  const loggedIn = useLogin();
  return (
    loggedIn && (
      <div id="Main">
        <Routes>
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
