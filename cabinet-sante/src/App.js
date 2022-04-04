import "./styles/styles.css";
import Header from "./components/Header";
import Main from "./components/Main";
import LeftMenu from "./components/LeftMenu";

function App() {
  return (
    <div id="App">
      <Header />
      <div id="parent">
        <LeftMenu />
        <Main />
      </div>
    </div>
  );
}

export default App;
