import { useEffect, useState } from "react";
import { Body } from "./body";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1); // update the state to force render
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function Game(props) {
  const forceUpdate = useForceUpdate();

  // const players = props.players;
  // const systems = props.systems;
  const [systemsState, setSystemsState] = useState(props.systems);
  const [playersState, setPlayersState] = useState(props.players);

  const saveState = () => {
    let obj = {players: playersState, systems: systemsState};
    localStorage.setItem("gameBoard", JSON.stringify(obj));
  }

  const newGame = () => {
    let players = props.players;
    let systems = props.systems;

    let numIpec = 5;
    let diceConfig = {"4": 9, "6": 8, "8": 4, "10": 2, "12": 1};
    let ipec = [];
    let dice = [];

    let l = systems.length * systems[0].bodies.length;
    for (let i = 0; i < systems.length; i++) {
      for (let j = 0; j < systems[i].bodies.length; j++) {
        if (systems[i].bodies[j].type == 2) {
          l--;
        }
        if (numIpec-- > 0) {
          ipec.push(true);
        } else {
          ipec.push(false);
        }
        for (let dt in diceConfig) {
          if (diceConfig[dt]-- > 0) {
            dice.push(dt);
            break;
          }
        }
      }
    }

    shuffleArray(ipec);
    shuffleArray(dice);

    if (dice.length !== l) {
      console.error("body/dice length mismatch")
    }

    let k = 0;
    for (let i = 0; i < systems.length; i++) {
      for (let j = 0; j < systems[i].bodies.length; j++) {
        systems[i].bodies[j].ally = 0;
        if (systems[i].bodies[j].type != 2) {
          systems[i].bodies[j].isIpec = ipec[k];
          systems[i].bodies[j].dieN = dice[k++];
          systems[i].bodies[j].ipecHidden = true;
          systems[i].bodies[j].dieHidden = true;
        }
      }
    }

    setSystemsState(systems);
    setPlayersState(players);
    forceUpdate();
  }

  useEffect(() => {
    let loadedState = JSON.parse(localStorage.getItem("gameBoard"));
    if (loadedState && loadedState != null) {
      setSystemsState(loadedState.systems);
      setPlayersState(loadedState.players);
      forceUpdate();
    } else {
      newGame();
    }
  }, []);
  useEffect(saveState);

  const clearAlliances = () => {
    for (let i = 0; i < systemsState.length; i++) {
      for (let j = 0; j < systemsState[i].bodies.length; j++) {
        systemsState[i].bodies[j].ally = 0;
      }
    }
    forceUpdate();
  }

  const playerColors = () => {
    let arr = [];
    for (let i = 0; i < playersState.length; i++) {
      arr.push(playersState[i].color);
    }
    return arr;
  }

  const setOwner = (x, i, j) => {
    systemsState[i].bodies[j].owner = x;
    forceUpdate();
  }

  const setAlly = (x, i, j) => {
    systemsState[i].bodies[j].ally = x;
    forceUpdate();
  }

  const setDieHidden = (x, i, j) => {
    systemsState[i].bodies[j].dieHidden = x;
    forceUpdate();
  }

  const setIpecHidden = (x, i, j) => {
    systemsState[i].bodies[j].ipecHidden = x;
    forceUpdate();
  }

  return (
    <div style={{display: "flex", flex: 1, flexDirection: "column"}}> 
      <div style={{display: "flex", flex: 1, flexDirection: "row"}}>
        {systemsState.map((system, i) => (
          <div style={{display: "flex", flex: 1, flexDirection: "column"}} key={i}>
            {system.bodies.map((body, j) => (
              <Body {...body} color={system.color} availableColors={playerColors()}
                setOwner={(x) => {setOwner(x, i, j)}} setAlly={(x) => {setAlly(x, i, j)}} key={j}
                setDieHidden={(x) => {setDieHidden(x, i, j)}} setIpecHidden={(x) => {setIpecHidden(x, i, j)}} />
            ))}
          </div>
        ))}
      </div>
      <div style={{height: 20}} />
      <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
        <input type="button" value="new board" onClick={() => {
          if (window.confirm("warning: this will reset the entire board and shuffle ipec and die values")) {
            newGame();
          }
        }} />
        <div style={{width: 100}} />
        <input type="button" value="clear alliances" onClick={clearAlliances} />
      </div>
    </div>
  );
}

export { Game };
