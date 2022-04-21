import "../styles/styles.css";

export default function IncorrectPricesList() {
  // This component is going to display potential incorrect prices for the user to confirm, we the possibility to update them one by one, or to confirm them all in one go.

  return (
    <>
      <h2>Vérification des prix incorrects</h2>
      <div className="main-content">Prix incorrects</div>
    </>
  );
}
