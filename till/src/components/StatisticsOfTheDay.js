import "../styles/statistics.css";
import "../styles/payementScreen.css";
import { displayDate, displayPrice } from "./Functions";

function StatisticsOfTheDay({
  darkmode,
  today,
  ReceiptsOfTheDay,
  EmployeeData,
}) {
  const payementMethods = ReceiptsOfTheDay.reduce(
    (acc, item) =>
      acc.includes(item.payement) ? acc : acc.concat(item.payement),
    []
  );

  // breakdown by payements methods

  const totalByPayementMethods = payementMethods.map((method) => {
    return {
      method: method,
      total: ReceiptsOfTheDay.reduce(
        (acc, item) => (item.payement === method ? (acc += item.total) : acc),
        0
      ),
    };
  });

  // breakdown by staff members

  const StaffMembers = EmployeeData.map((e) => e.name);

  const totalByStaffMembers = StaffMembers.map((user) => {
    return {
      user: user,
      total: ReceiptsOfTheDay.reduce(
        (acc, item) => (item.user === user ? (acc += item.total) : acc),
        0
      ),
    };
  });

  return (
    <div className="print" style={{ textAlign: "center" }}>
      <p>{displayDate(today, true)}</p>
      <p>Breakdown by Payement Method</p>
      <div>
        {totalByPayementMethods.map((e) => (
          <p key={"breakdownbymethod" + e.method}>
            {e.method} : {displayPrice(e.total)} €
          </p>
        ))}
      </div>
      <p>Breakdown by Staff Member</p>
      <div>
        {totalByStaffMembers.map((e) => (
          <p key={"breakdownbystaff" + e.user}>
            {e.user} : {displayPrice(e.total)} €
          </p>
        ))}
      </div>
    </div>
  );
}

export default StatisticsOfTheDay;
