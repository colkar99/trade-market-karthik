// let {candles} = require('./candleData');
let finalDatas = [];
let candleData = dataFromKite.data;
let tempDate = 0;
//custom range
let range = 0.15;
let customProfit = 1;
let timeFrame = 30;
let timeFrameCal = { 30: 13 };
let tempFrame = null;
let whichCandle = null;
let firstCandle = {
  date: "",
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  volume: 0,
  type: "",
};
let currentCandle = {
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  volume: 0,
};
let coreData = {
  date: "",
  type: "",
  entry: 0,
  stop: 0,
  stopPercentage: 0,
  closePrice: 0,
  exitprice: 0,
  profit: 0,
  takeProfit: 0,
  pointsEarnedAndLoss: 0,
};

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
    tempFrame = timeFrameCal[timeFrame];
    initializeFirstCandle(candle);
    whichCandle = "start";
    tempFrame--;
  } else if (tempDate === date) {
    tempFrame--;
    //Main logic goes here
    currentCandle.open = candle[1];
    currentCandle.high = candle[2];
    currentCandle.low = candle[3];
    currentCandle.close = candle[4];
    currentCandle.volume = candle[5];
    let difference;
    if (whichCandle != null) {
      if (firstCandle.type == "Bullesh") {
        difference = firstCandle.close - currentCandle.open;
        if (range < difference) {
          startTrade(meta, currentCandle);
          meta.noOfTrades++;
        }
      } else if (firstCandle.type == "Bearesh") {
        difference = firstCandle.close - currentCandle.open;
        if (range > difference) {
          startTrade(meta, currentCandle);
          meta.noOfTrades++;
        }
      }
      whichCandle = null;
    }

    if (tempFrame == 0) {
      tempDate = 0;
      tempFrame = null;
      whichCandle = null;
      coreConcept(meta, "true");
      // resetCoreDate();
      console.log("First candle: ", firstCandle);
      console.log("Last candle: ", currentCandle);
      console.log("Core data : ", coreData);
    } else {
      coreConcept(meta);
    }
  }
  // console.log("Meta:", meta);
  // console.log("Candle:", candle);
}

//Start Core concept
function coreConcept(meta, squareOff = null) {
  //Checking stopLoss start
  debugger
  if (coreData.type == "Bullesh") {
    if (coreData.takeProfit <= currentCandle.low) {
      buyOrSell(meta, coreData.stop, "stopLossHitted");
      //Stoploss hit
    } else if (coreData.takeProfit <= currentCandle.high) {
      buyOrSell(meta, coreData.takeProfit, "targetHitted");
      //Target hit
    }
  } else if (coreData.type == "Bearesh") {
    if (coreData.takeProfit <= currentCandle.high) {
      //Stoploss hit
      buyOrSell(meta, coreData.stop, "stopLossHitted");
    } else if (coreData.takeProfit <= currentCandle.low) {
      //Target hit
      buyOrSell(meta, coreData.takeProfit, "targetHitted");
    }
  }
  if (squareOff == "true") {
    buyOrSell(meta, currentCandle.close, "squareOff");
  }
}

//Common functin for price calculation of evert candle
function buyOrSell(meta, exitPrice, which) {
  if (coreData.exitprice <= 0) {
    coreData.exitprice = exitPrice;
    console.log("profit_or_loss:", which);
  } else {
  }
}

//Start trade function
function startTrade(meta, currentCandle) {
  meta.noOfTrades++;
  let stopLossType =
    firstCandle.type == "Bullesh" ? firstCandle.low : firstCandle.high;
  coreData.date = firstCandle.date;
  coreData.type = firstCandle.type;
  coreData.entry = currentCandle.open;
  coreData.stop = stopLossType;
  coreData.stopPercentage = stopLossPercentage(coreData.entry, coreData.stop);
  coreData.closePrice = 0;
  coreData.exitprice = 0;
  coreData.profit = customProfit || 1;
  coreData.pointsEarnedAndLoss = takeProfitFunction(
    coreData.profit,
    coreData.entry
  );
  coreData.takeProfit = coreData.type == 'Bullesh'? coreData.entry + coreData.pointsEarnedAndLoss:coreData.entry - coreData.pointsEarnedAndLoss;
}

//Reset core data
function resetCoreDate() {
  if (coreData.exitprice == 0) {
    coreData.exitprice = currentCandle.close;
    coreData.closePrice = currentCandle.close;
  }
  coreData = {
    date: "",
    type: "",
    entry: 0,
    stop: 0,
    stopPercentage: 0,
    closePrice: 0,
    exitprice: 0,
    profit: 0,
    takeProfit: 0,
    pointsEarnedAndLoss: 0,
  };
}

//First candle initialize open close bullesh
function initializeFirstCandle(candle) {
  firstCandle.open = candle[1];
  firstCandle.close = candle[4];
  firstCandle.high = candle[2];
  firstCandle.low = candle[3];
  firstCandle.volume = candle[5];
  firstCandle.date = candle[0];
  if (firstCandle.close > firstCandle.open) firstCandle.type = "Bullesh";
  else if (firstCandle.close < firstCandle.open) firstCandle.type = "Bearesh";
  else firstCandle.type = "skipped";
  console.log(tempDate);
  // console.log("first candle:", candle)
  // console.log("first candle our:", firstCandle)
}

function takeProfit() {
  let profit = takeProfitFunction(customProfit || 1, coreData.entry);
  return coreData.entry + profit;
}
function stopLossPercentage(val1, val2) {
  return 100 * Math.abs((val1 - val2) / ((val1 + val2) / 2));
}
function takeProfitFunction(per, val) {
  return (val / 100) * per;
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
    touched: false,
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
// let  data = {
//   date: firstCandle.date,
//   type: firstCandle.type,
//   entry: currentCandle.open,
//   stop: stopLossType,
//   stopPercentage: stopLossPercentage(currentCandle.open,stopLossType),
//   closePrice: 0,
//   exitprice: 0,
//   profit: customProfit || 1,
//   takeProfit: takeProfit(),
//   pointsEarnedAndLoss: takeProfitFunction(customProfit || 1,currentCandle.open),
// }
