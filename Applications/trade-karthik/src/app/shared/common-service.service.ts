import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  data: Array<any>;
  constructor() { }
  getData() {
    return this.data = [
      {
        "status": "success",
        "data": {
          "candles": [


            ["2020-04-01T09:45:00+0530", 386.4, 389.8, 350.8, 353.95, 9039000],
            ["2020-04-01T10:15:00+0530", 357.7, 365.95, 353.55, 360.7, 3016000],
            ["2020-04-01T10:45:00+0530", 360.8, 362.75, 354.05, 355.55, 1073000],
            ["2020-04-01T11:15:00+0530", 355.55, 356, 320, 333.1, 6023000],
            ["2020-04-01T11:45:00+0530", 333, 339.25, 331.40, 334.85, 2006000],
            ["2020-04-01T12:15:00+0530", 335, 341.05, 333.5, 339.75, 1030000],
            ["2020-04-01T12:45:00+0530", 339.95, 344.35, 337.75, 342.45, 1068000],
            ["2020-04-01T13:15:00+0530", 342, 344.9, 336.5, 339.55, 1045000],
            ["2020-04-01T13:45:00+0530", 339.75, 340.5, 337.05, 338.8, 771000],
            ["2020-04-01T14:15:00+0530", 339, 339.4, 332.65, 337, 1026000],
            ["2020-04-01T14:45:00+0530", 337.15, 341.65, 335.5, 338.9, 1017000],
            ["2020-04-01T15:15:00+0530", 338.95, 345.8, 337, 341.35, 1081000],
            ["2020-04-01T15:45:00+0530", 341.25, 344.9, 341, 342.4, 1029000],

            ////////TESTING DATA REMOVE THIS//////////////
            // ["2020-04-03T09:45:00+0530", 350, 350, 318, 322.55, 4095000],
            // ["2020-04-03T10:15:00+0530", 322.6, 326.3, 319.35, 323.65, 2018000],
            // ["2020-04-03T10:45:00+0530", 324, 324.4, 318.5, 320.2, 1063000],
            // ["2020-04-03T11:15:00+0530", 320.35, 322.95, 319.5, 321.65, 1001000],
            // ["2020-04-03T11:45:00+0530", 321.45, 322.6, 320, 320.55, 820000],
            // ["2020-04-03T12:15:00+0530", 320.55, 321.5, 315.9, 319.5, 1070000],
            // ["2020-04-03T12:45:00+0530", 319.4, 321, 319.05, 319.9, 627000],
            // ["2020-04-03T13:15:00+0530", 319.85, 323, 319, 321.65, 1010000],
            // ["2020-04-03T13:45:00+0530", 321.4, 325.5, 319.55, 322.65, 1030000],
            // ["2020-04-03T14:15:00+0530", 322.6, 322.85, 316.5, 318.35, 1045000],
            // ["2020-04-03T14:45:00+0530", 318.45, 318.9, 311, 317.05, 2078000],
            // ["2020-04-03T15:15:00+0530", 316.65, 320, 311.1, 311.1, 2023000],
            // ["2020-04-03T15:45:00+0530", 311.25, 314, 310.2, 313.8, 1021000],


            //Bullesh Exaple m5-d7
            ["2020-04-02T09:45:00+0530", 420, 434.5, 415.5, 433.1, 4095000],
            ["2020-04-02T10:15:00+0530", 433.15, 438.55, 431.65, 435.95, 2018000],
            ["2020-04-02T10:45:00+0530", 435.65, 439.5, 430.45, 431.15, 1063000],
            ["2020-04-02T11:15:00+0530", 431.25, 434, 430.55, 431.75, 1001000],
            ["2020-04-02T11:45:00+0530", 4311.75, 435.5, 431.7, 434.25, 820000],
            ["2020-04-02T12:15:00+0530", 434.35, 435, 431.65, 432.5, 1070000],
            ["2020-04-02T12:45:00+0530", 432.45, 435.9, 429.3, 435.05, 627000],
            ["2020-04-02T13:15:00+0530", 435.05, 437.45, 433.3, 437.05, 1010000],
            ["2020-04-02T13:45:00+0530", 436.95, 454.6, 436.65, 445.95, 1030000],
            ["2020-04-02T14:15:00+0530", 445.6, 450.6, 443.7, 448.5, 1045000],
            ["2020-04-02T14:45:00+0530", 448.25, 452, 447.15, 449.4, 2078000],
            ["2020-04-02T15:15:00+0530", 449.6, 459.55, 444, 456.95, 2023000],
            ["2020-04-02T15:45:00+0530", 456.95, 461.4, 452.5, 453, 1021000],

            //SuareOff Example UPL jan-03-2020
            ["2020-04-09T09:45:00+0530", 591.5, 594.2, 588.1, 590.7, 185000],
            ["2020-04-09T10:15:00+0530", 590.6, 591.75, 588.6, 589.35, 2018000],
            ["2020-04-09T10:45:00+0530", 589.4, 590.65, 587.3, 590, 94000],
            ["2020-04-09T11:15:00+0530", 590, 593.4, 590, 592.3, 109000],
            ["2020-04-09T11:45:00+0530", 592.3, 592.95, 591.75, 591.8, 63000],
            ["2020-04-09T12:15:00+0530", 591.75, 591.5, 589.45, 589.85, 84000],
            ["2020-04-09T12:45:00+0530", 589.85, 591.3, 589, 590.55, 37000],
            ["2020-04-09T13:15:00+0530", 590.55, 591.6, 590.15, 590.3, 26000],
            ["2020-04-09T13:45:00+0530", 590.3, 590.45, 589.05, 589.2, 46000],
            ["2020-04-09T14:15:00+0530", 589.2, 591, 589.05, 589.8, 54000],
            ["2020-04-09T14:45:00+0530", 589.8, 590.7, 589.65, 590, 35000],
            ["2020-04-09T15:15:00+0530", 590, 590.85, 588.1, 590.1, 122000],
            ["2020-04-09T15:45:00+0530", 590.1, 592.9, 590, 591.4, 96000],
            ////////TESTING DATA REMOVE THIS//////////////



            ["2020-04-03T09:45:00+0530", 350, 350, 318, 322.55, 4095000],
            ["2020-04-03T10:15:00+0530", 322.6, 326.3, 319.35, 323.65, 2018000],
            ["2020-04-03T10:45:00+0530", 324, 324.4, 318.5, 320.2, 1063000],
            ["2020-04-03T11:15:00+0530", 320.35, 322.95, 319.5, 321.65, 1001000],
            ["2020-04-03T11:45:00+0530", 321.45, 322.6, 320, 320.55, 820000],
            ["2020-04-03T12:15:00+0530", 320.55, 321.5, 315.9, 319.5, 1070000],
            ["2020-04-03T12:45:00+0530", 319.4, 321, 319.05, 319.9, 627000],
            ["2020-04-03T13:15:00+0530", 319.85, 323, 319, 321.65, 1010000],
            ["2020-04-03T13:45:00+0530", 321.4, 325.5, 319.55, 322.65, 1030000],
            ["2020-04-03T14:15:00+0530", 322.6, 322.85, 316.5, 318.35, 1045000],
            ["2020-04-03T14:45:00+0530", 318.45, 318.9, 311, 317.05, 2078000],
            ["2020-04-03T15:15:00+0530", 316.65, 320, 311.1, 311.1, 2023000],
            ["2020-04-03T15:45:00+0530", 311.25, 314, 310.2, 313.8, 1021000],

            ["2020-04-07T09:45:00+0530", 344.5, 375.8, 344.5, 374.85, 788],
            ["2020-04-07T10:15:00+0530", 374.3, 377.3, 365.5, 369.15, 613],
            ["2020-04-07T10:45:00+0530", 369.45, 369.95, 356.3, 359, 212],
            ["2020-04-07T11:15:00+0530", 359.35, 369.95, 358.35, 361.6, 1208],
            ["2020-04-07T11:45:00+0530", 361.6, 366, 361.5, 363.45, 716],
            ["2020-04-07T12:15:00+0530", 363.45, 364.75, 357.1, 358.9, 727],
            ["2020-04-07T12:45:00+0530", 358.95, 363.95, 357.8, 363.5, 291],
            ["2020-04-07T13:15:00+0530", 363.4, 370.45, 363.4, 367.4, 180],
            ["2020-04-07T13:45:00+0530", 367.4, 371.4, 366.4, 369.6, 1869],
            ["2020-04-07T14:15:00+0530", 369.7, 389, 368.3, 369, 1869],
            ["2020-04-07T14:45:00+0530", 369, 374, 368.6, 372.65, 1869],
            ["2020-04-07T15:15:00+0530", 372.6, 388.45, 368, 385, 1869],
            ["2020-04-07T15:45:00+0530", 384.65, 391.5, 380, 391.5, 1869],

            ["2020-04-08T09:45:00+0530", 382, 385.5, 362.25, 379.8, 6013000],
            ["2020-04-08T10:15:00+0530", 380, 422.2, 380, 422.2, 6065000],
            ["2020-04-08T10:45:00+0530", 422.2, 441.4, 422.2, 429, 6084000],
            ["2020-04-08T11:15:00+0530", 428.95, 429, 412, 416.55, 4015000],
            ["2020-04-08T11:45:00+0530", 417.65, 419.8, 399.45, 400.9, 4005000],
            ["2020-04-08T12:15:00+0530", 400.85, 404.85, 399.2, 397.65, 4066000],
            ["2020-04-08T12:45:00+0530", 397.6, 399.8, 385.2, 386.5, 3014000],
            ["2020-04-08T13:15:00+0530", 386.5, 387.5, 373.1, 378.75, 5000000],
            ["2020-04-08T13:45:00+0530", 378.65, 379.8, 371.85, 374.5, 2052000],
            ["2020-04-08T14:15:00+0530", 374.5, 374.55, 369, 373, 2032000],
            ["2020-04-08T14:45:00+0530", 373, 398.25, 372.75, 393, 3050000],
            ["2020-04-08T15:15:00+0530", 394.2, 401.55, 388.2, 398.45, 5031000],
            ["2020-04-08T15:45:00+0530", 398.45, 404, 399.15, 396.4, 2007000],

            ["2020-05-01T09:45:00+0530", 591.5, 594.2, 588.1, 590.7, 185000],
            ["2020-05-01T10:15:00+0530", 590.6, 591.75, 588.6, 589.35, 2018000],
            ["2020-05-01T10:45:00+0530", 589.4, 590.65, 587.3, 590, 94000],
            ["2020-05-01T11:15:00+0530", 590, 593.4, 590, 592.3, 109000],
            ["2020-05-01T11:45:00+0530", 592.3, 592.95, 591.75, 591.8, 63000],
            ["2020-05-01T12:15:00+0530", 591.75, 591.5, 589.45, 589.85, 84000],
            ["2020-05-01T12:45:00+0530", 589.85, 591.3, 589, 590.55, 37000],
            ["2020-05-01T13:15:00+0530", 590.55, 591.6, 590.15, 590.3, 26000],
            ["2020-05-01T13:45:00+0530", 590.3, 590.45, 589.05, 589.2, 46000],
            ["2020-05-01T14:15:00+0530", 589.2, 591, 589.05, 589.8, 54000],
            ["2020-05-01T14:45:00+0530", 589.8, 590.7, 589.65, 590, 35000],
            ["2020-05-01T15:15:00+0530", 590, 590.85, 588.1, 590.1, 122000],
            ["2020-05-01T15:45:00+0530", 590.1, 592.9, 590, 595.4, 96000],


          ]
        }
      }
    ]
  }

}