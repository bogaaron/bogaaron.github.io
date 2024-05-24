// function createPieChart() {

//     var ctx = document.getElementById('pieChart').getContext('2d');

//     var amount = document.getElementById("amount").value;
//     var tax = document.getElementById("tax").value;
//     // Csak a nem nulla súlyú szimbólumok kiválasztása
//     var nonZeroWeights = [];
//     var nonZeroSymbols = [];
//     for (var i = 0; i < weights.length; i++) {
//         if (weights[i] !== 0) {
//             nonZeroWeights.push(weights[i]);
//             nonZeroSymbols.push(symbols[i]);
//         }
//     }

//     // Pie Chart létrehozása
//     var pieChart = new Chart(ctx, {
//         type: 'pie',
//         data: {
//             labels: nonZeroSymbols,
//             datasets: [{
//                 data: nonZeroWeights,
//                 backgroundColor: [
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(75, 192, 192, 0.7)',
//                     'rgba(153, 102, 255, 0.7)',
//                     'rgba(255, 159, 64, 0.7)',
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(255, 99, 132, 0.7)',
//                     'rgba(54, 162, 235, 0.7)',
//                     'rgba(255, 206, 86, 0.7)',
//                     'rgba(75, 192, 192, 0.7)',
//                     'rgba(153, 102, 255, 0.7)',
//                     'rgba(255, 159, 64, 0.7)'
//                 ],
//                 borderWidth: 0
//             }]
//         },
//         options: {
//             hoverOffset:10
//         }
//     });

//     // Adott szöveg elkészítése
//     var optimalAllocationText = "<div class='tit'> Optimális elosztás:</div> <br>";
//     for (var i = 0; i < weights.length; i++) {
//         if (weights[i] !== 0) {
//             optimalAllocationText += (weights[i] * 100).toFixed(2) + "% " + symbols[i] + "<br>";
//         }
//     }
//     var optimalAllocationAmountText = "<div class='tit'>Optimális összeg:</div> <br>";
//     for (var i = 0; i < weights.length; i++) {
//         if (weights[i] !== 0) {
//             optimalAllocationAmountText += symbols[i] +"&nbsp;"+ (weights[i]*amount).toFixed(2) + "$"+"<br>";

//         }
//     }


//     // Az optimalAllocation id-jú div-be írás
//     document.getElementById("optimalallocation").innerHTML = optimalAllocationText;
//     document.getElementById("optimalamount").innerHTML = optimalAllocationAmountText;
// }

// // // Az oldal betöltésekor a Pie Chart létrehozása
// // createChart();

// // Függvény a Pie Chart frissítéséhez
// function updatePieChart() {
//     // Pie Chart újrarajzolása
//     // Az input elemeket elmentjük változókba
//     var amount = document.getElementById("amount").value;
//     var tax = document.getElementById("tax").value;

//     // A kiolvasott értékeket kiírjuk a konzolra
//     // Ellenőrizzük, hogy mindkét input ki van-e töltve
//     if (amount === "" || tax === "") {
//         // Ha valamelyik nincs kitöltve, megjelenítjük a modált
//         $('#myModal').modal('show');
//     } else {
//         console.log("Befektetésre szánt összeg: " + amount);
//         console.log("Banki alapkamat: " + tax);

//         createPieChart();

//     }
// }

var pieChart = null; // Globális változó a diagramhoz, amelyet később hozunk létre vagy frissítünk

function createPieChart() {
    // Ellenőrizzük, hogy van-e már meglévő diagram
    if (pieChart !== null) {
        // Ha van, töröljük azt
        pieChart.destroy();
    }

    var ctx = document.getElementById('pieChart').getContext('2d');

    var amount = document.getElementById("amount").value;
    var tax = document.getElementById("tax").value/10;

    // console.log(tax,"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    let weights = kellyPortfolio(prices, tax);

    let returns = [];
    for (let i = 0; i < prices.length; i++) {
        returns.push(expectedReturn(prices[i]));
    }

    console.log(returns,"pieret")

    if (weights == null) {
        console.log("A portfólió nem optimalizálható a Kelly kritériummal.");
    } else {
        console.log("A Kelly portfólió súlyai a következők:");

        var symbols = Object.keys(sp);

        for (let i = 0; i < Object.keys(sp).length; i++) {

            console.log(symbols[i]+": " + weights[i]);
        }
    }


    // console.log(weights);
    // console.log(symbols);

    // Csak a nem nulla súlyú szimbólumok kiválasztása
    var nonZeroWeights = [];
    var nonZeroSymbols = [];
    var nonZeroReturns = [];
    for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
            nonZeroWeights.push(weights[i]);
            nonZeroSymbols.push(symbols[i]);
            nonZeroReturns.push(returns[i]);
        }
    }

    console.log(nonZeroWeights);
    console.log(nonZeroSymbols);
    console.log(nonZeroReturns,"nonzeroret");

    // Pie Chart létrehozása
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: nonZeroSymbols,
            datasets: [{
                data: nonZeroWeights,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            hoverOffset:10
        }
    });

    // Adott szöveg elkészítése
    var optimalAllocationText = "<div class='tit'> Optimális elosztás:</div> <br>";
    for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
            optimalAllocationText += (weights[i] * 100).toFixed(2) + "% " + symbols[i] + "<br>";
        }
    }
    var optimalAllocationAmountText = "<div class='tit'>Optimális összeg:</div> <br>";
    for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
            optimalAllocationAmountText += symbols[i] +"&nbsp;"+ (weights[i]*amount).toFixed(2) + "$"+"<br>";

        }
    }

    var optimalReturnAmountText = "<div class='altit'>Várható nyereség:</div> ";

    var totalreturn=0;
    for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
            optimalReturnAmountText += symbols[i] +"&nbsp;"+((Math.abs(returns[i])*weights[i])*(amount)).toFixed(2)+"$"+"<br>";
            totalreturn+=((Math.abs(returns[i])*weights[i])*(amount));
        }
    }
    console.log(totalreturn,"***************");

    var totalret=" <div class='altit'>Összes nyereség:</div> "+totalreturn.toFixed(2)+"$";

    // Az optimalAllocation id-jú div-be írás
    document.getElementById("optimalallocation").innerHTML = optimalAllocationText;
    document.getElementById("optimalamount").innerHTML = optimalAllocationAmountText;
    document.getElementById("expected").innerHTML = optimalReturnAmountText;
    document.getElementById("total").innerHTML = totalret;
}

// Függvény a Pie Chart frissítéséhez
function updatePieChart() {
    // Pie Chart újrarajzolása
    // Az input elemeket elmentjük változókba

    var amount = document.getElementById("amount").value;
    var tax = document.getElementById("tax").value/10;

    // A kiolvasott értékeket kiírjuk a konzolra
    // Ellenőrizzük, hogy mindkét input ki van-e töltve
    if (amount === "" || tax === "") {
        // Ha valamelyik nincs kitöltve, megjelenítjük a modált
        $('#myModal').modal('show');
    } else {
        console.log("Befektetésre szánt összeg: " + amount);
        console.log("Banki alapkamat: " + tax);

        createPieChart();
    }
}