import logo from "./logo.svg";
import "./App.css";
import SwipeEffect from "./components/swipeEffect/SwipeEffect";
import SwipeObserver from "./components/swipeObserver/SwipeObserver";
import ApiTest from "./components/apiTest/ApiTest";
import TapPay from "./components/tapPay/TapPay";

function App() {
  return (
    <div className="App">
      {/* <SwipeEffect /> */}
      {/* <SwipeObserver /> */}
      <TapPay />
      {/* <ApiTest /> */}
    </div>
  );
}

export default App;
