// let {candles} = require('./candleData');
let dateRef = 0

let finalDatas = [];
let candleData = dataFromKite.data;
let tempDate = 0;
//custom range
let range = 0.15;
let customProfit = 1;
let customStopLossPercentage = null;
let customQuantity = 100;
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
  date: '',
  open: 0,
  high: 0,
  low: 0,
  close: 0,
  volume: 0,
  type:''
};
let coreData = {
  date: "",
  type: null,
  entry: 0,
  stop: 0,
  stopPercentage: 0,
  closePrice: 0,
  exitprice: null,
  profit: 0,
  takeProfit: 0,
  pointsEarnedAndLoss: 0,
  exitTriggerdTime: '',
  commets: ''
};

 function start() {
  let monthNow = null;
  let meataData;
  for (let i = 0; i < candleData.candles.length; i++) {
    let candle = candleData.candles[i];
    let date = new Date(candle[0]);
    if(monthNow == null){
      monthNow = date.getMonth();
      meataData =  getMetaData(date.getMonth());
    }else if(monthNow != date.getMonth()){
      monthNow = date.getMonth();
      meataData =  getMetaData(date.getMonth());
    }
    // console.log(meataData);
    initializeEngine(meataData, candle);
    // console.log(date.getMonth());
  }
}
start();

function initializeEngine(meta, candle) {
  let date = new Date(candle[0]).getDate();
  dateRef = date;
  if (tempDate != date) {
    tempDate = date;
    tempFrame = timeFrameCal[timeFrame];
    initializeFirstCandle(candle);
    whichCandle = "start";
    tempFrame--;
  } else if (tempDate === date) {
    tempFrame--;

    //Main logic goes here
    currentCandle.date = candle[0]
    currentCandle.open = candle[1];
    currentCandle.high = candle[2];
    currentCandle.low = candle[3];
    currentCandle.close = candle[4];
    currentCandle.volume = candle[5];
    currentCandle.type = currentCandle.close > currentCandle.open ? 'Bullesh':'Bearesh'
    let difference;
    if (whichCandle != null) {
      if (firstCandle.type == "Bullesh") {
        difference = currentCandle.open - firstCandle.close;
        if (difference >= 0 || difference >= -range) {
          startTrade(meta, currentCandle);
          // meta.noOfTrades++;
        }
      } else if (firstCandle.type == "Bearesh") {
        difference = firstCandle.close - currentCandle.open;
        if (difference >= 0 || difference >= -range) {
          startTrade(meta, currentCandle);
          // meta.noOfTrades++;
        }
      }
      whichCandle = null;
    }

    if (tempFrame == 0) {
      tempDate = 0;
      tempFrame = null;
      whichCandle = null;

      if(coreData.entry != 0 && coreData.exitprice == null){
        coreConcept(meta, "true");
      }
      coreData.date = currentCandle.date;
      meta.noOfDays = meta.data.length + 1;
      meta.data.push(coreData);
      console.log("First candle: ", firstCandle);
      console.log("Last candle: ", currentCandle);
      console.log("Core data : ", coreData);
      console.log("MetaData : ", finalDatas);

      resetCoreDate();
    } else {
      coreConcept(meta);
    }
  }
  // console.log("Meta:", meta);
  // console.log("Candle:", candle);
}

//Start Core concept
function coreConcept(meta, squareOff = null) {
  // if(dateRef == 9) debugger

  //Checking stopLoss start
  if (coreData.type == "Bullesh") {
    if (coreData.stop - currentCandle.low >= 0) {
      buyOrSell(meta, coreData.stop, "stopLossHitted");
      //Stoploss hit
    } else if (currentCandle.high - coreData.takeProfit >= 0) {
      buyOrSell(meta, coreData.takeProfit, "targetHitted");
      //Target hit
    }
  } else if (coreData.type == "Bearesh") {
    if (currentCandle.high - coreData.stop >=0) {
      //Stoploss hit
      buyOrSell(meta, coreData.stop, "stopLossHitted");
    } else if (currentCandle.low - coreData.takeProfit  <= 0) {
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
  if (coreData.exitprice == null) {
    if(which == 'squareOff'){
      coreData.exitprice = exitPrice;
      coreData.exitTriggerdTime = currentCandle.date;
      coreData.pointsEarnedAndLoss = coreData.entry - exitPrice;
      coreData.commets = "May be squareof please check"
      //
      if(coreData.pointsEarned > 0){
        meta.maxProfitOneTrade = Math.max(meta.maxProfitOneTrade,coreData.pointsEarnedAndLoss)
        meta.noOfWinningTrades++
      }
      else{
        meta.maxLossOneTrade = Math.min(meta.maxProfitOneTrade,coreData.pointsEarnedAndLoss)
        meta.noOfLosingTrades++;
      } 
      meta.squareOfHit++

      console.log("profit_or_loss:", which);
    }else if(which == 'targetHitted'){
      coreData.exitprice = exitPrice;
      coreData.exitTriggerdTime = currentCandle.date;
      //
      meta.maxProfitOneTrade = Math.max(meta.maxProfitOneTrade,coreData.pointsEarnedAndLoss)
      meta.noOfWinningTrades++
      meta.targetHit++;
      console.log("profit_or_loss:", which);
    }
     else if(which == 'stopLossHitted') {
      coreData.exitprice = exitPrice;
      coreData.exitTriggerdTime = currentCandle.date;
      //
      meta.maxLossOneTrade = Math.min(meta.maxProfitOneTrade,coreData.pointsEarnedAndLoss)
      meta.noOfLosingTrades++;
      meta.stoplossHit++;
      console.log("profit_or_loss:", which);
    }

    //
    meta.pointsEarned = meta.pointsEarned + coreData.pointsEarnedAndLoss;
    meta.netProfitAndLoss = meta.quantity * meta.pointsEarned;
    meta.maxLossPoints = meta.maxLossOneTrade * meta.quantity;
    meta.maxProfitPoints = meta.maxProfitOneTrade * meta.quantity;
    meta.noOfDays = meta.data.length;
    meta.customProfit = customProfit || 1;
    meta.partialLoss = meta.noOfLosingTrades - meta.stoplossHit;
    meta.partialProfit = meta.noOfWinningTrades - meta.targetHit;
    meta.averagePoints = meta.pointsEarned / meta.noOfTrades;

  }
}
// squareOffFunction implementation
function squareOffFunction(exitPrice){
  debugger
  if(coreData.type == 'Bullesh'){
    let diff;
    if(coreData.entry >= exitPrice ){
        diff = stopLossPercentage(coreData.entry,exitPrice);
    }
    else{
      diff = stopLossPercentage(exitPrice , coreData.entry);
    }
    console.log(diff);
  }
    // meta.noOfTrades++;
    // coreData.date = firstCandle.date;
    // coreData.type = firstCandle.type;
    // coreData.entry = currentCandle.open;
    // coreData.stop = stopLossType;
    // coreData.stopPercentage = stopLossPercentage(coreData.entry, coreData.stop);
    // coreData.closePrice = 0;
    // coreData.exitprice = null;
    // coreData.profit = customProfit || 1;
    // coreData.pointsEarnedAndLoss = takeProfitFunction(
    //   coreData.profit,
    //   coreData.entry
    // );
    // coreData.takeProfit = coreData.type == 'Bullesh'? coreData.entry + coreData.pointsEarnedAndLoss:coreData.entry - coreData.pointsEarnedAndLoss;
}
//Start trade function
function startTrade(meta, currentCandle) {

  let stopLossType = firstCandle.type == "Bullesh" ? firstCandle.low : firstCandle.high;
  let stopLossPercent = stopLossPercentage(currentCandle.open, stopLossType);
  if(customStopLossPercentage == null ){
    initCore(meta,stopLossType);
  }else{
    if(stopLossPercent <= customStopLossPercentage){
      initCore(meta,stopLossType);
    }else return
  }

}
//Common for above function
function initCore(meta,stopLossType){
  meta.noOfTrades++;
  coreData.date = firstCandle.date;
  coreData.type = firstCandle.type;
  coreData.entry = currentCandle.open;
  coreData.stop = stopLossType;
  coreData.stopPercentage = stopLossPercentage(coreData.entry, coreData.stop);
  coreData.closePrice = 0;
  coreData.exitprice = null;
  coreData.profit = customProfit || 1;
  coreData.pointsEarnedAndLoss = takeProfitFunction(
    coreData.profit,
    coreData.entry
  );
  coreData.takeProfit = coreData.type == 'Bullesh'? coreData.entry + coreData.pointsEarnedAndLoss:coreData.entry - coreData.pointsEarnedAndLoss;
}

//Reset core data
function resetCoreDate() {
  firstCandle = {
    date: "",
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    type: "",
  };
  currentCandle = {
    date: '',
    open: 0,
    high: 0,
    low: 0,
    close: 0,
    volume: 0,
    type:''
  };
  coreData = {
    date: "",
    type: null,
    entry: 0,
    stop: 0,
    stopPercentage: 0,
    closePrice: 0,
    exitprice: null,
    profit: 0,
    takeProfit: 0,
    pointsEarnedAndLoss: 0,
    exitTriggerdTime: ''
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


console.log('custom loss calculator',stopLossPercentage(609,602));
function takeProfitFunction(per, val) {
  return (val / 100) * per;
}

function getMetaData(month) {
  // if (finalDatas.length == 0) {
    let temp = genrateMetaData(month);
    finalDatas.push(temp);
    return temp;
  // } else {
  //   for (let i = 0; i < finalDatas.length; i++) {
  //     let temp = finalDatas[i];
  //     // temp.noOfTrades++;
  //     if (temp.monthNumber == month) return temp;
  //     else {
  //       return new Error("Please check this line if you this Error");
  //     }
  //   }
  // }
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
    quantity: customQuantity,
    netProfitAndLoss: 0,
    maxProfitPoints: 0,
    maxLossPoints: 0,
    maxProfitOneTrade: 0,
    maxLossOneTrade: 0,
    targetHit: 0,
    stoplossHit: 0,
    squareOfHit: 0,
    partialProfit: 0,
    partialLoss: 0,
    averagePoints: 0,
    data: [
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
