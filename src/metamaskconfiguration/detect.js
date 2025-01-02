/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from "@metamask/detect-provider"
import {toast} from "sonner";

async function setUp() {
  const provider = await detectEthereumProvider()

  if (provider && provider === window.ethereum) {
    console.log("MetaMask is available!")
    startApp(provider)
  } else {
    console.log("Please install MetaMask!")
  }
}

function startApp(provider) {
  if (provider !== window.ethereum) {
    console.error("Do you have multiple wallets installed?")
  }
}

/**********************************************************/
/* Handle chain (network) and chainChanged (per EIP-1193) */
/**********************************************************/



async function handleChainChanged() {
  const chainId = await window.ethereum.request({method: "eth_chainId"});
  if (chainId !== 11155111) {
    toast("please change your chain to sepolia testnetwork", {position: "top-center"});
  }
}
/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

async function getAccount() {
  const accounts = await window.ethereum
    .request({method: "eth_requestAccounts"})
    .catch((err) => {
      if (err.code === 4001) {
        console.log("Please connect to MetaMask.")
      } else {
        console.error(err)
      }
    })
  const account = accounts[0];
  return account;
}
export {setUp, getAccount, handleChainChanged}; 
