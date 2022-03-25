import "../styles/statistics.css";
import "../styles/payementScreen.css";
import { displayDate, displayPercentage, displayPrice } from "./Functions";

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

  const total = totalByPayementMethods.reduce(
    (acc, item) => (acc += item.total),
    0
  );

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

  // breakdown by VAT rates

  const VATBreakdown = initBreakdown();

  function initBreakdown() {
    var breakdown = [];
    var temp = [];
    var index = function (j) {
      return breakdown.findIndex((e) => e.rate === temp[j].rate);
    };
    for (let i = 0; i < ReceiptsOfTheDay.length; i++) {
      temp = JSON.parse(ReceiptsOfTheDay[i].vatTable);
      for (let j = 0; j < temp.length; j++) {
        if (temp[j].total !== 0) {
          if (index(j) === -1) {
            breakdown.push({ rate: temp[j].rate, total: temp[j].total });
          } else {
            breakdown[index(j)].total += temp[j].total;
          }
        }
      }
    }
    var total = breakdown.reduce((acc, item) => (acc += item.total), 0);
    return { breakdown: breakdown, total: total };
  }

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
      <p>Breakdown by VAT Rates</p>
      <div>
        {VATBreakdown.breakdown.map((e) => (
          <p key={"breakdownbyvat" + e.rate}>
            {displayPercentage(e.rate / 1000)} : {displayPrice(e.total)} €
          </p>
        ))}

        <p>Total VAT : {displayPrice(VATBreakdown.total)} €</p>
        <p>Total excl tax : {displayPrice(total - VATBreakdown.total)} €</p>
        <p>Total incl tax : {displayPrice(total)} €</p>
      </div>
    </div>
  );
}

export default StatisticsOfTheDay;
