// console.log(stocks[0][ "Time Series (Daily)"]["2024-03-14"]["4. close"]);

function holtSmoothing(data){
    //Case of Holt smoothing
    var alpha = 0.1;
    var gamma = 0.1;
    var hs = new HoltSmoothing(data, alpha, gamma)
    fc = hs.predict(1); //Horizon of 1
    var optimizedParameters = hs.optimizeParameters(200) //You have to pass the number of iterations as parameter;
    fc = hs.predict(1); //Horizon of 1

    pr=hs.predict(2); //Horizon of 1
    const finalpr = pr.slice(-1);

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

    var se=Math.pow(ssecalctotal/(data.length),0.5);



    // const sy = stocks[novelo];

    // console.log(sy)


    // console.log("Teljes hiba, SST=",step5)

    // console.log("Regressziós hiba, SSR=",ssrcalctotal)

    // console.log("Reziduális hiba, SSE=",ssecalctotal);

    // console.log("SSR+SSE=",ssrcalctotal+ssecalctotal,"=SST=",step5);

    // console.log("Standard hiba, SE=",se);

    //R2******************************************************************

    r2=ssrcalctotal/step5;

    // console.log("Determinációs együttható, R^2=",r2)

    function countDifferences(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            console.error("A tömbök hossza nem egyezik meg.");
            return -1;
        }

        let count = 0;
        for (let i = 0; i < arr1.length; i++) {
            if (Math.abs(arr1[i] - arr2[i]) > se) {
                count++;
            }
        }

        return count;
    }

    const numOfDifferenceskis = countDifferences(data, forecast);
    // console.log("Kis kiugró adatok=", (data.length-numOfDifferenceskis)/data.length);

    function countDifferences2(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            console.error("A tömbök hossza nem egyezik meg.");
            return -1;
        }

        let count = 0;
        for (let i = 0; i < arr1.length; i++) {
            if (Math.abs(arr1[i] - arr2[i]) > se*2) {
                count++;
            }
        }

        return count;
    }

    const numOfDifferencesnagy = countDifferences2(data, forecast);
    // console.log("Nagy kiugró adatok=", (data.length-numOfDifferencesnagy)/data.length);

    function calculateMAD(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            console.error("A tömbök hossza nem egyezik meg.");
            return [];
        }

        const differences = [];

        for (let i = 0; i < arr1.length; i++) {
            differences.push(arr2[i] - arr1[i]);
        }

        return differences;
    }

    const hiba = calculateMAD(data, forecast);


    function calculateCorrelation(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            console.error("A tömbök hossza nem egyezik meg.");
            return NaN;
        }

        const n = arr1.length;
        const meanArr1 = arr1.reduce((acc, curr) => acc + curr, 0) / n;
        const meanArr2 = arr2.reduce((acc, curr) => acc + curr, 0) / n;

        let numerator = 0;
        let denominatorX = 0;
        let denominatorY = 0;

        for (let i = 0; i < n; i++) {
            numerator += (arr1[i] - meanArr1) * (arr2[i] - meanArr2);
            denominatorX += Math.pow(arr1[i] - meanArr1, 2);
            denominatorY += Math.pow(arr2[i] - meanArr2, 2);
        }

        const correlation = numerator / Math.sqrt(denominatorX * denominatorY);
        return correlation;
    }

    const correlation = calculateCorrelation(hiba, data);
    // console.log("Homoeszkadaszticitás", correlation);

    function countSignChanges(arr) {
        let signChanges = 0;

        for (let i = 1; i < arr.length; i++) {
            if (Math.sign(arr[i]) !== Math.sign(arr[i - 1])) {
                signChanges++;
            }
        }

        return signChanges;
    }

    const numOfSignChanges = countSignChanges(hiba);
    // console.log("Előjelváltások száma:", numOfSignChanges);

    function createDropdown() {
        // Megkeressük az "alma" ID-vel rendelkező tartalmazót
        var appleContainer = document.getElementById("alma");
        if (!appleContainer) {
            console.error("Tartalom nem található.");
            return;
        }
        var out=document.createElement("div");
        out.classList.add("o");

        // Dropdown gomb létrehozása
        var dropdownButton = document.createElement("button");
        dropdownButton.classList.add("btn", "btn-secondary", "dropdown-toggle","tbgc");
        dropdownButton.setAttribute("data-toggle", "dropdown");
        dropdownButton.textContent = "Dropdown";

        // Dropdown menü létrehozása
        var dropdownMenu = document.createElement("ul");
        dropdownMenu.classList.add("dropdown-menu");

        // Dropdown menü elem hozzáadása
        var dropdownItem = document.createElement("div");
        dropdownItem.classList.add("dropdown-item");

        let autokorrelation="Kielégítí a függetlenségi feltételt";
        if(numOfSignChanges<30){
            autokorrelation="Pozitív autokorreláció"
        }else if(numOfSignChanges>70){
            autokorrelation="Negetív autokorreláció"
        }

        dropdownItem.innerHTML = "Determinációs együttható, R^2="+r2+"<br>Teljes hiba, SST="+step5+"<br>Regressziós hiba, SSR="+ssrcalctotal+"<br>Reziduális hiba, SSE="+ssecalctotal+"<br> SSR+SSE="+ssrcalctotal+"+"+ssecalctotal+"=SST="+step5+"<br>Standard hiba, SE="+se+"<br>Kis kiugró adatok="+ (data.length-numOfDifferenceskis)/data.length+"<br>Nagy kiugró adatok="+(data.length-numOfDifferencesnagy)/data.length+"<br>Homoeszkadaszticitás="+correlation+"<br>Előjelváltások száma:"+ numOfSignChanges+"/100"+"("+autokorrelation+")";

        // console.log(dropdownItem.innerHTML);
        // Dropdown menü elem hozzáadása a menühöz
        dropdownMenu.appendChild(dropdownItem);

        // Elemek összekapcsolása
        out.appendChild(dropdownButton)
        appleContainer.appendChild(out);
        out.appendChild(dropdownMenu);

    }

    // A drop-down menü létrehozása és beszúrása az "alma" ID-vel rendelkező tartalomhoz
    createDropdown();

    return {data, forecast,finalpr,visible:true};
}

let closePrices = {};

// console.log(stocks);

stocks.forEach(stock => {
    const symbol = stock["Meta Data"]["2. Symbol"];
    const timeSeries = stock["Time Series (Daily)"];
    closePrices[symbol] = [];

    Object.values(timeSeries).forEach(data => {

        closePrices[symbol].push(parseFloat(data["4. close"]));
    });

    closePrices[symbol].reverse();
});

Object.keys(closePrices).forEach(symbol => {
    closePrices[symbol] = holtSmoothing(closePrices[symbol]);
});


const sp=closePrices;


// console.log(closePrices);


