const ethers = require('ethers')
const fs = require("fs")
const main = async () => {
  const provider = new ethers.providers.InfuraProvider("homestead","e875cdf3b3764428ac1347a09e65282d")
  filter = {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",// contract address
    topics: [
      // the name of the event, parnetheses containing the data type of each event, no spaces
      ethers.utils.id("Transfer(address,address,uint256)"),
    ],
  };
  provider.on(filter, async (tx) => {
    console.log("from: 0x"+tx.topics[1].slice(26))
    console.log("to: 0x"+tx.topics[2].slice(26))
    console.log("Value: "+parseInt(tx.data)/1000000)
    fs.appendFileSync("index.txt","from: 0x"+tx.topics[1].slice(26)+" to: 0x"+tx.topics[2].slice(26)+" Value: "+parseInt(tx.data)/1000000+"\n")
  });
};

main();
