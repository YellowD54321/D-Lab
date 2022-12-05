import logo from "./logo.svg";
import "./App.css";
import SwipeEffect from "./components/swipeEffect/SwipeEffect";
import SwipeObserver from "./components/swipeObserver/SwipeObserver";

function App() {
  return (
    <div className="App">
      {/* <SwipeEffect /> */}
      <SwipeObserver />
    </div>
  );
}

export default App;
