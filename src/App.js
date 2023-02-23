import logo from "./logo.svg";
import "./App.css";
import SwipeEffect from "./components/swipeEffect/SwipeEffect";
import SwipeObserver from "./components/swipeObserver/SwipeObserver";
import ApiTest from "./components/apiTest/ApiTest";
import TapPay from "./components/tapPay/TapPay";
import ShortUrl from "./components/shortUrl/ShortUrl";
import TappayGooglePay from "./components/tapPay/googlePay/GooglePay";
import TappayLinePay from "./components/tapPay/linePay/LinePay";

function App() {
  return (
    <div className="App">
      {/* <SwipeEffect /> */}
      {/* <SwipeObserver /> */}
      {/* <ApiTest /> */}
      {/* <ShortUrl /> */}
      <TapPay />
      {/* <TappayGooglePay /> */}
      {/* <TappayLinePay /> */}
    </div>
  );
}

export default App;
