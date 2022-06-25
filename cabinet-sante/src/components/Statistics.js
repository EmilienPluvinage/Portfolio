import "../styles/styles.css";
import MonthlyPerformance from "./MonthlyPerformance";

export default function Statistics() {
  return (
    <>
      <h2>Statistiques</h2>
      <div className="main-content">
        <MonthlyPerformance />
      </div>
    </>
  );
}
