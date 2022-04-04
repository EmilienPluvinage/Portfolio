import "../styles/styles.css";
import { Routes, Route } from "react-router-dom";

function Main({ menu }) {
  return (
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
  );
}

export default Main;
