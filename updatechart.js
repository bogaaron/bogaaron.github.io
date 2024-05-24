
console.log(sp);
Object.entries(sp).forEach(element => {
    element[1]["forecast"].push(...element[1]["finalpr"]);
});

function scrollToElement() {

    $('#exampleModal').modal('toggle');

    setTimeout(() => {
        var target = document.getElementById('myChart');
        var holder = document.getElementById('holder');
        holder.style.display="block";
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },500)


}

// console.log(sp);

const smoothedClosePrices = {
    sp
};

const ctx = document.getElementById('myChart').getContext('2d');
let myChart;

function renameDrop(){
    // Az összes részvény nevének kinyerése az "sp" objektumból
    const stockNames = Object.keys(sp);
    const divs = document.querySelectorAll(`.tbgc`);
    // A divek szövegének módosítása a részvénynevekkel

    console.log(stockNames.length);

    for(var i = 0; i < stockNames.length; i++){
        divs[i].textContent = stockNames[i];
    }
}

renameDrop();

function toggleAlma() {
    console.log("most");
    const almaDiv = document.getElementById('alma');
    // Megváltoztatjuk az "alma" div display tulajdonságát, hogy megjelenjen vagy eltűnjön
    if (almaDiv.style.display === 'none') {
      almaDiv.style.display = 'flex';
    } else {
      almaDiv.style.display = 'none';
    }
}

const createCheckbox = (symbol) => {

    const div = document.createElement('div');
    div.className='custom-control custom-switch';
    div.id='checkboxes';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name=symbol;
    checkbox.className='custom-control-input';
    checkbox.checked = true;
    checkbox.id = symbol;
    checkbox.onchange = () => {
        smoothedClosePrices.sp[symbol].visible = checkbox.checked;
        updateChart();
    };

    const label = document.createElement('label');
    label.htmlFor = symbol;
    label.className='custom-control-label';
    label.appendChild(document.createTextNode(symbol));

    div.append(checkbox);
    div.append(label);
    document.getElementById('checkboxes').append(div);
};



Object.keys(smoothedClosePrices.sp).forEach(symbol => {
    // console.log(symbol);
    createCheckbox(symbol);
    // createCheckbox2(symbol);
});

const updateChart = () => {
    if (myChart) {
        myChart.destroy();
    }

    const colors = ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)']; // Add more colors if needed

    const visibleDatasets = Object.entries(smoothedClosePrices.sp)
        .filter(([symbol, data], index) => data.visible)
        .flatMap(([symbol, data], index) => {
            const colorIndex = index % colors.length; 
            return [
                {
                    label: symbol,
                    data: data.data,
                    backgroundColor: colors[colorIndex],
                    borderColor: colors[colorIndex].replace('0.2', '1'), 
                    borderWidth: 1,
                    hidden: !data.visible
                },
                {
                    label: symbol + ' Forecast',
                    data: data.forecast,
                    backgroundColor: "rgba(0, 128, 0, 0.2)", 
                    borderColor: "rgba(0, 128, 0, 0.4)", 
                    borderWidth: 1,
                    hidden: !data.visible
                }
            ];
        });

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: Math.max(...visibleDatasets.map(d => d.data.length)) }, (_, i) => `Day ${i + 1}`),
            datasets: visibleDatasets
        }
    });
};

updateChart();

