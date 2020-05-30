// let {candles} = require('./candleData');
let finalDatas = [];
let candleData = dataFromKite.data;
let tempDate = 0;
//custom range 
let range = 0.15;
let customProfit = 0;
let whichCandle = null;
firstCandle = {date: '', open: 0, high: 0, low: 0, close: 0, volume: 0, type: '' };
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

async function start() {
  for (let i = 0; i < candleData.candles.length; i++) {
    let candle = candleData.candles[i];
    let date = new Date(candle[0]);
    let meataData = await getMetaData(date.getMonth());
    // console.log(meataData);
    initializeEngine(meataData, candle);
    // console.log(date.getMonth());
  }
}
start();

function initializeEngine(meta, candle) {

  let date = new Date(candle[0]).getDate();

  if (tempDate != date) {
    tempDate = date;
    initializeFirstCandle(candle);
    whichCandle = "start";
  } else if (tempDate === date) {
    //Main logic goes here
    let currentCandle = { open: candle[1], high: candle[2], low: candle[3], close: candle[4], volume: candle[5] };
    let difference;
    if (whichCandle != null) {
      if (firstCandle.type == 'Bullesh') {
        difference = firstCandle.close - currentCandle.open;
        if(range < difference){
          startTrade(meta,currentCandle);
          meta.noOfTrades ++;
        }
        console.log("Current Candle:",currentCandle)
        console.log("Difference Amount:",difference)
      }
      else if(firstCandle.type == 'Bearesh'){
        difference = firstCandle.close - currentCandle.open;
        console.log("Current Candle:",currentCandle)
        console.log("Difference Amount:",difference)
      }
      whichCandle = null;
    }


  }
  // console.log("Meta:", meta);
  // console.log("Candle:", candle);
}



//Start trade function
function startTrade(meta,currentCandle){
  debugger
  meta.noOfTrades ++;
  let stopLossType = firstCandle.type == 'Bullesh'? firstCandle.low : firstCandle.high;
  let  data = {
    date: firstCandle.date,
    type: firstCandle.type,
    entry: currentCandle.open,
    stop: stopLossType,
    stopPercentage: stopLossPercentage(currentCandle.open,stopLossType),
    closePrice: 0,
    exitprice: 0,
    profit: customProfit || 1,
    takeProfit: takeProfit(),
    pointsEarnedAndLoss: takeProfitFunction(customProfit || 1,currentCandle.open),
  }
  function takeProfit(){
    let profit =  takeProfitFunction(customProfit || 1,currentCandle.open);
    return currentCandle.open + profit;
  }
  function stopLossPercentage(val1,val2){
    let first = val1 - val2;
    let second = val1 + val2;
    let third = second / 2;
    let fourth = first / third;
    let fifth = fourth * 100;
    return fifth;
  }
  function takeProfitFunction(per,val){
    return (val/100)*per;
  }

}

//First candle initialize open close bullesh
function initializeFirstCandle(candle) {
  firstCandle.open = candle[1];
  firstCandle.close = candle[4];
  firstCandle.high = candle[2];
  firstCandle.low = candle[3];
  firstCandle.volume = candle[5];
  firstCandle.date = candle[0]
  if (firstCandle.close > firstCandle.open) firstCandle.type = 'Bullesh';
  else if (firstCandle.close < firstCandle.open) firstCandle.type = 'Bearesh';
  else firstCandle.type = 'skipped';
  console.log(tempDate);
  // console.log("first candle:", candle)
  console.log("first candle our:", firstCandle)
}

function getMetaData(month) {
  if (finalDatas.length == 0) {
    let temp = genrateMetaData(month);
    finalDatas.push(temp);
    return temp;
  } else {
    for (let i = 0; i < finalDatas.length; i++) {
      let temp = finalDatas[i];
      temp.noOfTrades++;
      if (temp.monthNumber == month) return temp;
      else {
        return new Error("Please check this line if you this Error");
      }
    }
  }
}

function genrateMetaData(month) {
  return {
    instrumentName: "infy",
    instrumentId: 4545,
    instrumentMargin: 0,
    customProfitPercentage: 0,
    monthNumber: month,
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
    touched: false
  };
}

function getMonthName(num) {
  let month = [
    "jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "november",
    "december",
  ];
  return month[num];
}
