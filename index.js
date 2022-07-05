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
  var holders = [];   
  con.query("select HolderAddress from USDT_Holder", async function (err, result) {
    result.forEach((element) => {
      if (err) throw err;
    //   console.log(element.HolderAddress);
      holders.push(element.HolderAddress);
    });
  });
  const provider = new ethers.providers.InfuraProvider("homestead","e875cdf3b3764428ac1347a09e65282d")
  filter = {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",// contract address
    topics: [
      // the name of the event, parnetheses containing the data type of each event, no spaces
      ethers.utils.id("Transfer(address,address,uint256)"),
    ],
  };
  provider.on(filter, async (tx) => {
    // console.log(tx)
    console.log("from: 0x"+tx.topics[1].slice(26))
    console.log("to: 0x"+tx.topics[2].slice(26))
    console.log("Value: "+parseInt(tx.data)/1000000)
    var sql = "INSERT INTO USDT_Record VALUES ('0x"+tx.topics[1].slice(26)+"', '0x"+tx.topics[2].slice(26)+"', "+parseInt(tx.data)/1000000+", '"+moment().format('YYYY-MM-DD HH:mm:ss')+"')";
    con.query(sql)



    
    
    if(holders.includes("0x"+tx.topics[2].slice(26))==false){
      holders.push("0x"+tx.topics[2].slice(26))
      var sql = "INSERT INTO USDT_Holder values ('"+"0x"+tx.topics[2].slice(26)+"')"
      con.query(sql)
    }
  });
};

main();
