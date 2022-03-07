import "../styles/style.css";
import "../styles/item.css";
import "../styles/leftmenu.css";
import "../styles/receipt.css";
import "../styles/topmenu.css";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import Receipt from "./Receipt";
import TopMenu from "./TopMenu";
import Item from "./Item";

function App() {
  return (
    <div>
      <Header />
      <LeftMenu />
      <Receipt />
      <div id="main">
        <TopMenu />
        <Item />
      </div>
    </div>
  );
}

export default App;
