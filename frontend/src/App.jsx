import "./App.css";
import Board from "./assets/components/Board";
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:5000';

function App() {
  return (
    <div className="App">
      <Board />
    </div>
  );
}

export default App;
