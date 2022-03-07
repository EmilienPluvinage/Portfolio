import "../styles/style.css";
import "../styles/item.css";
import "../styles/leftmenu.css";
import "../styles/receipt.css";
import "../styles/topmenu.css";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import Receipt from "./Receipt";
import TopMenu from "./TopMenu";
import ItemsList from "./ItemsList";
import { useState } from "react";

function App() {
  const [cart, updateCart] = useState(0);
  const [menu, updateMenu] = useState("Viennoiserie");

  return (
    <div id="parent">
      <Header />
      <LeftMenu />
      <Receipt cart={cart} updateCart={updateCart} />
      <div id="main">
        <TopMenu menu={menu} updateMenu={updateMenu} />
        <ItemsList category={menu} cart={cart} updateCart={updateCart} />
      </div>
    </div>
  );
}

export default App;
