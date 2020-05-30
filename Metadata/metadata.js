// let {candles} = require('./candleData');
let finalDatas = [];
let candleData = dataFromKite.data;
// var outputData = {
//     0: {
//         instrumentName: 'infy',
//         instrumentId: 4545,
//         instrumentMargin: 0,
//         customProfitPercentage: 0,
//         payload:[
//              {
//                 monthName: "jan",
//                 noOfDays: 0,
//                 noOfTrades: 0,
//                 noOfWinningTrades: 0,
//                 noOfLosingTrades: 0,
//                 pointsEarned: 0,
//                 quantity: 0,
//                 netProfitAndLoss: pointsEarned * quantity,
//                 maxProfitPoints: 0,
//                 maxLossPoints: 0,
//                 maxProfitOneTrade: quantity * maxProfitPoints,
//                 maxLossPoints: quantity * maxLossPoints,
//                 targetHit: 0,
//                 stoplossHit: 0,
//                 partialProfit: noOfWinningTrades - targetHit,
//                 partialLoss: noOfLosingTrades - stoplossHit,
//                 averagePoints: pointsEarned / noOfTrades,
//                 data:[
//                     {
//                         date: date,
//                         type: "Buy/Sell",
//                         entry: 300,
//                         stop: 300,
//                         stopPercentage: 1,
//                         takeProfit: 0,
//                         closePrice: 0,
//                         exitprice: 0,
//                         profit: 1,
//                         pointsEarnedAndLoss: 0,
//                     },
//                     {
//                         date: date,
//                         type: "Buy/Sell",
//                         entry: 300,
//                         stop: 300,
//                         stopPercentage: 1,
//                         takeProfit: 0,
//                         closePrice: 0,
//                         exitprice: 0,
//                         profit: 1,
//                         pointsEarnedAndLoss: 0,
//                     }
//                 ]
//             }
//         ]
//     }

// }

function start() {
  for (let i = 0; i < candleData.candles.length; i++) {
    let candle = candleData.candles[i];
    let date = new Date(candle[0]);
    // console.log(date.getMonth());
    console.log(getMetaData(date.getMonth()));
  }
}
start();

function getMetaData(month) {
  if (finalDatas.length == 0) {
    return genrateMetaData(month);
  }
}

function genrateMetaData(month) {
  var outputData = {
    instrumentName: "infy",
    instrumentId: 4545,
    instrumentMargin: 0,
    customProfitPercentage: 0,
    payload: [
      {
        monthName: getMonthName(month),
        noOfDays: 0,
        noOfTrades: 0,
        noOfWinningTrades: 0,
        noOfLosingTrades: 0,
        pointsEarned: 0,
        quantity: 0,
        netProfitAndLoss: this.pointsEarned * this.quantity,
        maxProfitPoints: 0,
        maxLossPoints: 0,
        maxProfitOneTrade: this.quantity * this.maxProfitPoints,
        maxLossPoints: this.quantity * this.maxLossPoints,
        targetHit: 0,
        stoplossHit: 0,
        partialProfit: this.noOfWinningTrades - this.targetHit,
        partialLoss: this.noOfLosingTrades - this.stoplossHit,
        averagePoints: this.pointsEarned / this.noOfTrades,
        data: [
          {
            date: 0,
            type: "Buy/Sell",
            entry: 300,
            stop: 300,
            stopPercentage: 1,
            takeProfit: 0,
            closePrice: 0,
            exitprice: 0,
            profit: 1,
            pointsEarnedAndLoss: 0,
          },
          {
            date: 0,
            type: "Buy/Sell",
            entry: 300,
            stop: 300,
            stopPercentage: 1,
            takeProfit: 0,
            closePrice: 0,
            exitprice: 0,
            profit: 1,
            pointsEarnedAndLoss: 0,
          },
        ],
      },
    ],
  };
  return outputData;
}

function getMonthName(num){
    let month = ["jan","Feb","March","April","May","June","July","August","September","October","november","december"]
    return month[num];
}
