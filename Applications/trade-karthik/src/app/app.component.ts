import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from './shared/common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'trade-karthik';
  finalDatas: Array<any> = [];
  candleData: any;
  customQuantity: number = 100;
  customProfit = 1;
  firstCandle = { date: "", open: 0, high: 0, low: 0, close: 0, volume: 0, type: "" };
  coreData = { date: "", type: null, entry: 0, stop: 0, stopPercentage: 0, closePrice: 0, exitprice: null, profit: 0, takeProfit: 0, pointsEarnedAndLoss: 0, exitTriggerdTime: '', commets: '' };
  currentCandle = { date: '', open: 0, high: 0, low: 0, close: 0, volume: 0, type: '' };
  tempDate = 0;
  customStopLossPercentage = null;
  dateRef = 0;
  tempFrame = null;
  timeFrameCal = { 30: 13 };
  timeFrame = 30;
  whichCandle = null;
  range = 0.15;


  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.getData();
    this.start();
  }
  start() {
    let monthNow = null;
    let meataData;
    for (let i = 0; i < this.candleData[0].data.candles.length; i++) {
      let candle = this.candleData[0].data.candles[i];
      let date = new Date(candle[0]);
      if (monthNow == null) {
        monthNow = date.getMonth();
        meataData = this.getMetaData(date.getMonth());
      } else if (monthNow != date.getMonth()) {
        monthNow = date.getMonth();
        meataData = this.getMetaData(date.getMonth());
      }
      // console.log(meataData);
      this.initializeEngine(meataData, candle);
      // console.log(date.getMonth());
    }
  }

  initializeEngine(meta, candle) {
    let date = new Date(candle[0]).getDate();
    this.dateRef = date;
    if (this.tempDate != date) {
      this.tempDate = date;
      this.tempFrame = this.timeFrameCal[this.timeFrame];
      this.initializeFirstCandle(candle);
      this.whichCandle = "start";
      this.tempFrame--;
    } else if (this.tempDate === date) {
      this.tempFrame--;

      //Main logic goes here
      this.currentCandle.date = candle[0]
      this.currentCandle.open = candle[1];
      this.currentCandle.high = candle[2];
      this.currentCandle.low = candle[3];
      this.currentCandle.close = candle[4];
      this.currentCandle.volume = candle[5];
      this.currentCandle.type = this.currentCandle.close > this.currentCandle.open ? 'Bullesh' : 'Bearesh'
      let difference;
      if (this.whichCandle != null) {
        if (this.firstCandle.type == "Bullesh") {
          difference = this.currentCandle.open - this.firstCandle.close;
          if (difference >= 0 || difference >= -this.range) {
            this.startTrade(meta, this.currentCandle);
            // meta.noOfTrades++;
          }
        } else if (this.firstCandle.type == "Bearesh") {
          difference = this.firstCandle.close - this.currentCandle.open;
          if (difference >= 0 || difference >= -this.range) {
            this.startTrade(meta, this.currentCandle);
            // meta.noOfTrades++;
          }
        }
        this.whichCandle = null;
      }

      if (this.tempFrame == 0) {
        this.tempDate = 0;
        this.tempFrame = null;
        this.whichCandle = null;

        if (this.coreData.entry != 0 && this.coreData.exitprice == null) {
          this.coreConcept(meta, "true");
        }
        this.coreData.date = this.currentCandle.date;
        meta.noOfDays = meta.data.length + 1;
        meta.data.push(this.coreData);
        console.log("First candle: ", this.firstCandle);
        console.log("Last candle: ", this.currentCandle);
        console.log("Core data : ", this.coreData);
        console.log("MetaData : ", this.finalDatas);

        this.resetCoreDate();
      } else {
        this.coreConcept(meta);
      }
    }
    // console.log("Meta:", meta);
    // console.log("Candle:", candle);
  }
  //Start Core concept
  coreConcept(meta, squareOff = null) {
    // if(dateRef == 9) debugger

    //Checking stopLoss start
    if (this.coreData.type == "Bullesh") {
      if (this.coreData.stop - this.currentCandle.low >= 0) {
        this.buyOrSell(meta, this.coreData.stop, "stopLossHitted");
        //Stoploss hit
      } else if (this.currentCandle.high - this.coreData.takeProfit >= 0) {
        this.buyOrSell(meta, this.coreData.takeProfit, "targetHitted");
        //Target hit
      }
    } else if (this.coreData.type == "Bearesh") {
      if (this.currentCandle.high - this.coreData.stop >= 0) {
        //Stoploss hit
        this.buyOrSell(meta, this.coreData.stop, "stopLossHitted");
      } else if (this.currentCandle.low - this.coreData.takeProfit <= 0) {
        //Target hit
        this.buyOrSell(meta, this.coreData.takeProfit, "targetHitted");
      }
    }
    if (squareOff == "true") {
      this.buyOrSell(meta, this.currentCandle.close, "squareOff");
    }
  }
  //Common functin for price calculation of evert candle
  buyOrSell(meta, exitPrice, which) {
    if (this.coreData.exitprice == null) {
      if (which == 'squareOff') {
        this.coreData.exitprice = exitPrice;
        this.coreData.exitTriggerdTime = this.currentCandle.date;
        this.coreData.pointsEarnedAndLoss = this.coreData.entry - exitPrice;
        this.coreData.commets = "May be squareof please check"
        //
        if (this.coreData.pointsEarnedAndLoss > 0) {
          meta.maxProfitOneTrade = Math.max(meta.maxProfitOneTrade, this.coreData.pointsEarnedAndLoss)
          meta.noOfWinningTrades++
        }
        else {
          meta.maxLossOneTrade = Math.min(meta.maxProfitOneTrade, this.coreData.pointsEarnedAndLoss)
          meta.noOfLosingTrades++;
        }
        meta.squareOfHit++

        console.log("profit_or_loss:", which);
      } else if (which == 'targetHitted') {
        this.coreData.exitprice = exitPrice;
        this.coreData.exitTriggerdTime = this.currentCandle.date;
        //
        meta.maxProfitOneTrade = Math.max(meta.maxProfitOneTrade, this.coreData.pointsEarnedAndLoss)
        meta.noOfWinningTrades++
        meta.targetHit++;
        console.log("profit_or_loss:", which);
      }
      else if (which == 'stopLossHitted') {
        this.coreData.exitprice = exitPrice;
        this.coreData.exitTriggerdTime = this.currentCandle.date;
        //
        meta.maxLossOneTrade = Math.min(meta.maxProfitOneTrade, this.coreData.pointsEarnedAndLoss)
        meta.noOfLosingTrades++;
        meta.stoplossHit++;
        console.log("profit_or_loss:", which);
      }

      //
      meta.pointsEarned = meta.pointsEarned + this.coreData.pointsEarnedAndLoss;
      meta.netProfitAndLoss = meta.quantity * meta.pointsEarned;
      meta.maxLossPoints = meta.maxLossOneTrade * meta.quantity;
      meta.maxProfitPoints = meta.maxProfitOneTrade * meta.quantity;
      meta.noOfDays = meta.data.length;
      meta.customProfit = this.customProfit || 1;
      meta.partialLoss = meta.noOfLosingTrades - meta.stoplossHit;
      meta.partialProfit = meta.noOfWinningTrades - meta.targetHit;
      meta.averagePoints = meta.pointsEarned / meta.noOfTrades;

    }
  }
  //Start trade function
  startTrade(meta, currentCandle) {

    let stopLossType = this.firstCandle.type == "Bullesh" ? this.firstCandle.low : this.firstCandle.high;
    let stopLossPercent = this.stopLossPercentage(currentCandle.open, stopLossType);
    if (this.customStopLossPercentage == null) {
      this.initCore(meta, stopLossType);
    } else {
      if (stopLossPercent <= this.customStopLossPercentage) {
        this.initCore(meta, stopLossType);
      } else return
    }

  }

  //Common for above function
  initCore(meta, stopLossType) {
    meta.noOfTrades++;
    this.coreData.date = this.firstCandle.date;
    this.coreData.type = this.firstCandle.type;
    this.coreData.entry = this.currentCandle.open;
    this.coreData.stop = stopLossType;
    this.coreData.stopPercentage = this.stopLossPercentage(this.coreData.entry, this.coreData.stop);
    this.coreData.closePrice = 0;
    this.coreData.exitprice = null;
    this.coreData.profit = this.customProfit || 1;
    this.coreData.pointsEarnedAndLoss = this.takeProfitFunction(
      this.coreData.profit,
      this.coreData.entry
    );
    this.coreData.takeProfit = this.coreData.type == 'Bullesh' ? this.coreData.entry + this.coreData.pointsEarnedAndLoss : this.coreData.entry - this.coreData.pointsEarnedAndLoss;
  }

  //Get data from the service
  getData() {
    this.candleData = this.commonService.getData();
    console.log(this.candleData[0].data)
  }

  //First candle initialize open close bullesh
  initializeFirstCandle(candle) {
    this.firstCandle.open = candle[1];
    this.firstCandle.close = candle[4];
    this.firstCandle.high = candle[2];
    this.firstCandle.low = candle[3];
    this.firstCandle.volume = candle[5];
    this.firstCandle.date = candle[0];
    if (this.firstCandle.close > this.firstCandle.open) this.firstCandle.type = "Bullesh";
    else if (this.firstCandle.close < this.firstCandle.open) this.firstCandle.type = "Bearesh";
    else this.firstCandle.type = "skipped";
    console.log(this.tempDate);
  }
  //Get Meta data
  getMetaData(month) {
    let temp = this.genrateMetaData(month);
    this.finalDatas.push(temp);
    return temp;
  }
  //Generate Metadata
  genrateMetaData(month) {
    return {
      instrumentName: "infy",
      instrumentId: 4545,
      instrumentMargin: 0,
      customProfitPercentage: 0,
      monthNumber: month,
      monthName: this.getMonthName(month),
      noOfDays: 0,
      noOfTrades: 0,
      noOfWinningTrades: 0,
      noOfLosingTrades: 0,
      pointsEarned: 0,
      quantity: this.customQuantity,
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
  getMonthName(num) {
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
  //Reset core data
  resetCoreDate() {
    this.firstCandle = { date: "", open: 0, high: 0, low: 0, close: 0, volume: 0, type: "", };
    this.currentCandle = { date: '', open: 0, high: 0, low: 0, close: 0, volume: 0, type: '' };
    this.coreData = {
      date: "", type: null, entry: 0, stop: 0, stopPercentage: 0, closePrice: 0, exitprice: null, profit: 0, takeProfit: 0,
      pointsEarnedAndLoss: 0,
      exitTriggerdTime: '', commets: ''
    };
  }
  //Stop Loss common function
  stopLossPercentage(val1, val2) {
    return 100 * Math.abs((val1 - val2) / ((val1 + val2) / 2));
  }
  takeProfitFunction(per, val) {
    return (val / 100) * per;
  }
}
