import React from "react";
import { Button, Row, Col } from "antd";
const { ethers } = require("ethers");

function Home({ signer }) {

  /*
  we are going to add some pseudo code in here.
  
  1) First we are going to verify the hash of the signature is correct then store the hash
  then we are going to make a new JSON object with the address and discord username from the params or something
  const jsonObj = {
    address: "eth address",
    discord: "discord username"
  }
  const json = JSON.parse(jsonObj);
  await ipfs.files.write("/discord/"+address+".json", json, {create: true});

  and then to verify we are going to use
  await ipfs.files.read("/discord/ethaddress.json");
  */

  const onClick = async () => {
    const message = "Verifying discord for rolebot";
    const signature = await signer.signMessage(message);
    const derivedAddress = ethers.utils.verifyMessage(message, signature);
    alert("The address that signed this message is: " + derivedAddress);
    const shouldBeFalse = derivedAddress == "0x7ddea083385206BeA754Db2a9a3e1A071E601F71";
    alert("This should equate to false: " + shouldBeFalse);
  }

  return (
    <Row justify="center">
      <Col>
        <Button style={{ marginTop: '200px' }} type="primary" size="large" onClick={onClick}>Click me to verify your wallet</Button>
      </Col>
    </Row>
  );
}

export default Home;
