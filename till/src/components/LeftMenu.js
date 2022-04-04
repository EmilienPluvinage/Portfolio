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
import { useTheme, useThemeUpdate } from "./ThemeContext";

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
  EmployeeData,
}) {
  const darkmode = useTheme();
  const toggleTheme = useThemeUpdate();

  return (
    <div id="left-menu">
      <div id="title">
        <img
          width={"50px"}
          height={"50px"}
          src={screenLogoHover}
          alt={"Logo"}
        />
        <h2>Till App</h2>
      </div>
      <div className="ul">
        <PageLink link="/" logo={screenLogo} logoHover={screenLogoHover} />

        <PageLink
          link="Statistics"
          logo={statsLogo}
          logoHover={statsLogoHover}
        />
        <PageLink
          link="Configuration"
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
          onChange={toggleTheme}
        />
      </div>
    </div>
  );
}

export default LeftMenu;
