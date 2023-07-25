import React from "react";
import Nav from "./Nav";
import { Route, Routes } from "react-router-dom";
import Swap from "./Pages/Swap/TransferNative";
import TransferToken from "./Pages/TransferToken/TransferToken";

const App = () => {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Swap />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/token" element={<TransferToken />} />
      </Routes>
    </>
  );
};

export default App;
