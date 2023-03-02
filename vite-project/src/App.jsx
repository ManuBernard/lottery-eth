import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import Metamask from "./Metamask";
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Metamask />
    </div>
  );
}

export default App;
