
// Holt****************************************
 var data=[5.6, 5.5, 5.58, 5.76, 5.7, 5.9, 5.78, 5.76, 5.76, 5.7, 5.7, 5.76, 5.76, 5.7, 5.86, 5.86, 5.7, 5.7, 5.56, 5.6, 5.64, 5.64, 5.74, 5.66, 5.74, 5.76, 5.7, 5.7, 5.82, 5.72, 5.78, 5.78, 5.78, 5.88, 5.82, 5.8, 5.5, 5.68, 5.78, 5.62, 5.8, 5.8, 5.78, 5.68, 6, 6, 6, 5.92, 5.92, 5.92, 5.98, 5.9, 6, 6, 5.86, 6.78, 6.62, 6.62, 6.5, 6.56, 6.86, 6.86, 6.86, 6.9, 7.3, 7, 7, 7, 7.14, 7, 6.82, 7.3, 6.92, 7.5, 7, 7.1, 7.1, 6.7, 6.7, 6.7, 6.74, 6.74, 6.5, 6.5, 6.5, 6.44, 6.44, 6.38, 6.48, 6.6, 6.72, 6.8, 6.44, 6.48, 6.54, 6.86, 6.86, 6.82, 6.84, 6.48, 6.5, 6.7, 6.6, 6.7, 6.56, 6.8, 6.6, 6.6, 6.86, 7.76, 7.14, 7.68, 7.1, 7.02, 7, 7.08, 7.04, 7, 6.98, 7, 6.7, 7.28, 6.8, 7.4, 7.4, 7.48];
// var data=[ 40, 45, 47, 49, 56, 53, 55, 63, 68, 65, 72, 75, 79, 82, 80, 85, 94, 95, 96, 100, 100, 105, 108, 110];
// var data = [34, 40, 47, 50, 49, 56, 53, 55, 63, 68, 65, 72, 69, 79, 82, 80, 85, 94, 89, 96, 100, 100, 105, 108, 110];

//Case of simple exponential smoothing


// var ses = new SimpleExponentialSmoothing(data, alpha);
// var forecast = ses.predict(); //return an array with estimated values until t+1

//You can optimize alpha value
// var optimizedAlpha = ses.optimizeParameter(20);
//After the optimization, the value of alpha is directly set to optimizedAlpha

//You can predict again with the optimized value of alpha
// var optimizedForecast = ses.predict();


//Case of double exponential smoothing
// var des = new DoubleExponentialSmoothing(data, alpha);
// forecast = des.predict(3); //You have to pass the horizon of the prediction

//You can also optimize alpha value
// optimizedAlpha = des.optimizeParameter(20);
//After the optimization, the value of alpha is directly set to optimizedAlpha

//Case of Holt smoothing
var alpha = 0.1;
var gamma = 0.1;
var hs = new HoltSmoothing(data, alpha, gamma)
fc = hs.predict(1); //Horizon of 1
var optimizedParameters = hs.optimizeParameters(200) //You have to pass the number of iterations as parameter;
fc = hs.predict(1); //Horizon of 1

// console.log(forecast);
// console.log(optimizedParameters);

// fc=[null,36.73,39.95423469,43.54651455,47.05190204,50.43500603,54.42414299,57.52651858,60.41887847,64.00622296,67.88573807,70.84717793,74.33107228,77.77696172,81.32698597,84.83115012,87.5239132,90.41816909,94.15834452,97.59351927,100.6862858,103.8676115,106.5471905,109.4596186,112.3381323]

forecast=fc.slice(1);


// xi-x*******************************************

// Az átlagot kiszámító függvény
const calculateAverage = (total, num) => total + num;

// Összegzés a reduce segítségével
const sumOfNumbers = data.reduce(calculateAverage, 0);

// Az átlag kiszámítása
const atlag = sumOfNumbers / data.length;

var dataavg=[];

// Minden elemből kivonjuk az átlagot
for (var i = 0; i < data.length; i++) {
  dataavg.push(data[i]-atlag);
}

// Eredmény kiíratása

// yi-y**********************************************

// Összegzés a reduce segítségével
const sumOfNumbers2 = forecast.reduce(calculateAverage, 0);

// Az átlag kiszámítása
const secondatlag = sumOfNumbers2 / forecast.length;

var forecastavg=[];
// Minden elemből kivonjuk az átlagot
for (var i = 0; i < forecast.length; i++) {
  forecastavg.push(forecast[i]-secondatlag);
}

// (xi-x)*(yi-y)********************************************

// Szorzás függvény
function tombSzorzas(dataavg, forecastavg) {
  var eredmeny = [];
  for (var i = 0; i < dataavg.length; i++) {
      eredmeny.push(dataavg[i] * forecastavg[i]);
  }
  return eredmeny;
}

// Tömbök elemeinek szorzása
var szorzat = tombSzorzas(dataavg, forecastavg);

szorossz=szorzat.reduce((total,cur)=>total+cur,0)

// (xi-x)^2***************************************************

step4=dataavg.reduce((total,cur)=>total+Math.pow(cur,2), 0)

// (yi-y)^2***************************************************

step5=forecastavg.reduce((total,cur)=>total+Math.pow(cur,2), 0)

//m***************************************************************

m=szorossz/step4;

//n***************************************************************

n=secondatlag-atlag*m;

// (m*xi+n-y)^2***************************************************

function ssr(data) {
  var eredmeny = [];
  for (var i = 0; i < data.length; i++) {
    eredmeny.push(Math.pow(m*data[i]+(n)-secondatlag,2));
  }
  return eredmeny;
}

var ssrcalc = ssr(data);

var ssrcalctotal=ssrcalc.reduce((total,cur)=>total+cur,0)


// (m*xi+n-yi)^2****************************************************

function sse(data, forecast) {
  var eredmeny = [];
  for (var i = 0; i < data.length; i++) {
      eredmeny.push(Math.pow(m*data[i] +(n)- forecast[i],2));
  }
  return eredmeny;
}

// Tömbök elemeinek szorzása
var ssecalc = sse(data, forecast);

// Eredmény kiíratás

var ssecalctotal=ssecalc.reduce((total,cur)=>total+cur,0)

console.log("SST=",step5)

console.log("SSR=",ssrcalctotal)

console.log("SSE=",ssecalctotal);

console.log("SSR+SSE=",ssrcalctotal+ssecalctotal);


//R2******************************************************************

r2=ssrcalctotal/step5;
console.log("R^2=",r2)









//return an object containing the optimized value of alpha and gamma
//After the optimization, the value of alpha and gamma are directly set to the optimized values

//Case of Holt Winters smoothing
// var delta = 0.5;
// var seasonLength = 4;
// var multiplicative = false; //indicates if the model is additive or multiplicative

// var hws = new HoltWintersSmoothing(data, alpha, gamma, delta, seasonLength, multiplicative);
// forecast = hws.predict();
// optimizedParameters = hws.optimizeParameters(20); //return an object containing the optimized values of alpha, gamma and delta
// //After the optimization, the value of alpha, gamma and delta are directly set to the optimized values

// //Case of moving average
// var ma = new MovingAverage(data);
// var order = 1;
// dataSmoothed = ma.smooth(order);
//The mean is taken from an equal number (order) of data on either side of a central value




// var alpha = 0.39999999999999997;
// var gamma = 0.44999999999999996;
// var hs = new HoltSmoothing(data, alpha, gamma)
// forecast = hs.predict(1);
// var optimizedParameters = hs.optimizeParameters(24);

// // var sse = hs.computeMeanSquaredError2();

// // console.log(sse);
// console.log(forecast);
// console.log(optimizedParameters);






















