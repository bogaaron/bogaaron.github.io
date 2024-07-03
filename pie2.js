var pieChart2 = null; // Globális változó a diagramhoz, amelyet később hozunk létre vagy frissítünk

var symbols = Object.keys(sp);

// Kapcsolók létrehozása dinamikusan
let switchContainer = document.getElementById('switch-container');
symbols.forEach(symbol => {
    let switchDiv = document.createElement('div');
    switchDiv.classList.add('custom-control', 'custom-switch', 'mb-2');

    let input = document.createElement('input');
    input.type = 'checkbox';
    input.classList.add('custom-control-input');
    input.id = symbol+symbol;
    input.value = symbol+symbol;

    let label = document.createElement('label');
    label.classList.add('custom-control-label');
    label.htmlFor = symbol+symbol;
    label.textContent = symbol;

    switchDiv.appendChild(input);
    switchDiv.appendChild(label);
    switchContainer.appendChild(switchDiv);
});

// let selectedSymbols = [];

// symbols.forEach(symbol => {
//     let switchInput = document.getElementById(symbol+symbol);
//     switchInput.addEventListener('change', function() {
//     if (this.checked) {
//         selectedSymbols.push(symbol);
//         console.log(selectedSymbols,"most");
//     } else {
//         let index = selectedSymbols.indexOf(symbol);
//         if (index !== -1) {
//             selectedSymbols.splice(index, 1);
//         }
//         console.log(selectedSymbols,"most");
//     }
//     });
// });

// console.log(selectedSymbols,"********************");


let selectedSymbols = []; // Egyszerű tömb a kiválasztott szimbólumokkal

// Eredeti sorrendben tároljuk a szimbólumokat
let originalOrder = symbols.slice(); // Másolat készítése az eredeti sorrendről

symbols.forEach(symbol => {
    let switchInput = document.getElementById(symbol+symbol);
    switchInput.addEventListener('change', function() {
        if (this.checked) {
            selectedSymbols.push(symbol); // Hozzáadjuk a kiválasztott szimbólumot a tömbhöz
        } else {
            let index = selectedSymbols.indexOf(symbol);
            if (index !== -1) {
                selectedSymbols.splice(index, 1); // Töröljük a kiválasztott szimbólumot a tömbből
            }
        }

        // Frissítjük a kiválasztott szimbólumokat az eredeti sorrendben
        selectedSymbols.sort((a, b) => {
            return originalOrder.indexOf(a) - originalOrder.indexOf(b);
        });

        console.log(selectedSymbols, "most");
    });
});


function createPieChart2() {
    // Ellenőrizzük, hogy van-e már meglévő diagram
    if (pieChart2 !== null) {
        // Ha van, töröljük azt
        pieChart2.destroy();
    }

    console.log(selectedSymbols,"heeeeheheheheheheheh");

    // // Mentés gomb
    // document.getElementById('save-btn').addEventListener('click', function() {
    //     console.log('Kiválasztott szimbólumok:', selectedSymbols);
    // });


    var ctx = document.getElementById('pieChart2').getContext('2d');

    var amount = document.getElementById("amount2").value;
    var tax = document.getElementById("tax2").value;

    let prices2=[];

    selectedSymbols.forEach(function(symbol) {
        if (sp[symbol]) {
            prices2.push(sp[symbol].data);
        }
    });

    console.log(prices2,"emmi");

    let weights = kellyPortfolio(prices2, tax);

    console.log(weights,"sulyoooook")

    let returns = [];
    for (let i = 0; i < prices2.length; i++) {
        returns.push(expectedReturn(prices2[i]));
    }

    console.log(returns,"pieret")

    if (weights == null) {
        console.log("A portfólió nem optimalizálható a Kelly kritériummal.");
    } else {
        console.log("A Kelly portfólió súlyai a következők:");

        for (let i = 0; i < selectedSymbols.length; i++) {

            console.log(selectedSymbols[i]+": " + weights[i]);
        }
    }

    // Csak a nem nulla súlyú szimbólumok kiválasztása
    var nonZeroWeights = [];
    var nonZeroSymbols = [];
    var nonZeroReturns = [];
    for (var i = 0; i < weights.length; i++) {
        if (weights[i] !== 0) {
            nonZeroWeights.push(weights[i]);
            nonZeroSymbols.push(selectedSymbols[i]);
            nonZeroReturns.push(returns[i]);
        }
    }

    console.log(nonZeroWeights);
    console.log(nonZeroSymbols);
    console.log(nonZeroReturns);

    // Pie Chart létrehozása
    pieChart2 = new Chart(ctx, {
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
            optimalReturnAmountText += symbols[i] +"&nbsp;"+((Math.abs(returns[i])*weights[i])*(amount)).toFixed(5)+"$"+"<br>";
            totalreturn+=((Math.abs(returns[i])*weights[i])*(amount));
        }
    }
    console.log(totalreturn,"***************");


    var totalret=" <div class='altit'>Összes nyereség:</div> "+totalreturn.toFixed(2)+"$";

    // Az optimalAllocation id-jú div-be írás
    document.getElementById("optimalallocation2").innerHTML = optimalAllocationText;
    document.getElementById("optimalamount2").innerHTML = optimalAllocationAmountText;
    document.getElementById("expected2").innerHTML = optimalReturnAmountText;
    document.getElementById("total2").innerHTML = totalret;
}

// Függvény a Pie Chart frissítéséhez
function updatePieChart2() {
    // Pie Chart újrarajzolása
    // Az input elemeket elmentjük változókba
    var amount2 = document.getElementById("amount2").value;
    var tax2 = document.getElementById("tax2").value;

    // A kiolvasott értékeket kiírjuk a konzolra
    // Ellenőrizzük, hogy mindkét input ki van-e töltve
    if (amount2 === "" || tax2 === "") {
        // Ha valamelyik nincs kitöltve, megjelenítjük a modált
        $('#myModal').modal('show');
    } else {
        console.log("Befektetésre szánt összeg: " + amount);
        console.log("Banki alapkamat: " + tax);

        createPieChart2();
    }
}