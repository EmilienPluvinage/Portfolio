import { Provider as PaperProvider } from "react-native-paper";
import Header from "./Header";
import Main from "./Main";

export default function App() {
  return (
    <PaperProvider>
      <Header />
      <Main />
    </PaperProvider>
  );
}
