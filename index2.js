const ethers = require('ethers')
const moment = require('moment');
const mysql = require("mysql")

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database:"holderData"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});


const main = async () => {
//   const provider = new ethers.providers.InfuraProvider("homestead","e875cdf3b3764428ac1347a09e65282d")
//   filter = {
//         address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",// contract address
//     topics: [
//       ethers.utils.id("Transfer(address,address,uint256)"),
//     ],
//   };
  con.query("select * from USDT_Record ", function (err, result){
    console.log((moment.duration(moment().diff(moment(result[0].Time),'minutes'))).asMinutes())
  })
//   provider.on(filter, async (tx) => {
    
//   });
};

main();
