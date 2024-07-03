let hasRun = false;

function correlmatrix(){

    if (!hasRun) {
        hasRun = true;
        function calculateCorrelationMatrix(prices) {
            let cormatrix = prices.map((pricesRow, i) =>
            prices.map((pricesCol, j) => {
                if (i === j) {
                return 1;
                } else {
                let stdev1 = math.std(pricesRow);
                let stdev2 = math.std(pricesCol);
                return calculateCovariance(pricesRow, pricesCol) / (stdev1 * stdev2);
                }
            })
            );
            return cormatrix;

        }

        const matrixBody = document.getElementById('matrixBody');

        calculateCorrelationMatrix(prices).forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.innerHTML = cellData.toFixed(2);
            if (cellData < 0) {
                cell.style.backgroundColor = "green";
            }
            row.appendChild(cell);
            });
            matrixBody.appendChild(row);
        });

        var table = document.getElementById("matrixBody");
        var rows = table.getElementsByTagName("tr");

        for (var i = 0; i < rows.length; i++) {
            var cells = rows[i].getElementsByTagName("td");
            for (var j = 0; j < cells.length; j++) {
                if (i === j) { // Főátló cellái
                    cells[j].style.backgroundColor = "#007bff";
                }
            }
        }
        var names=Object.keys(sp);

        // Első sor hozzáadása
        var firstRow = document.createElement("tr");
        matrixBody.insertBefore(firstRow, matrixBody.firstChild); // Beszúrás a táblázat elejére

        // Üres cella hozzáadása az első sorhoz
        // var emptyCell = document.createElement("td");
        // firstRow.appendChild(emptyCell);

        // Többi cella hozzáadása az első sorhoz a data tömb alapján
        for (var i = 0; i < names.length; i++) {
            var cell = document.createElement("td");
            cell.textContent = names[i];
            firstRow.appendChild(cell);
        }

        // Első oszlop hozzáadása
        var rows = matrixBody.getElementsByTagName("tr");
        for (var i = 0; i < rows.length; i++) {
            var cell = document.createElement("td");
            if (i === 0) { // Az első sorban üres cella
                cell.textContent = "";
            } else { // Az összes többi cella indexét tartalmazza
                cell.textContent = names[i-1];
            }
            rows[i].insertBefore(cell, rows[i].firstChild); // Beszúrás az adott sor elejére
        }
    }else{

    }
}


