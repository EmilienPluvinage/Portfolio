import "../styles/statistics.css";
import "../styles/payementScreen.css";
import { displayDate, displayPercentage, displayPrice } from "./Functions";

function StatisticsOfTheDay({ today, ReceiptsOfTheDay, EmployeeData }) {
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
    <div className="statistics-breakdown">
      <p style={{ textAlign: "center", textDecoration: "underline" }}>
        SUMMARY {displayDate(today, true)}
      </p>
      <p>Breakdown by Payement Method</p>
      <div>
        <p>
          {totalByPayementMethods.map((e) => (
            <span key={"breakdownbymethod" + e.method}>
              {e.method} : {displayPrice(e.total)} €
              <br />
            </span>
          ))}
        </p>
      </div>
      <p>Breakdown by Staff Member</p>
      <div>
        <p>
          {totalByStaffMembers.map((e) => (
            <span key={"breakdownbystaff" + e.user}>
              {e.user} : {displayPrice(e.total)} €
              <br />
            </span>
          ))}
        </p>
      </div>
      <p>Breakdown by VAT Rates</p>
      <div>
        <p>
          {VATBreakdown.breakdown.map((e) => (
            <span key={"breakdownbyvat" + e.rate}>
              {displayPercentage(e.rate / 1000)} : {displayPrice(e.total)} €
              <br />
            </span>
          ))}

          <span>
            Total VAT : {displayPrice(VATBreakdown.total)} €<br />
          </span>
          <span>
            Total excl tax : {displayPrice(total - VATBreakdown.total)} €<br />
          </span>
          <span>
            Total incl tax : {displayPrice(total)} €<br />
          </span>
        </p>
      </div>
    </div>
  );
}

export default StatisticsOfTheDay;
