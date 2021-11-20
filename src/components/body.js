import { useState } from "react";

function Body(props) {
  const name = props.name;
  const type = props.type;
  const owner = props.owner;
  const ally = props.ally;
  const setOwner = props.setOwner;
  const setAlly = props.setAlly;
  const dieN = props.dieN;
  const dieHidden = props.dieHidden;
  const setDieHidden = props.setDieHidden;
  const isIpec = props.isIpec;
  const ipecHidden = props.ipecHidden;
  const setIpecHidden = props.setIpecHidden;
  const availableColors = props.availableColors;
  const color = props.color;

  const getIpec = () => {
    return ipecHidden ? "???" : isIpec ? "ipec controlled" : "free";
  }

  const getDieN = () => {
    return dieHidden ? "???" : "" + dieN;
  }

  const getOwnerColor = () => {
    let c = availableColors[owner - 1];
    return c ? c : "#777777";
  }

  const getAllyColor = () => {
    let c = availableColors[ally - 1];
    return c ? c : "#000000";
  }

  const rotateOwnerColor = () => {
    setOwner((owner + 1) % (availableColors.length + 1));
  }

  const rotateAllyColor = () => {
    setAlly((ally + 1) % (availableColors.length + 1));
  }

  let label;
  if (type == 2) {
    label = (
      <p><strong>{name}</strong><br/>{" "}</p>
    )
  } else {
    label = (
      <p><strong>{name}</strong><br/>
        {"die: " + getDieN() + "     ipec: " + getIpec()}</p>
    )
  }

  return (
    <div style={Object.assign({
      overflow: "hidden",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "stretch",
      backgroundColor: color,
      borderRadius: 12,
      borderWidth: 5,
      borderStyle: "solid",
      borderColor: getAllyColor(),
      margin: 12
    }, props.style)}>
      <div style={{
        display: "flex", 
        textAlign: "center", 
        flex: 14, 
        flexDirection: "column", 
        justifyContent: "center", 
        alignItems: "center", 
        whiteSpace: "pre-wrap",
        userSelect: "none",
        // color: "white"
      }}
        onClick={() => {rotateAllyColor()}}>
        {label}
      </div>
      <div style={{display: "flex", flex: 5, flexDirection: "column"}}>
        <input type="button" value="reveal die" style={{display: "flex", flex: 1}} onClick={() => setDieHidden(false)} />
        <input type="button" value="reveal ipec" style={{display: "flex", flex: 1}} onClick={() => setIpecHidden(false)} />
      </div>
      <div style={{diplay: "flex", flex: 5, backgroundColor: getOwnerColor(), minWidth: "auto"}} 
        onClick={() => {rotateOwnerColor()}} />
    </div>
  );
} 

export { Body };
