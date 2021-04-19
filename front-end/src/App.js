import {BrowserRouter as Router} from "react-router-dom";
import Home from "./Home";
import Jumbotron from "./Jumbotron";



function App() {
  return (
    <Router>
      <div className="App">
        <Jumbotron/>
        <Home/>
      </div>
    </Router>
  );
}

export default App;
