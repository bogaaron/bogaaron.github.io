// Először is hozzá kell adni a math.js könyvtárat a projektünkhöz.
// Ezt megtehetjük a CDN használatával, például:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.4.1/math.js"></script>

function expectedReturn(prices) {
  let returns = prices.map((price, index, arr) => index > 0 ? Math.log(price / arr[index - 1]) : 0).slice(1);
  let mean = math.mean(returns);

  // console.log(Math.exp(mean) - 1,'return');
  return Math.exp(mean) - 1;
}

function calculateCovariance(data1, data2) {
  if (data1.length !== data2.length) {
  throw new Error('A két adatsor hossza nem egyezik meg.');
  }

  const mean1 = math.mean(data1);
  const mean2 = math.mean(data2);

  let covariance = 0;
  for (let i = 0; i < data1.length; i++) {
  covariance += (data1[i] - mean1) * (data2[i] - mean2);
  }

  return covariance / (data1.length - 1);
}

  function covarianceMatrix(prices) {
    let matrix = prices.map((pricesRow) =>
      prices.map((pricesCol) => calculateCovariance(pricesRow, pricesCol))
    );
    return matrix;
  }

  function inverseMatrix(matrix) {
    return math.inv(matrix);
  }

  function kellyPortfolio(prices, riskFreeRate) {
    let returns = prices.map(stockPrices => expectedReturn(stockPrices));
    let covMatrix = covarianceMatrix(prices);
    let invMatrix = inverseMatrix(covMatrix);


    if (invMatrix === null) {
      return null;
    }

    let excessReturns = returns.map(r => r - riskFreeRate / 252);
    let rawWeights = math.multiply(invMatrix, excessReturns);
    rawWeights = rawWeights.map(weight => Math.max(weight, 0));
    let sumRawWeights = rawWeights.reduce((a, b) => a + b, 0);
    let weights = rawWeights.map(weight => weight / sumRawWeights);

    return weights;
  }


  let prices = [];
  for (let stock in sp) {
    if (sp.hasOwnProperty(stock) && sp[stock].hasOwnProperty("data")) {
      prices.push(sp[stock]["data"]);
    }
  }

