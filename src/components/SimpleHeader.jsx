const SimpleHeader = ({connectWallet, connected, account}) =>{
  function trimAddress(address, length = 6) {
  if (!address) return "";
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}
function redirect (){
  window.location = "https://github.com/farouk-hamisu/erc20-token"; 
}
  return (
     <>
     <div className = "flex  justify-between"> 
        <button className = "font-anime" onClick = {redirect}>About</button>
        <button className = "font-anime" onClick = {connectWallet}>{`${connected ? trimAddress(account): "connect wallet"}`}</button>

    </div>
    </>

  ); 
}
export default SimpleHeader; 
