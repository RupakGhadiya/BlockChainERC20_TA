import React, { useState, useEffect } from "react";
import "../Swap/Swap.css";
import { ethers } from "ethers";
import { IoSettingsOutline } from "react-icons/io5";
import Loading from "../Loading/Loading";
import erc20abi from "../../ERC20abi.json";
import ErrorMessage from "../ErrorsPages/ErrorMessage";
import TxList from "../ErrorsPages/TxList";

const TransferToken = () => {
  const [txs, setTxs] = useState([]);
  const [contractListened, setContractListened] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [contractInfo, setContractInfo] = useState({
    address: "-",
    tokenName: "-",
    tokenSymbol: "-",
    totalSupply: "-",
  });
  const [balanceInfo, setBalanceInfo] = useState({
    address: "-",
    balance: "-",
  });

  useEffect(() => {
    // if address is not - then
    if (contractInfo.address !== "-") {
      // it is ethers library which helps to intract with the Ethereum network through the user's web3-enabled browser.
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // newly created instance of erc20
      const erc20 = new ethers.Contract(
        // this takes contact address
        contractInfo.address,
        // this takes ABI of a smart contract
        erc20abi,
        provider
      );
      // this all is to transfer a token through from, to  address and provided amount
      erc20.on("Transfer", (from, to, amount, event) => {
        console.log({ from, to, amount, event });

        setTxs((currentTxs) => [
          ...currentTxs,
          {
            txHash: event.transactionHash,
            from,
            to,
            amount: String(amount),
          },
        ]);
      });
      setContractListened(erc20);

      return () => {
        contractListened.removeAllListeners();
      };
    }
  }, [contractInfo.address]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    // provider is ethers library which is a kind of gateway which standerd etherium node functionality (to connect to network like poligon mumbai)
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // this is to validate the address and throw error if address is not valid
    const erc20 = new ethers.Contract(data.get("addr"), erc20abi, provider);

    const tokenName = await erc20.name();
    const tokenSymbol = await erc20.symbol();
    const totalSupply = await erc20.totalSupply();
    // this is to get contract information
    setContractInfo({
      address: data.get("addr"),
      tokenName,
      tokenSymbol,
      totalSupply,
    });
  };
  // this is to get galance
  const getMyBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const erc20 = new ethers.Contract(contractInfo.address, erc20abi, provider);
    const signer = await provider.getSigner();
    const signerAddress = await signer.getAddress();
    const balance = await erc20.balanceOf(signerAddress);

    setBalanceInfo({
      address: signerAddress,
      balance: String(balance),
    });
  };

  const handleTransfer = async (
    e,
    gasPrice = 1.500000019, // Default gas price in gwei
    gasLimit = 200000 // Default gas limit
  ) => {
    try {
      setLoading(true);
      e.preventDefault();
      const data = new FormData(e.target);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();

      // Convert gwei to wei for gasPrice
      const gasPriceInWei = ethers.utils.parseUnits(
        gasPrice.toString(),
        "gwei"
      );

      const erc20 = new ethers.Contract(contractInfo.address, erc20abi, signer);

      // Set up the transaction data with custom gasPrice and gasLimit
      const transactionData = await erc20.populateTransaction.transfer(
        data.get("recipient"),
        data.get("amount"),
        { gasPrice: gasPriceInWei, gasLimit: ethers.BigNumber.from(gasLimit) }
      );

      // Send the transaction
      const transactionResponse = await signer.sendTransaction(transactionData);

      // Wait for the transaction to be confirmed
      await transactionResponse.wait();

      // Update the balance after the transaction
      await getMyBalance();
    } catch (error) {
      console.error("Error transferring tokens:", error);
      window.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="swap" style={{ display: "flex", gap: "10rem" }}>
      <form onSubmit={handleSubmit}>
        <div className="">
          <main className="">
            <div className="swaptop">
              <h1 className="">Contract address you want to transfer</h1>
            </div>
            <div className="">
              <div
                className="swapinput1"
                style={{ width: "100%", height: "65px" }}
              >
                <input
                  style={{
                    border: "1px solid white",
                    borderRadius: "10px",
                    marginTop: "10px",
                    width: "98%",
                  }}
                  type="text"
                  name="addr"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="ERC20 contract address"
                />
              </div>
            </div>
          </main>
          <footer className="">
            <button
              type="submit"
              className=""
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "30px",
                backgroundColor: "white",
                border: "none",
                color: "black",
                marginTop: "0px",
              }}
            >
              Get token info
            </button>
          </footer>
          <div className="px-4">
            <div className="overflow-x-auto">
              <table
                className="table w-full"
                style={{
                  padding: "1rem",
                  color: "gray",
                  border: "3px solid grey",
                  marginTop: "20px",
                  borderRadius: "10px",
                }}
              >
                <thead>
                  <tr style={{ display: "flex", gap: "2rem" }}>
                    <th>Name</th>
                    <th>Symbol</th>
                    <th>Total supply</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    style={{ display: "flex", gap: "2rem", marginTop: "20px" }}
                  >
                    <th>{contractInfo.tokenName}</th>
                    <td>{contractInfo.tokenSymbol}</td>
                    <td>{String(contractInfo.totalSupply)}</td>
                    <td>{contractInfo.deployedAt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="p-4">
            <button
              onClick={getMyBalance}
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "30px",
                backgroundColor: "white",
                border: "none",
                color: "black",
                marginTop: "20px",
              }}
              className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
            >
              Get my balance
            </button>
          </div>
          <div className="px-4">
            <div className="overflow-x-auto">
              <table
                className="table w-full"
                style={{
                  padding: "1rem",
                  color: "gray",
                  border: "3px solid grey",
                  marginTop: "20px",
                  borderRadius: "10px",
                }}
              >
                <tbody>
                  <tr
                    style={{
                      display: "flex",
                      gap: "2rem",
                      marginTop: "0px",
                      flexDirection: "column",
                    }}
                  >
                    <th>Address: {balanceInfo.address}</th>
                    <td>Balance: {balanceInfo.balance}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </form>
      <div className="swap" style={{ paddingTop: "0px" }}>
        <div className="swapcontainer">
          <div className="swapcard">
            <div className="swaptop" style={{ marginTop: "30px" }}>
              <h1 className="text-xl font-semibold text-gray-700 text-center">
                Token Transfer
              </h1>
            </div>
            <form onSubmit={handleTransfer}>
              <div className="swapinput1" style={{ width: "100%" }}>
                <h1 id="swapfrom" style={{ width: "100%" }}>
                  Transfer To
                </h1>
                <input
                  style={{
                    border: "1px solid white",
                    borderRadius: "10px",
                    marginTop: "10px",
                    width: "98%",
                  }}
                  type="text"
                  name="recipient"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Recipient address"
                />
              </div>
              <div className="swapinput1" style={{ width: "100%" }}>
                <h1 id="swapfrom" style={{ width: "100%" }}>
                  Amount
                </h1>
                <input
                  style={{
                    border: "1px solid white",
                    borderRadius: "10px",
                    marginTop: "10px",
                    width: "98%",
                  }}
                  type="text"
                  name="amount"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount to transfer"
                />
              </div>
              <div style={{ textAlign: "center", marginTop: "30px" }}>
                <button type="submit" disabled={loading} className="currency2">
                  {loading ? <Loading /> : "Transfer"}
                </button>
              </div>
            </form>
            <ErrorMessage message={error} />
            <TxList txs={txs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferToken;
