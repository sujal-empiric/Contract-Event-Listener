const ethers = require("ethers");
const moment = require("moment");
const mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "holderData",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

const main = async () => {
    const provider = new ethers.providers.InfuraProvider("homestead","e875cdf3b3764428ac1347a09e65282d")
    filter = {
          address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",// contract address
      topics: [
        ethers.utils.id("Transfer(address,address,uint256)"),
      ],
    };
  provider.on(filter, async (tx) => {
    con.query(
      "select * from USDT_Record where FromAddress='0x"+tx.topics[1].slice(26)+"' or ToAddress='0x"+tx.topics[1].slice(26)+"'",
      function (err, result) {
        if (err) console.log(err);
        var orders = [];
        result.forEach(function (element) {
          if (
            element.FromAddress == "0x"+tx.topics[1].slice(26)
          ) {
            orders.push({
              from: "0x"+tx.topics[1].slice(26),
              time: moment(element.Time).unix(),
              order: "sell",
            });
          } else if (
            element.ToAddress == "0x"+tx.topics[1].slice(26)
          ) {
            orders.push({
              from: "0x"+tx.topics[1].slice(26),
              time: moment(element.Time).unix(),
              order: "buy",
            });
          }
        });
        let period = [];
        for (var i = 0; i < orders.length; i++) {
          if (i < orders.length - 1) {
            period.push(orders[i].time - orders[i + 1].time);
            // console.log(
            //   orders[i].time +
            //     " " +
            //     orders[i].order +
            //     " " +
            //     orders[i + 1].time +
            //     " " +
            //     orders[i + 1].order +
            //     " " +
            //     (orders[i].time - orders[i + 1].time)
            // );
          }
        }
        // console.log(period)
        console.log("0x"+tx.topics[1].slice(26))
        console.log(period.reduce((a, b) => a + b, 0) / period.length);
      }
    );
  });
};

main();

// 0x4a14347083b80e5216ca31350a2d21702ac3650d
