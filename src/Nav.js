import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import "./Nav.css";
import { BsMoon } from "react-icons/bs";
import { GoKebabHorizontal } from "react-icons/go";
const Nav = () => {
  const [provider, setProvider] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const providerInstance = new ethers.providers.Web3Provider(
        window.ethereum
      );
      setProvider(providerInstance);
    }
  }, []);

  const handleConnect = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        setIsConnected(true);
        const accounts = await provider.listAccounts();
        alert("Connection successful! ");
      } catch (error) {
        alert("Failed to connect to Metamask: " + error.message);
      }
    } else {
      alert("Please install Metamask to connect.");
    }
  };

  const renderConnectButton = () => {
    if (isConnected) {
      return <button disabled style={{backgroundColor:"green"}}>Connected</button>;
    } else {
      return <button onClick={handleConnect} style={{backgroundColor:"white", color:"black"}}>Connect to Metamask</button>;
    }
  };

  return (
    <div className="nav">
      <div className="NavLogo">
        <h1>J$WAP</h1>
      </div>
      <div className="navLink">
        <Link className="NavlinkA" to="/swap">
        Native
        </Link>
        <Link className="NavlinkA" to="/token">
          Token
        </Link>
        <Link className="NavlinkA" to="/transiction">
          About J$WAP
        </Link>
        <Link className="NavlinkA" to="/post">
          Vote
        </Link>
      </div>
      <div className="NavBtn">
        <Link>
          <button>0 SQA</button>
        </Link>
        <Link>
          {/* <button className="ConnectWallet" onClick={handleConnect}>{isConnected ? 'Connected' : 'Not Connected'}</button> */}
          {renderConnectButton()}
        </Link>
        <Link>
          <button>
            <BsMoon />
          </button>
        </Link>
        <Link>
          <button>
            <GoKebabHorizontal />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Nav;