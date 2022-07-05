const { ethers } = require("ethers");
const mysql = require("mysql");
const provider = new ethers.providers.InfuraProvider(
  "homestead",
  "e875cdf3b3764428ac1347a09e65282d"
);
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "holderData",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

let holderList = [];
const main = async () => {
  con.query("select HolderAddress from USDT_Holder", async function (err, result) {
    result.forEach((element) => {
      if (err) throw err;
    //   console.log(element.HolderAddress);
      holderList.push(element.HolderAddress);
    });
    console.log("start")
    const contractAddr = "0xb1F8e55c7f64D203C1400B9D8555d050F94aDF39"
    const contractAbi = [{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"token","type":"address"}],"name":"tokenBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"users","type":"address[]"},{"name":"tokens","type":"address[]"}],"name":"balances","outputs":[{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"}]
    const contract = new ethers.Contract(contractAddr, contractAbi, provider)
    const res = await contract.balances(holderList,["0xdAC17F958D2ee523a2206206994597C13D831ec7"])
    res.forEach((balance,index)=>{
        if(balance.toNumber()!=0){
            console.log(holderList[index]+": "+balance.toNumber()/1000000)
        }
    })
  });
};

main();
