import React, { useState, useEffect } from "react";
import SimpleHeader from "./SimpleHeader.jsx";
import { setUp } from "../metamaskconfiguration/detect.js";
import { getAccount } from "../metamaskconfiguration/detect.js";
import { handleChainChanged } from "../metamaskconfiguration/detect.js";
import { Toaster, toast } from "sonner";
import { ethers } from "ethers";
import Tanjiro from "../abi/Tanjiro.js"; 

const Home = () => {
  const [isGameOver, setIsGameOver] = useState(false);
  const [amount, setAmount] = useState("");
  const [tokensEarned, setTokensEarned] = useState(0);
  const [account, setAccount] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState(""); // success or error
  const SEPOLIA_CHAIN_ID = 1115511; 

  const connectWallet = async () => {
    const userAccount = await getAccount();
    setAccount(userAccount);
    if (userAccount) {
      const chainId  = await window.ethereum.request({method: "eth_chainId"}); 
      if(chainId !== SEPOLIA_CHAIN_ID){
        toast("please change to sepolia test network", {position:"top-center"}); 
      }
      setConnected(true);
    }
    window.ethereum.on("chainChanged", handleChainChanged);
  };

  useEffect(() => {
    window.addEventListener("load", setUp());
  }, []);

  const handleGameClick = () => {
    if (!isGameOver) {
      setTokensEarned(tokensEarned + 1);
    }
  };

  const handleEndGame = () => {
    setIsGameOver(true);
  };

  const handleWithdraw = async () => {
    if (!amount) {
      toast("Please enter the amount to withdraw.", { position: "top-center" });
      return;
    }

    if (tokensEarned <= 0) {
      toast("No tokens earned to withdraw.", { position: "top-center" });
      return;
    }

    setIsProcessing(true);
    setWithdrawalStatus(""); // Reset status
    console.log('startin the main action'); 
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0xBC777eb29B4f392b5fD1aFe9BC71A75ED8f7A6d2"; 
      console.log("checking provider"); 
      console.log(provider); 
      console.log('checking signer'); 
      console.log(signer); 
      console.log('checking amount'); 
      console.log(amount); 
      console.log("checking contract address"); 
      console.log(contractAddress); 
      const contract = new ethers.Contract(contractAddress, Tanjiro, signer);
      const tx = await contract.mint(
        `${account}`.toString(), (amount * 100).toString()
      );
      await tx.wait();
      setIsProcessing(false);
      setWithdrawalStatus("success");
      //deduct balance
      setTokensEarned(tokensEarned - amount); 
      toast.success("Tokens withdrawn successfully!", { position: "top-center" });
    } catch (error) {
      console.log("error occured"); 
      console.log(error); 
      setIsProcessing(false);
      setWithdrawalStatus("error");
      toast.error("Error withdrawing tokens. make sure your wallet is connected.", { position: "top-center" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-pink-600 to-red-500 flex flex-col items-center justify-center relative overflow-hidden gap-2">
      <div className="absolute w-96 h-96 bg-white opacity-10 rounded-full -top-10 -left-20 animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-white opacity-20 rounded-full -bottom-20 -right-10 animate-pulse"></div>
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Main Content */}
      <div className="z-10 bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 max-w-3xl w-full">
        <SimpleHeader connectWallet={connectWallet} connected={connected} account={account} />
        <Toaster className="font-anime" />
        <div className="text-center mb-6">
          <img
            src="https://i.ibb.co/DMmwtBZ/Tanjiro.jpg"
            alt="Tanjiro"
            className="w-48 h-48 object-cover mx-auto rounded-full shadow-2xl"
          />
        </div>
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 text-center mb-4 font-anime">
          Tanjiro Token
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 text-center font-anime">play to earn tokens</h2>

        {/* Total Tokens Earned */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 font-anime">Tokens Earned: {tokensEarned}</h2>
          <p className="mt-4 text-lg text-gray-800 font-anime">Demons slayed: {tokensEarned}</p>
        </div>

        {/* Game Section */}
        <div className="mb-8 space-y-4 flex flex-col items-center">
          {!isGameOver ? (
            <>
              <div className="flex flex-col items-center">
                <button
                  onClick={handleGameClick}
                  className="w-48 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-2xl font-anime"
                >
                  slay demon
                </button>
              </div>
              <button
                onClick={handleEndGame}
                className="mt-6 w-48 bg-gradient-to-r from-red-500 to-yellow-500 text-white py-3 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-2xl font-anime"
              >
                End Game
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-gray-800 text-center font-anime mt-[-2rem]">
                Withdraw Your Tokens
              </h2>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700 font-anime">Enter Amount to Withdraw</label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="border border-gray-300 rounded-lg p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Withdrawal Button with animation */}
              <button
                onClick={handleWithdraw}
                className={`mt-6 w-48 py-3 rounded-lg shadow-lg transform transition hover:scale-105 hover:shadow-2xl font-anime ${
                  isProcessing
                    ? "bg-gradient-to-r from-yellow-500 to-red-500 cursor-wait"
                    : "bg-gradient-to-r from-blue-500 to-teal-500 text-white"
                }`}
              >
                {isProcessing ? (
                  <span className="animate-spin">Processing...</span>
                ) : (
                  "Withdraw Tokens"
                )}
              </button>
              {withdrawalStatus === "success" && (
                <div className="text-green-500 mt-4">Withdrawal Successful!</div>
              )}
              {withdrawalStatus === "error" && (
                <div className="text-red-500 mt-4">make sure your wallet is connected</div>
              )}
            </>
          )}
        </div>
      </div>

      <footer className="text-white text-center text-lg">
        <p>
          Built with love by <span className="font-bold font-anime">Farouk Hamisu</span>
        </p>
      </footer>
    </div>
  );
};

export default Home;
