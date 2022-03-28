import "../styles/statistics.css";
import { displayDate } from "./Functions";
import DropdownMenu from "./DropdownMenu";
import salesLogo from "../img/sales-logo.png";
import salesLogoHover from "../img/sales-logo-hover.png";
import dateLogo from "../img/date-logo.png";
import dateLogoHover from "../img/date-logo-hover.png";

function StatisticsMenu({
  today,
  setToday,
  darkmode,
  Receipts,
  salesDetails,
  setSalesDetails,
}) {
  const dropdownMaxSize = 10;
  const dates = Receipts.reduce(
    (acc, item) =>
      acc.includes(displayDate(new Date(item.time), true))
        ? acc
        : acc.concat(displayDate(new Date(item.time), true)),
    []
  );

  const options = dates
    .slice(0, dropdownMaxSize)
    .filter((date) => date !== displayDate(new Date(today), true));

  function dropdownCallback(value, param1, param2) {
    var splitValue = value.split("-");
    setToday(new Date(splitValue[2], splitValue[1] - 1, splitValue[0]));
    // Removes focus so that we can re-open the menu
    document.activeElement.blur();
  }
  return (
    <div id="statistics-header">
      <div className="stats-menu">
        <DropdownMenu
          options={options}
          callback={dropdownCallback}
          param1={""}
          param2={""}
          text={
            <img
              src={dateLogo}
              onMouseOver={(e) => (e.currentTarget.src = dateLogoHover)}
              onMouseOut={(e) => (e.currentTarget.src = dateLogo)}
              alt="Date"
              height="60px"
            />
          }
          darkmode={darkmode}
        />
      </div>
      <div className="stats-menu">
        <img
          src={salesLogo}
          onMouseOver={(e) => (e.currentTarget.src = salesLogoHover)}
          onMouseOut={(e) => (e.currentTarget.src = salesLogo)}
          onClick={() => setSalesDetails((current) => !current)}
          alt="Détails des Ventes"
          height="50px"
        />
      </div>
    </div>
  );
}

export default StatisticsMenu;
