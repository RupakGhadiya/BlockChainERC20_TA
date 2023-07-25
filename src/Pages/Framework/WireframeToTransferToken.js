import React from "react";
import { useState } from "react";
import Web3 from "web3";
const rpcPolygonMumbai = "https://rpc.ankr.com/polygon_mumbai";
// const web3 = new Web3(rpcPolygonMumbai);
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_totalSupply",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const WireframeToTransferToken = () => {
  const [senderAddress, setSenderAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");

  const contractAddress = "";
  const privateKey =
    "";
  const web3 = new Web3(rpcPolygonMumbai);
  const contract = new web3.eth.Contract(contractABI, contractAddress);

  const transferTokens = async () => {
    try {
      const data = contract.methods
        .transfer(recipientAddress, amount)
        .encodeABI();
      const gas = await web3.eth.estimateGas({
        to: contractAddress,
        data: data,
        from: senderAddress,
      });
      const gasPrice = await web3.eth.getGasPrice();
      const nonce = await web3.eth.getTransactionCount(senderAddress);
      const txObject = {
        to: contractAddress,
        data: data,
        gas: gas,
        gasPrice: gasPrice,
        nonce: nonce,
      };
      const signedTx = await web3.eth.accounts.signTransaction(
        txObject,
        privateKey
      );
      const receipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );
      console.log("Transaction receipt:", receipt);

      // Clear input fields and show alert
      setSenderAddress("");
      setRecipientAddress("");
      setAmount("");
      alert("Tokens transferred successfully!");
    } catch (error) {
      console.error("Error transferring tokens:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    transferTokens();
  };
  return (
    <div>
      <h2>Transfer Tokens</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Sender Address:</label>
          <input
            type="text"
            value={senderAddress}
            onChange={(e) => setSenderAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Recipient Address:</label>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <button type="submit">Transfer</button>
      </form>
    </div>
  );
};

export default WireframeToTransferToken;
