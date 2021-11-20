import { Game } from "./components/game"
import gameJson from "./board.json";

function App() {
  return (
    <div style={{flex: 1}}>
      <Game {...gameJson} />
    </div>
  );
}

export default App;
