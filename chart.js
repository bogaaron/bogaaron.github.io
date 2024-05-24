

console.log(sp);
Object.entries(sp).forEach(element => {
    element[1]["forecast"].push(...element[1]["finalpr"]);
});

// console.log(sp);
// console.log(sp);
// console.log(smoothedClosePrices["sp"]["AAPL"]["data"]);

const smoothedClosePrices = {
    sp
};

// A canvas elem lekérése
const ctx = document.getElementById('myChart').getContext('2d');

// Adatok feldolgozása és ábrázolása
const datasets = [];
for (const symbol in smoothedClosePrices["sp"]) {
    const data = smoothedClosePrices["sp"][symbol]["data"];
    const forecast = smoothedClosePrices["sp"][symbol]["forecast"];

    datasets.push({
        label: `${symbol} Data`,
        data: data,
        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Háttérszín
        borderColor: 'rgba(255, 99, 132, 1)', // Szegélyszín
        borderWidth: 1
    });
    datasets.push({
        label: `${symbol} Forecast`,
        data: forecast,
        backgroundColor: 'rgba(54, 162, 235, 0.2)', // Háttérszín
        borderColor: 'rgba(54, 162, 235, 1)', // Szegélyszín
        borderWidth: 1
    });
}

// Chart inicializálása
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array.from({ length: Math.max(...datasets.map(d => d.data.length)) }, (_, i) => i + 1), // Címkék (1, 2, 3, ...)
        datasets: datasets
    },

});
