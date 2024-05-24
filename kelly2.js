// // Egy függvény, amely kiszámolja a várható hozamot egy részvényre a történelmi árak alapján
// function expectedReturn(prices) {
//     let returns = [];
//     for (let i = 1; i < prices.length; i++) {
//       returns.push(Math.log(prices[i] / prices[i - 1]));
//     }
//     let sum = 0;
//     for (let r of returns) {
//       sum += r;
//     }
//     let mean = sum / returns.length;
//     return Math.exp(mean) - 1;
//   }

//   // Egy függvény, amely kiszámolja a kovarianciát két részvény között a történelmi árak alapján
//   function covariance(prices1, prices2) {
//     let returns1 = [];
//     let returns2 = [];
//     for (let i = 1; i < prices1.length; i++) {
//       returns1.push(Math.log(prices1[i] / prices1[i - 1]));
//       returns2.push(Math.log(prices2[i] / prices2[i - 1]));
//     }
//     let mean1 = 0;
//     let mean2 = 0;
//     for (let r of returns1) {
//       mean1 += r;
//     }
//     for (let r of returns2) {
//       mean2 += r;
//     }
//     mean1 /= returns1.length;
//     mean2 /= returns2.length;
//     let sum = 0;
//     for (let i = 0; i < returns1.length; i++) {
//       sum += (returns1[i] - mean1) * (returns2[i] - mean2);
//     }
//     return sum / returns1.length;
//   }

//   // Egy függvény, amely kiszámolja a kovariancia mátrixot egy részvényportfólióra a történelmi árak alapján
//   function covarianceMatrix(prices) {
//     let n = prices.length; // a portfólióban lévő részvények száma
//     let matrix = [];
//     for (let i = 0; i < n; i++) {
//       matrix.push([]);
//       for (let j = 0; j < n; j++) {
//         matrix[i].push(covariance(prices[i], prices[j]));
//       }
//     }
//     return matrix;
//   }

//   // Egy függvény, amely kiszámolja a kovariancia mátrix inverzét egy részvényportfólióra a történelmi árak alapján
//   function inverseMatrix(matrix) {
//     let n = matrix.length; // a mátrix mérete
//     let inverse = [];
//     for (let i = 0; i < n; i++) {
//       inverse.push([]);
//       for (let j = 0; j < n; j++) {
//         inverse[i].push(0);
//       }
//     }
//     // Az inverz mátrix kiszámítása a Gauss-Jordan elimináció módszerével
//     // Forrás: https://www.mathsisfun.com/algebra/matrix-inverse-row-operations-gauss-jordan.html
//     // Először létrehozunk egy kiterjesztett mátrixot, amely a mátrixot és az egységmátrixot tartalmazza
//     let extended = [];
//     for (let i = 0; i < n; i++) {
//       extended.push([]);
//       for (let j = 0; j < n; j++) {
//         extended[i].push(matrix[i][j]);
//       }
//       for (let j = 0; j < n; j++) {
//         if (i == j) {
//           extended[i].push(1);
//         } else {
//           extended[i].push(0);
//         }
//       }
//     }
//     // Aztán elvégezzük a sorcseréket, a sorműveleteket és a normálást, hogy az eredeti mátrix része egységmátrix legyen
//     for (let i = 0; i < n; i++) {
//       // Kiválasztjuk a legnagyobb abszolút értékű elemet a főátló alatt az i-edik oszlopban
//       let max = Math.abs(extended[i][i]);
//       let maxRow = i;
//       for (let j = i + 1; j < n; j++) {
//         if (Math.abs(extended[j][i]) > max) {
//           max = Math.abs(extended[j][i]);
//           maxRow = j;
//         }
//       }
//       // Ha a legnagyobb elem nulla, akkor a mátrix szinguláris, és nincs inverze
//       if (max == 0) {
//         return null;
//       }
//       // Kicseréljük az i-edik sort a maxRow-adik sorral
//       let temp = extended[i];
//       extended[i] = extended[maxRow];
//       extended[maxRow] = temp;
//       // Kivonjuk az i-edik sort a többi sorból, hogy nullákat hozzunk létre az i-edik oszlopban
//       for (let j = i + 1; j < n; j++) {
//         let factor = extended[j][i] / extended[i][i];
//         for (let k = i; k < 2 * n; k++) {
//           extended[j][k] -= factor * extended[i][k];
//         }
//       }
//       // Normáljuk az i-edik sort, hogy az i-edik oszlopban 1 legyen
//       let divisor = extended[i][i];
//       for (let k = i; k < 2 * n; k++) {
//         extended[i][k] /= divisor;
//       }
//     }
//     // Végül kivonjuk az i-edik sort a többi sorból, hogy nullákat hozzunk létre az i-edik oszlopban a főátló fölött
//     for (let i = n - 1; i > 0; i--) {
//       for (let j = i - 1; j >= 0; j--) {
//         let factor = extended[j][i] / extended[i][i];
//         for (let k = i; k < 2 * n; k++) {
//           extended[j][k] -= factor * extended[i][k];
//         }
//       }
//     }
//     // Az inverz mátrix a kiterjesztett mátrix jobb oldalán található
//     for (let i = 0; i < n; i++) {
//       for (let j = 0; j < n; j++) {
//         inverse[i][j] = extended[i][j + n];
//       }
//     }
//     return inverse;
//   }

//   // Egy függvény, amely kiszámolja a Kelly portfólió súlyait egy részvényportfólióra a történelmi árak alapján
//   function kellyPortfolio(prices) {
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
//         sum += invMatrix[i][j] * (returns[j]*0.4/252);
//       }
//       weights.push(sum);
//     }
//     return weights;
//   }

//   // Egy példa a Kelly portfólió kiszámítására a weboldalon bemutatott három részvényre: Apple, Microsoft és Tesla
//   let applePrices = [116.36, 120.3, 119.39, 113.85, 115.17, 120.59, 121.21, 125.86, 124.28, 121.26, 127.88, 132.03, 131.97, 136.87, 139.07, 142.92, 143.16, 142.06, 137.09, 136.01, 142.5, 143.43, 145.64, 145.86, 139.49, 141.67, 142.71, 136.76, 137.18, 139.14];
// let microsoftPrices = [214.07, 216.21, 214.46, 210.11, 210.08, 215.23, 212.94, 216.55, 212.65, 214.8, 217.69, 223.94, 222.42, 224.96, 225.95, 232.33, 231.96, 232.71, 227.56, 231.05, 232.38, 235.99, 239.65, 241.88, 232.33, 236.48, 234.51, 231.85, 232.9, 235.77];
// let teslaPrices = [585.76, 567.6, 584.76, 568.82, 593.38, 599.04, 641.76, 585.99, 567.12, 593.38, 605.14, 641.76, 650.57, 780.0, 755.98, 816.04, 880.02, 811.19, 849.44, 854.41, 880.8, 883.09, 864.16, 835.43, 793.53, 798.15, 790.18, 755.98, 746.36, 793.9];
// let prices = [applePrices, microsoftPrices, teslaPrices];
// let weights = kellyPortfolio(prices);
// if (weights == null) {
//   console.log("A portfólió nem optimalizálható a Kelly kritériummal.");
// } else {
//   console.log("A Kelly portfólió súlyai a következők:");
//   console.log("Apple: " + weights[0].toFixed(2));
//   console.log("Microsoft: " + weights[1].toFixed(2));
//   console.log("Tesla: " + weights[2].toFixed(2));

//   let amount = 1000;

// // Egy tömb, amely tárolja a részvények jelenlegi árait
// let currentPrices = [139.14, 235.77, 793.9];

// // Egy tömb, amely tárolja a részvények neveit
// let names = ["Apple", "Microsoft", "Tesla"];

// // Egy ciklus, amely végigmegy a súlyokon, és kiszámolja, hogy mennyi részvényt tudsz venni a befektetési összegből, valamint hogy mennyi marad meg a pénzedből
// let shares = []; // a tömb, amely tárolja, hogy mennyi részvényt tudsz venni
// let remainder = amount; // a változó, amely tárolja, hogy mennyi marad meg a pénzedből
// for (let i = 0; i < names.length; i++) {

//     let share = Math.floor(weights[i] * amount / currentPrices[i]); // a részvények száma, amit meg tudsz venni
//     shares.push(share);
//     console.log(shares);
//     if(remainder>0){
//     remainder -= share * currentPrices[i]; // a megmaradt pénz frissítése
//     }
// }

// // Egy ciklus, amely kiírja, hogy mennyi részvényt vettél, és mennyi volt a befektetés értéke, valamint a megmaradt pénz
// let value = 0; // a változó, amely tárolja a befektetés értékét
// for (let i = 0; i < names.length; i++) {
//   console.log(names[i] + ": " + shares[i] + " részvény");
//   value += shares[i] * currentPrices[i]; // a befektetés értékének frissítése
// }
// console.log("A befektetés értéke: " + value.toFixed(2) + " dollár");
// console.log("A megmaradt pénz: " + remainder.toFixed(2) + " dollár");
// }

// // Egy változó, amely tárolja a befektetni kívánt összeget

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

    return Math.exp(mean) - 1;
  }

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

    return sum / returns1.length;
  }

  function covarianceMatrix(prices) {
    let n = prices.length;
    let matrix = [];
    for (let i = 0; i < n; i++) {
      matrix.push([]);
      for (let j = 0; j < n; j++) {
        matrix[i].push(covariance(prices[i], prices[j]));
      }
    }
    return matrix;
  }
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

// function kellyPortfolio(prices, riskFreeRate) {
//   // Calculate the number of assets
//   let n = prices.length;

//   // Calculate expected returns for each asset
//   let returns = [];
//   for (let i = 0; i < n; i++) {
//       returns.push(expectedReturn(prices[i]));
//   }

//   // Calculate the covariance matrix and its inverse
//   let covMatrix = covarianceMatrix(prices);
//   let invMatrix = inverseMatrix(covMatrix);
//   if (invMatrix == null) {
//       return null; // Return null if the inverse matrix doesn't exist
//   }

//   // Initialize weights array
//   let weights = new Array(n).fill(0);

//   // Calculate raw weights based on the Kelly criterion
//   let rawWeights = [];
//   for (let i = 0; i < n; i++) {
//       let sum = 0;
//       for (let j = 0; j < n; j++) {
//           sum += invMatrix[i][j] * (returns[j] - riskFreeRate / 252);
//       }
//       rawWeights.push(sum);
//   }

//   // Normalize raw weights to satisfy the no leverage constraint
//   let sumRawWeights = rawWeights.reduce((a, b) => a + b, 0);
//   if (sumRawWeights > 1) {
//       weights = rawWeights.map(weight => weight / sumRawWeights);
//   } else {
//       weights = rawWeights;
//   }

//   // Ensure all weights are within the [0, 1] range
//   // weights = weights.map(weight => Math.min(Math.max(weight, 0), 1));

//   // Normalize weights again to ensure they sum up to 1
//   // let sumWeights = weights.reduce((a, b) => a + b, 0);
//   // weights = weights.map(weight => weight / sumWeights);

//   // // Normalize raw weights to satisfy the no leverage constraint
//   // let sumRawWeights = rawWeights.reduce((a, b) => a + b, 0);
//   // let scaleFactor = 1 / sumRawWeights;
//   // weights = rawWeights.map(weight => weight * scaleFactor);

//   // // Ensure weights are between 0 and 1
//   // weights = weights.map(weight => Math.max(0, Math.min(1, weight)));


//   return weights;
// }

// function kellyPortfolio(prices, riskFreeRate) {
//   // Calculate the number of assets
//   let n = prices.length;

//   // Calculate expected returns for each asset
//   let returns = [];
//   for (let i = 0; i < n; i++) {
//       returns.push(expectedReturn(prices[i]));
//   }

//   // Calculate the covariance matrix and its inverse
//   let covMatrix = covarianceMatrix(prices);
//   let invMatrix = inverseMatrix(covMatrix);
//   if (invMatrix == null) {
//       return null; // Return null if the inverse matrix doesn't exist
//   }

//   // Calculate raw weights based on the Kelly criterion
//   let rawWeights = [];
//   for (let i = 0; i < n; i++) {
//       let sum = 0;
//       for (let j = 0; j < n; j++) {
//           sum += invMatrix[i][j] * (returns[j] - riskFreeRate / 252);
//       }
//       rawWeights.push(sum);
//   }

//   // Normalize raw weights to ensure the sum is 1
//   let sumRawWeights = rawWeights.reduce((a, b) => a + b, 0);
//   let normalizedWeights = rawWeights.map(weight => weight / sumRawWeights);

//   // Ensure weights are between 0 and 1
//   let weights = normalizedWeights.map(weight => Math.min(Math.max(weight, 0), 1));

//   return weights;
// }
// ********************************
function kellyPortfolio(prices, riskFreeRate) {
  let n = prices.length;
  let returns = [];
  for (let i = 0; i < n; i++) {
      returns.push(expectedReturn(prices[i]));
  }

  console.log(returns,"kelret");

  let covMatrix = covarianceMatrix(prices);
  let invMatrix = inverseMatrix(covMatrix);




  if (invMatrix == null) {
      return null;
  }

  let rawWeights = [];
  for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
          sum += invMatrix[i][j] * (returns[j] - riskFreeRate / 252);
      }
      rawWeights.push(sum);
  }

  // Kizárjuk a negatív súlyokat
  rawWeights = rawWeights.map(weight => Math.max(weight, 0));

  // Deklaráljuk a 'weights' változót
  let weights;

  // Normalizáljuk a súlyokat
  let sumRawWeights = rawWeights.reduce((a, b) => a + b, 0);
  weights = rawWeights.map(weight => weight / sumRawWeights);

  function calculateCorrelationMatrix(prices) {
    let cormatrix = prices.map((pricesRow, i) =>
      prices.map((pricesCol, j) => {
        if (i === j) {
          return 1; // A főátlóban 1-es értékek
        } else {
          let stdev1 = math.std(pricesRow);
          let stdev2 = math.std(pricesCol);
          return covariance(pricesRow, pricesCol) / (stdev1 * stdev2);
        }
      })
    );
    return cormatrix;
  }

  return weights;
}
// **************************
//   let applePrices = [116.36, 120.3, 119.39, 113.85, 115.17, 120.59, 121.21, 125.86, 124.28, 121.26, 127.88, 132.03, 131.97, 136.87, 139.07, 142.92, 143.16, 142.06, 137.09, 136.01, 142.5, 143.43, 145.64, 145.86, 139.49, 141.67, 142.71, 136.76, 137.18, 139.14];
//   let microsoftPrices = [214.07, 216.21, 214.46, 210.11, 210.08, 215.23, 212.94, 216.55, 212.65, 214.8, 217.69, 223.94, 222.42, 224.96, 225.95, 232.33, 231.96, 232.71, 227.56, 231.05, 232.38, 235.99, 239.65, 241.88, 232.33, 236.48, 234.51, 231.85, 232.9, 235.77];
//   let teslaPrices = [585.76, 567.6, 584.76, 568.82, 593.38, 599.04, 641.76, 585.99, 567.12, 593.38, 605.14, 641.76, 650.57, 780.0, 755.98, 816.04, 880.02, 811.19, 849.44, 854.41, 880.8, 883.09, 864.16, 835.43, 793.53, 798.15, 790.18, 755.98, 746.36, 793.9];

//   let prices = [applePrices, microsoftPrices, teslaPrices];

let prices = [];

for (let stock in sp) {
    if (sp.hasOwnProperty(stock) && sp[stock].hasOwnProperty("data")) {
        prices.push(sp[stock]["data"]);
    }
}





  // let riskFreeRate = document.getElementById("tax").value;

  // let riskFreeRate = 0.4;
  // let investmentAmount = 100;

  // console.log(riskFreeRate,"**************************************");

  // let weights = kellyPortfolio(prices, riskFreeRate);



  // if (weights == null) {
  //   console.log("A portfólió nem optimalizálható a Kelly kritériummal.");
  // } else {
  //   console.log("A Kelly portfólió súlyai a következők:");

  //   var symbols = Object.keys(sp);

  //   for (let i = 0; i < Object.keys(sp).length; i++) {

  //       console.log(symbols[i]+": " + weights[i]);
  //   }

  //   console.log(symbols);
  //   console.log(weights);



    // for (var symbol in sp) {
    //     console.log(symbol + ":");
    // }

    // console.log("Apple: " + weights[0]);

    // console.log("Tőkeallokáció az egyes eszközökhöz:");
    // for (let i = 0; i < weights.length; i++) {
    //   console.log(" (" + weights[i] * 100 + "%): " + weights[i] * investmentAmount);
    // }
  // }

