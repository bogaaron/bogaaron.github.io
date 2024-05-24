
// const sp2={
//     AAPL:{
//         data:[5.6, 5.5, 5.58, 5.76, 5.7, 5.9, 5.78, 5.76, 5.76, 5.7, 5.7, 5.76, 5.76, 5.7, 5.86, 5.86, 5.7, 5.7, 5.56, 5.6, 5.64, 5.64, 5.74, 5.66, 5.74, 5.76, 5.7, 5.7, 5.82, 5.72, 5.78, 5.78, 5.78, 5.88, 5.82, 5.8, 5.5, 5.68, 5.78, 5.62, 5.8, 5.8, 5.78, 5.68, 6, 6, 6, 5.92, 5.92, 5.92, 5.98, 5.9, 6, 6, 5.86, 6.78, 6.62, 6.62, 6.5, 6.56, 6.86, 6.86, 6.86, 6.9, 7.3, 7, 7, 7, 7.14, 7, 6.82, 7.3, 6.92, 7.5, 7, 7.1, 7.1, 6.7, 6.7, 6.7, 6.74, 6.74, 6.5, 6.5, 6.5, 6.44, 6.44, 6.38, 6.48, 6.6, 6.72, 6.8, 6.44, 6.48, 6.54, 6.86, 6.86, 6.82, 6.84, 6.48, 6.5, 6.7, 6.6, 6.7, 6.56, 6.8, 6.6, 6.6, 6.86, 7.76, 7.14, 7.68, 7.1, 7.02, 7, 7.08, 7.04, 7, 6.98, 7, 6.7, 7.28, 6.8, 7.4, 7.4, 7.48]
//     }
// }
// // Számítsuk ki a napi hozamokat
// function calculateDailyReturns(prices) {
//     const returns = [];
//     for (let i = 1; i < prices.length; i++) {
//         const dailyReturn = (prices[i] / prices[i - 1]) - 1;
//         returns.push(dailyReturn);
//     }

//     console.log(returns);
//     return returns;
// }

// // Számítsuk ki az átlagos napi hozamot
// function calculateAverageReturn(returns) {
//     const sumReturns = returns.reduce((sum, dailyReturn) => sum + dailyReturn, 0);
//     console.log(sumReturns);
//     console.log(sumReturns / (returns.length));
//     return sumReturns / returns.length;
// }

// // Számítsuk ki a szórást
// function calculateStandardDeviation(returns, averageReturn) {
//     const squaredDifferences = returns.map(dailyReturn => Math.pow(dailyReturn - averageReturn, 2));
//     const variance = squaredDifferences.reduce((sum, squaredDiff) => sum + squaredDiff, 0) / returns.length;

//     console.log( Math.sqrt(variance));
//     return Math.sqrt(variance);
// }

// // Alkalmazzuk a Kelly-kritériumot
// function calculateKellyFraction(b, p, q) {
//     return (b * p - q) / b;
// }

// const riskFreeReturn = 0.05; // 5%

// const stockNames = Object.keys(sp2);
// const optimalInvestments = {};

// stockNames.forEach(stockName => {
//     const stockData = sp2[stockName].data;
//     const dailyReturns = calculateDailyReturns(stockData);
//     const averageReturn = calculateAverageReturn(dailyReturns);
//     const standardDeviation = calculateStandardDeviation(dailyReturns, averageReturn);
//     const positiveReturns = dailyReturns.filter(returnVal => returnVal > 0);
//     const negativeReturns = dailyReturns.filter(returnVal => returnVal < 0);
//     const kellyFraction = calculateKellyFraction(standardDeviation, averageReturn);

//     // Számítsuk ki az optimális részvénybefektetést és a súlyokat
//     const totalCapital = 10000; // Például 10 000 dollár
//     const optimalInvestment = kellyFraction * totalCapital;
//     const optimalWeight = optimalInvestment / totalCapital;

//     optimalInvestments[stockName] = { investment: optimalInvestment, weight: optimalWeight };
// });

// console.log("Optimális részvénybefektetések és súlyok:");
// console.log(optimalInvestments);

// Egy függvény, amely kiszámolja a várható hozamot egy részvényre a történelmi árak alapján
function expectedReturn(prices) {
    let returns = [];
    for (let i = 1; i < prices.length; i++) {
      returns.push(Math.log(prices[i] / prices[i - 1]));
    }
    let sum = 0;
    for (let r of returns) {
      sum += r;
    }
    let mean = sum / returns.length;

    // console.log(Math.exp(mean) - 1);

    return Math.exp(mean) - 1;
  }

  // Egy függvény, amely kiszámolja a kovarianciát két részvény között a történelmi árak alapján
  function covariance(prices1, prices2) {
    let returns1 = [];
    let returns2 = [];
    for (let i = 1; i < prices1.length; i++) {
      returns1.push(Math.log(prices1[i] / prices1[i - 1]));
      returns2.push(Math.log(prices2[i] / prices2[i - 1]));
    }
    let mean1 = 0;
    let mean2 = 0;
    for (let r of returns1) {
      mean1 += r;
    }
    for (let r of returns2) {
      mean2 += r;
    }
    mean1 /= returns1.length;
    mean2 /= returns2.length;
    let sum = 0;
    for (let i = 0; i < returns1.length; i++) {
      sum += (returns1[i] - mean1) * (returns2[i] - mean2);
    }

    // console.log(sum / returns1.length);
    return sum / returns1.length;


  }

  // Egy függvény, amely kiszámolja a kovariancia mátrixot egy részvényportfólióra a történelmi árak alapján
  function covarianceMatrix(prices) {
    let n = prices.length; // a portfólióban lévő részvények száma
    let matrix = [];
    for (let i = 0; i < n; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(covariance(prices[i], prices[j]));
      }
    }
    // console.log(matrix);
    return matrix;
  }

  // Egy függvény, amely kiszámolja a kovariancia mátrix inverzét egy részvényportfólióra a történelmi árak alapján
  function inverseMatrix(matrix) {
    let n = matrix.length; // a mátrix mérete
    let inverse = [];
    for (let i = 0; i < n; i++) {
      inverse.push([]);
      for (let j = 0; j < n; j++) {
        inverse[i].push(0);
      }
    }
    // Az inverz mátrix kiszámítása a Gauss-Jordan elimináció módszerével
    // Forrás: https://www.mathsisfun.com/algebra/matrix-inverse-row-operations-gauss-jordan.html
    // Először létrehozunk egy kiterjesztett mátrixot, amely a mátrixot és az egységmátrixot tartalmazza
    let extended = [];
    for (let i = 0; i < n; i++) {
      extended.push([]);
      for (let j = 0; j < n; j++) {
        extended[i].push(matrix[i][j]);
      }
      for (let j = 0; j < n; j++) {
        if (i == j) {
          extended[i].push(1);
        } else {
          extended[i].push(0);
        }
      }
    }
    // Aztán elvégezzük a sorcseréket, a sorműveleteket és a normálást, hogy az eredeti mátrix része egységmátrix legyen
    for (let i = 0; i < n; i++) {
      // Kiválasztjuk a legnagyobb abszolút értékű elemet a főátló alatt az i-edik oszlopban
      let max = Math.abs(extended[i][i]);
      let maxRow = i;
      for (let j = i + 1; j < n; j++) {
        if (Math.abs(extended[j][i]) > max) {
          max = Math.abs(extended[j][i]);
          maxRow = j;
        }
      }
      // Ha a legnagyobb elem nulla, akkor a mátrix szinguláris, és nincs inverze
      if (max == 0) {
        return null;
      }
      // Kicseréljük az i-edik sort a maxRow-adik sorral
      let temp = extended[i];
      extended[i] = extended[maxRow];
      extended[maxRow] = temp;
      // Kivonjuk az i-edik sort a többi sorból, hogy nullákat hozzunk létre az i-edik oszlopban
      for (let j = i + 1; j < n; j++) {
        let factor = extended[j][i] / extended[i][i];
        for (let k = i; k < 2 * n; k++) {
          extended[j][k] -= factor * extended[i][k];
        }
      }
      // Normáljuk az i-edik sort, hogy az i-edik oszlopban 1 legyen
      let divisor = extended[i][i];
      for (let k = i; k < 2 * n; k++) {
        extended[i][k] /= divisor;
      }
    }
    // Végül kivonjuk az i-edik sort a többi sorból, hogy nullákat hozzunk létre az i-edik oszlopban a főátló fölött
    for (let i = n - 1; i > 0; i--) {
      for (let j = i - 1; j >= 0; j--) {
        let factor = extended[j][i] / extended[i][i];
        for (let k = i; k < 2 * n; k++) {
          extended[j][k] -= factor * extended[i][k];
        }
      }
    }
    // Az inverz mátrix a kiterjesztett mátrix jobb oldalán található
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inverse[i][j] = extended[i][j + n];
      }
    }
    // console.log(inverse);
    return inverse;
  }

  // Egy függvény, amely kiszámolja a Kelly portfólió súlyait egy részvényportfólióra a történelmi árak alapján
//   function kellyPortfolio(prices, riskFreeRate) {
//     let n = prices.length; // a portfólióban lévő részvények száma
//     let returns = [];
//     for (let i = 0; i < n; i++) {
//       returns.push(expectedReturn(prices[i]));
//     }
//     let covMatrix = covarianceMatrix(prices);
//     let invMatrix = inverseMatrix(covMatrix);
//     if (invMatrix == null) {
//       return null; // a portfólió nem optimalizálható a Kelly kritériummal
//     }
//     let weights = [];
//     for (let i = 0; i < n; i++) {
//       let sum = 0;
//       for (let j = 0; j < n; j++) {
//         sum += invMatrix[i][j] * (returns[j] - riskFreeRate/252);
//       }
//       weights.push(sum);
//     }

//     return weights;
//   }
function kellyPortfolio(prices, riskFreeRate) {
    let n = prices.length;
    let returns = [];
    for (let i = 0; i < n; i++) {
      returns.push(expectedReturn(prices[i]));
    }
    let covMatrix = covarianceMatrix(prices);
    let invMatrix = inverseMatrix(covMatrix);
    if (invMatrix == null) {
      return null;
    }
    let weights = [];
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += invMatrix[i][j] * (returns[j] - riskFreeRate / 252);
      }
      weights.push(sum);
    }

    return weights;
  }


  // Kiszámolja a jövedelmi eloszlást az adott befektetés alapján
//   function calculatePortfolioReturns(totalInvestment, weights, returns) {
//       let portfolioReturns = [];
//       for (let i = 0; i < weights.length; i++) {
//         let stockReturn = expectedReturn(returns[i]);
//         let stockInvestment = totalInvestment * weights[i];
//         let stockIncome = stockInvestment * stockReturn;
//         portfolioReturns.push({
//           stock: i + 1,
//           weight: weights[i],
//           return: stockReturn,
//           investment: stockInvestment,
//           income: stockIncome,
//           inv:totalInvestment
//         });
//       }
//       return portfolioReturns;
//     }

  // Példa a Kelly portfólió kiszámítására a weboldalon bemutatott három részvényre: Apple, Microsoft és Tesla
  // let applePrices = [5.6, 5.5, 5.58, 5.76, 5.7, 5.9, 5.78, 5.76, 5.76, 5.7, 5.7, 5.76, 5.76, 5.7, 5.86, 5.86, 5.7, 5.7, 5.56, 5.6, 5.64, 5.64, 5.74, 5.66, 5.74, 5.76, 5.7, 5.7, 5.82, 5.72, 5.78, 5.78, 5.78, 5.88, 5.82, 5.8, 5.5, 5.68, 5.78, 5.62, 5.8, 5.8, 5.78, 5.68, 6, 6, 6, 5.92, 5.92, 5.92, 5.98, 5.9, 6, 6, 5.86, 6.78, 6.62, 6.62, 6.5, 6.56, 6.86, 6.86, 6.86, 6.9, 7.3, 7, 7, 7, 7.14, 7, 6.82, 7.3, 6.92, 7.5, 7, 7.1, 7.1, 6.7, 6.7, 6.7, 6.74, 6.74, 6.5, 6.5, 6.5, 6.44, 6.44, 6.38, 6.48, 6.6, 6.72, 6.8, 6.44, 6.48, 6.54, 6.86, 6.86, 6.82, 6.84, 6.48, 6.5, 6.7, 6.6, 6.7, 6.56, 6.8, 6.6, 6.6, 6.86, 7.76, 7.14, 7.68, 7.1, 7.02, 7, 7.08, 7.04, 7, 6.98, 7, 6.7, 7.28, 6.8, 7.4, 7.4, 7.48];
// let microsoftPrices = [5.6, 5.5, 5.58, 5.76, 5.7, 5.9, 9.78, 5.76, 5.76, 5.7, 5.7, 5.76, 5.76, 5.7, 5.86, 5.86, 5.7, 5.7, 5.56, 5.6, 5.64, 5.64, 5.74, 5.66, 5.74, 5.76, 5.7, 5.7, 5.82, 5.72, 5.78, 5.78, 5.78, 5.88, 5.82, 5.8, 5.5, 5.68, 5.78, 5.62, 5.8, 5.8, 5.78, 5.68, 6, 6, 6, 5.92, 5.92, 5.92, 5.98, 5.9, 6, 6, 5.86, 6.78, 6.62, 6.62, 6.5, 6.56, 6.86, 6.86, 6.86, 6.9, 7.3, 7, 7, 7, 7.14, 7, 6.82, 7.3, 6.92, 7.5, 7, 7.1, 7.1, 6.7, 6.7, 6.7, 6.74, 6.74, 6.5, 6.5, 6.5, 6.44, 6.44, 6.38, 6.48, 6.6, 6.72, 6.8, 6.44, 6.48, 6.54, 6.86, 6.86, 6.82, 6.84, 6.48, 6.5, 6.7, 6.6, 6.7, 6.56, 6.8, 6.6, 6.6, 6.86, 7.76, 7.14, 7.68, 7.1, 7.02, 7, 7.08, 7.04, 7, 6.98, 7, 6.7, 7.28, 6.8, 7.4, 7.4, 7.48];
// let teslaPrices = [5.6, 5.5, 5.58, 5.76, 5.7, 5.9, 5.78, 10.76, 5.76, 5.7, 5.7, 5.76, 5.76, 5.7, 5.86, 5.86, 5.7, 5.7, 5.56, 5.6, 5.64, 5.64, 5.74, 5.66, 5.74, 5.76, 5.7, 5.7, 5.82, 5.72, 5.78, 5.78, 5.78, 5.88, 5.82, 5.8, 5.5, 5.68, 5.78, 5.62, 5.8, 5.8, 5.78, 5.68, 6, 6, 6, 5.92, 5.92, 5.92, 5.98, 5.9, 6, 6, 5.86, 6.78, 6.62, 6.62, 6.5, 6.56, 6.86, 6.86, 6.86, 6.9, 7.3, 7, 7, 7, 7.14, 7, 6.82, 7.3, 6.92, 7.5, 7, 7.1, 7.1, 6.7, 6.7, 6.7, 6.74, 6.74, 6.5, 6.5, 6.5, 6.44, 6.44, 6.38, 6.48, 6.6, 6.72, 6.8, 6.44, 6.48, 6.54, 6.86, 6.86, 6.82, 6.84, 6.48, 6.5, 6.7, 6.6, 6.7, 6.56, 6.8, 6.6, 6.6, 6.86, 7.76, 7.14, 7.68, 7.1, 7.02, 7, 7.08, 7.04, 7, 6.98, 7, 6.7, 7.28, 6.8, 7.4, 7.4, 7.48];
// let applePrices = [116.36, 120.3, 119.39, 113.85, 115.17, 120.59, 121.21, 125.86, 124.28, 121.26, 127.88, 132.03, 131.97, 136.87, 139.07, 142.92, 143.16, 142.06, 137.09, 136.01, 142.5, 143.43, 145.64, 145.86, 139.49, 141.67, 142.71, 136.76, 137.18, 139.14];
// let microsoftPrices = [214.07, 216.21, 214.46, 210.11, 210.08, 215.23, 212.94, 216.55, 212.65, 214.8, 217.69, 223.94, 222.42, 224.96, 225.95, 232.33, 231.96, 232.71, 227.56, 231.05, 232.38, 235.99, 239.65, 241.88, 232.33, 236.48, 234.51, 231.85, 232.9, 235.77];
// let teslaPrices = [585.76, 567.6, 584.76, 568.82, 593.38, 599.04, 641.76, 585.99, 567.12, 593.38, 605.14, 641.76, 650.57, 780.0, 755.98, 816.04, 880.02, 811.19, 849.44, 854.41, 880.8, 883.09, 864.16, 835.43, 793.53, 798.15, 790.18, 755.98, 746.36, 793.9];


// console.log(sp);
// let prices = [applePrices];
// let prices = [];

// for (let stock in sp) {
//     // Ha az adott kulcs alatti elemnek van "data" nevű kulcsú eleme
//     if (sp.hasOwnProperty(stock) && sp[stock].hasOwnProperty("data")) {
//         // Hozzáadjuk az "prices" tömbhöz az adott kulcs alatti "data" elemet
//         prices.push(sp[stock]["data"]);
//     }
// }

let prices = [];

for (let stock in sp) {
    if (sp.hasOwnProperty(stock) && sp[stock].hasOwnProperty("data")) {
        prices.push(sp[stock]["data"]);
    }
}

  // A rizikómentes ráta beállítása (pl. 1%)
  let riskFreeRate = 0.4;

  let weights = kellyPortfolio(prices, riskFreeRate);
  let investmentAmount = 100;

  if (weights == null) {
      console.log("A portfólió nem optimalizálható a Kelly kritériummal.");
  } else {
      console.log("A Kelly portfólió súlyai a következők:");
      // console.log("Apple: " + weights[0]);
      // console.log("Microsoft: " + weights[1]);
      // console.log("Tesla: " + weights[2]);

      var symbols = Object.keys(sp);

    for (let i = 0; i < Object.keys(sp).length; i++) {

        console.log(symbols[i]+": " + weights[i]);
    }


      // Számoljuk ki a jövedelmi eloszlást az adott befektetés alapján
    //   let portfolioReturns = calculatePortfolioReturns(investmentAmount, weights, prices);

      // Kiírjuk a részleteket
    //   for (let i = 0; i < portfolioReturns.length; i++) {
    //     console.log(`Részvény ${portfolioReturns[i].stock}:`);
    //     console.log(` - Súly: ${portfolioReturns[i].weight}`);
    //     console.log(` - Befektetés: ${portfolioReturns[i].investment}`);
    //     console.log(` - Várható hozam: ${(portfolioReturns[i].return)}`);
    //     console.log(` - Jövedelem: ${portfolioReturns[i].income}`);
    //     console.log(` - Inv: ${portfolioReturns[i].inv}`);
    //   }

      // Számoljuk ki és írjuk ki a teljes portfólió várható hozamát
    //   let totalPortfolioReturn = portfolioReturns.reduce((acc, item) => acc + item.income, 0);
    //   console.log(`Teljes portfólió várható hozama: ${totalPortfolioReturn.toFixed(2)}`);
  }


// Az eredeti objektumon végigiterálunk

