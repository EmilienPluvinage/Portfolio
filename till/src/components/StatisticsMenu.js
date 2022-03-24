import "../styles/statistics.css";
import { displayDate } from "./Functions";
import DropdownMenu from "./DropdownMenu";

function StatisticsMenu({ today, setToday, darkmode, Receipts }) {
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
          text={displayDate(today, true)}
          darkmode={darkmode}
        />
      </div>
      <div className="stats-menu">Sales details</div>
    </div>
  );
}

export default StatisticsMenu;
