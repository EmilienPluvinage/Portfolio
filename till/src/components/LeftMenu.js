import "../styles/leftmenu.css";
import "../styles/switch.css";
import OnHold from "./OnHold";
import Staff from "./Staff";
import PageLink from "./PageLink";
import configLogo from "../img/config-logo.png";
import configLogoHover from "../img/config-logo-hover.png";
import statsLogo from "../img/stats-logo.png";
import statsLogoHover from "../img/stats-logo-hover.png";
import screenLogo from "../img/screen-logo.png";
import screenLogoHover from "../img/screen-logo-hover.png";

function LeftMenu({
  cart,
  updateCart,
  ticket,
  updateTicket,
  ticketsOnHold,
  updateTicketsOnHold,
  putOnHold,
  user,
  updateUser,
  darkmode,
  updateDarkMode,
  EmployeeData,
  page,
  setPage,
}) {
  function setDarkMode(event) {
    if (event.target.checked) {
      updateDarkMode("dark");
    } else {
      updateDarkMode("light");
    }
  }
  return (
    <nav id="left-menu">
      <h2>Till App</h2>
      <div className="ul">
        <PageLink
          link="Main"
          page={page}
          setPage={setPage}
          logo={screenLogo}
          logoHover={screenLogoHover}
        />
        <PageLink
          link="Statistics"
          page={page}
          setPage={setPage}
          logo={statsLogo}
          logoHover={statsLogoHover}
        />
        <PageLink
          link="Configuration"
          page={page}
          setPage={setPage}
          logo={configLogo}
          logoHover={configLogoHover}
        />
      </div>
      <OnHold
        cart={cart}
        updateCart={updateCart}
        ticket={ticket}
        updateTicket={updateTicket}
        ticketsOnHold={ticketsOnHold}
        updateTicketsOnHold={updateTicketsOnHold}
        putOnHold={putOnHold}
        user={user}
        updateUser={updateUser}
        EmployeeData={EmployeeData}
      />
      <Staff user={user} updateUser={updateUser} EmployeeData={EmployeeData} />
      <div style={{ textAlign: "center" }}>DARK MODE</div>
      <div id="dark-mode-switch">
        <input
          className="toggle"
          checked={darkmode === "dark" && "checked"}
          type="checkbox"
          onChange={setDarkMode}
        />
      </div>
    </nav>
  );
}

export default LeftMenu;
