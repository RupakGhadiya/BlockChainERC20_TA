import React, { useState } from "react";
import "./Swap.css";
import { ethers } from "ethers";
import { IoSettingsOutline } from "react-icons/io5";
import Loading from "../Loading/Loading";
import ErrorMessage from "../ErrorsPages/ForNative/ErrorMessage";
import TxList from "../ErrorsPages/ForNative/TxList";

export default function Swap() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState();

  const startPayment = async ({ setError, setTxs, ether, addr }) => {
    try {
      setLoading(true);
      // if user dosen't have a metamask extension
      if (!window.ethereum)
        throw new Error("No crypto wallet found. Please install it.");
      // to connect page to Metamask
      await window.ethereum.send("eth_requestAccounts");
      // provider is ethers library which is a kind of gateway which standerd etherium node functionality (to connect to network like poligon mumbai)
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // this is to validate address (it will throw error to address who dosent exist)
      ethers.utils.getAddress(addr);
      // to create transection
      const tx = await signer.sendTransaction({
        to: addr,
        // ethers.utils is a keyword to convert value in wei (Wei is a unit converted accourding to the decimal)
        value: ethers.utils.parseEther(ether),
      });

      console.log({ ether, addr });
      console.log("tx", tx);
      setTxs([tx]);
      window.alert("Transection Successfully ");
    } catch (err) {
      setError(err.message);
      window.alert(err.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: data.get("ether"),
      addr: data.get("addr"),
    });
  };

  return (
    <div className="swap">
      <div className="swapcontainer">
        <div className="swapcard">
          <div className="swaptop">
            <h1>
              Transfer Native Currency
              <span>
                <IoSettingsOutline />
              </span>
            </h1>
          </div>
          <div className="" style={{ flexDirection: "row", gap: "2rem" }}>
            <form onSubmit={handleSubmit}>
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
                  name="addr"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Enter Reciever's Address"
                ></input>
              </div>
              <div
                className="swapinput1"
                style={{ width: "100%", marginTop: "2rem" }}
              >
                <h1 id="swapfrom">Amount</h1>
                <input
                  style={{
                    border: "1px solid white",
                    borderRadius: "10px",
                    marginTop: "10px",
                    width: "98%",
                  }}
                  name="ether"
                  type="text"
                  className="input input-bordered block w-full focus:ring focus:outline-none"
                  placeholder="Amount"
                ></input>
              </div>
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button type="submit" disabled={loading} className="currency2">
                  {loading ? <Loading /> : "Transfer"}
                </button>
              </div>
            </form>
          </div>
          <div style={{marginTop:"5rem"}}>
            <TxList txs={txs} />
          </div>
        </div>
      </div>
    </div>
  );
}
