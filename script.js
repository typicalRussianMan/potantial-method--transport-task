'use strict';

NodeList.prototype.last = function() {
    return this[this.length - 1]; 
}

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.prototype.copy = function() {

    let copy = [];

    for (let i=0; i < this.length; i++) {
        copy.push(this[i]);
    }

    return copy;

}

Array.prototype.parseTable = function(node) {

    const rows = node.querySelectorAll("tr");
    for (let row of rows) {
        this.push([]);
        const cells = row.querySelectorAll("input");
        for (let cell of cells) {
            this.last().push(+cell.value);
        }
    }

}

Array.prototype.simplify = function() {
    for (let i=0; i < this.length; i++)
        this[i] = this[i][0];
}

Array.prototype.isZero = function() {

    return this.filter(el => el !== 0).length == 0;

}

Array.prototype.min = function() {

    let mini = 0, minj = 0;
    let min = this[0][0];
    for (let i=0; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) {
            if (this[i][j] >= min && this[i][j] !== null)
                continue;
            min = this[i][j];
            mini = i;
            minj = j;
        }
    }

    return [min, mini, minj];

}

Array.prototype.sum = function () {

    let sum = 0;

    for (const num of this){
        sum += num;
    }
    
    return sum;

}

Array.prototype.getCol = function(index) {

    let col = [];

    for (let i=0; i < this.length; i++) {
        col.push(this[i][index]);
    }

    return col;

}

Array.prototype.getRow = function(index) {

    return this[index];

}

Array.prototype.indOfMax = function() {

    let max = this[0];
    let maxId = 0;
    for (let i=0; i < this.length; i++) {
        if (this[i] > max) {
            max = this[i];
            maxId = i;
        }
    }

    return maxId;

}

Array.prototype.getIndexOfMin = function() {
    
    let min = this[0][0];
    let minId = [0,0];

    for (let i=0 ; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) {

            if (this[i][j] < min) {
                min = this[i][j];
                minId = [i,j];
            }

        }
    }

    return minId;

}

Array.prototype.getIndexesOfMin = function() {

    let minId = this.getIndexOfMin();
    const min = this [minId[0]] [minId[1]];

    let indexes = [];

    for (let i=0; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) {
            if (this[i][j] === min) {
                indexes.push([i,j]);
            }
        }
    }

    return indexes;

}

Array.prototype.haveNegative = function() {
    for (let i=0; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) if (this[i][j] < 0) return true;
    }

    return false;
}

Array.prototype.pushColumn = function(filler) {
    for (let i=0; i < this.length; i++) {
        this[i].push(filler);
    }
}

Array.prototype.pushRow = function(filler) {
    this.push(Array(this[0].length).fill(filler));
}

Array.prototype.notNullEnementsCount = function() {

    let cnt = 0;

    for (let row of this) {
        for (let el of row) {
            if (el !== null) cnt++;
        }
    }

    return cnt;

}

//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA START

class CalculateMethod {
    /**
     * 
     * @param {int[][]} rates 
     * @param {int[][]} reserve 
     * @param {int[][]} needs 
     * @param {node} caclBlock
     */
    constructor(rates, reserves, needs, caclBlock) {

        this.rates = rates;
        this.reserve = reserves;
        this.needs = needs;

        this.calc = caclBlock;
        this.calc.classList.remove("hide");

        const reserve = reserves.reduce((a, b) => a+b, 0);
        const need = needs.reduce((a, b) => a+b, 0);

        if (reserve > need) {
            this.needs.push(reserve - need);
            this.rates.pushColumn(0);
        } else if (need > reserve) {
            this.reserve.push(need - reserve);
            this.rates.pushRow(0);
        }

        console.log(this);

        this.evaluate();

    }

    northWestMethod() {

        let minX = 0, minY = 0;

        const maxX = this.needs.length;
        const maxY = this.reserve.length;

        let reserve = this.reserve.copy();
        let needs = this.needs.copy();
        let rates = this.rates.copy().map(el => el.map(_ => null));

        while (minX !== maxX && minY !== maxY) {

            const min = Math.min(reserve[minY], needs[minX]);

            rates[minY][minX] = min;

            reserve[minY] -= min;
            needs[minX] -= min;
            if (reserve[minY] === 0 && needs[minX] === 0 && rates[minY][minX+1] === null) {
                rates[minY][minX+1] = 0;
            } 
            if (reserve[minY] === 0) minY++;
            if (needs[minX] === 0) minX++;

        }

        return rates;

    }

    deliveryCost(spends) {

        let cost = 0;

        for (let i=0; i < spends.length; i++) {
            for (let j=0; j < spends[i].length; j++) {
                cost += this.rates[i][j]*spends[i][j]
            }
        }

        return cost;

    }

    getIndexes(spends) {

        let nodes = [];

        for (let i=0; i < spends.length; i++) {
            for (let j=0; j < spends[i].length; j++) {
                if (spends[i][j] || spends[i][j] === 0) nodes.push([i,j]);
            }
        }
        
        return nodes;

    }

    calculatePotentials(spends) {

        let u = new Array(spends.length).fill(null);
        let v = new Array(spends[0].length).fill(null);

        u[0] = 0;

        for (let i=0; i < spends.length; i++) {

            for (let j=0; j < spends[i].length; j++) {
                if (spends[i][j] !== null) {

                    if (v[j] === null && u[i] !== null) {
                        v[j] = this.rates[i][j] - u[i]; 
                    }

                    if (u[i] === null && v[j] !== null) {
                        u[i] = this.rates[i][j] - v[j];
                    }
                }
            }

        }

        for (let i=0; i < spends.length; i++) {

            for (let j=0; j < spends[i].length; j++) {
                if (spends[i][j] !== null) {

                    if (v[j] === null && u[i] !== null) {
                        v[j] = this.rates[i][j] - u[i]; 
                    }

                    if (u[i] === null && v[j] !== null) {
                        u[i] = this.rates[i][j] - v[j];
                    }
                }
            }

        }

        let potentials = spends.copy().map(el => el.map(_ => null));

        for (let i=0; i < spends.length; i++) {
            for (let j=0; j < spends[i].length; j++) {
                if (spends[i][j] === null) potentials[i][j] = this.rates[i][j] - (u[i] + v[j]);
            }
        }

        return potentials;

    }

    recount(spends, potentials) {

        let starts = potentials.getIndexesOfMin();
        let start = starts[0];

        var findWayRow = (spends, currPoint, points) => {

            const x = currPoint[1];
            const y = currPoint[0];

            const row = spends.getRow(y);

            for (let i=0; i < row.length; i++) {

                if (i === x || row[i] === null) continue;

                if (i === start[1] && y === start[0] && points.length > 1) return points;

                const elementsOnColumn = spends.getCol(i).filter(el => el !== null).length;

                if (elementsOnColumn >= 2) {
                    const way = findWayCol(spends, [y, i], points.concat([[y, i]]))
                    if (way) {
                        return way;
                    }
                }

            }

            return false;

        }

        var findWayCol = (spends, currPoint, points) => {

            const x = currPoint[1];
            const y = currPoint[0];

            const col = spends.getCol(x);

            for (let i=0; i < col.length; i++) {
        
                if (x === start[1] && i === start[0] && points.length > 1) return points;

                if (i === y) continue;

                const elementsOnRow = spends.getRow(i).filter(el => el !== null).length;

                if (
                    col[i] !== null &&
                    elementsOnRow >= 2 && 
                    findWayRow(spends, [i, x], points.concat([[i, x]]))
                ) return findWayRow(spends, [i, x], points.concat([[i, x]]));

            }

        }
        
        let ways = [];
        let mins = [];

        for (let i=0; i < starts.length; i++) {

            const s = starts[i];
            
            start = starts[i];

            const x = s[1];
            const y = s[0];

            spends[y][x] = 0;

            const way = findWayCol(spends, s, [s]);
            const values = way.map(el => spends[el[0]] [el[1]]);
            const min = Math.min(...values.filter((_, i) => i % 2 === 1));

            ways.push(way);
            mins.push(min);

            spends[y][x] = null;

        }

        const maxId = mins.indOfMax();

        const way = ways[maxId];
        const min = mins[maxId];

        spends[way[0][0]][way[0][1]] = 0;

        let canDelete = true;

        let $ = 1;
        for (const node of way) {

            const x = node[1];
            const y = node[0];

            if (spends[y][x] === min && $ === -1 && canDelete)  {
                spends[y][x] = null;
                canDelete = false;
            }

            else spends[y][x] += min*$;

            $ = -$;

        }

        return spends;

    }

    evaluate() {

        let spends = this.northWestMethod();
        console.log(spends);
        let pot = this.calculatePotentials(spends);
        console.log("0 iter: " + this.deliveryCost(spends));

        let iterations = 1;

        while (pot.haveNegative()) {
            console.log(iterations);
            spends = this.recount(spends, pot);
            pot = this.calculatePotentials(spends);
            console.log(spends, pot, this.deliveryCost(spends));
            iterations++;
        }

        console.log(spends, pot, this.deliveryCost(spends), iterations);

    }

}

//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA END 

class Method {
    /**
     * 
     * @param {node} inputRows 
     * @param {node} inputCols 
     * @param {node} inputRatesTable 
     * @param {node} inputReserveTable 
     * @param {node} inputNeedTable 
     * @param {node} buttonStartCalculate 
     */
    constructor(inputRows,inputCols,inputRatesTable,inputReserveTable,inputNeedTable,buttonStartCalculate) {

        this.ratesTable = inputRatesTable;
        this.reserveTable = inputReserveTable;
        this.needsTable = inputNeedTable

        inputRows.oninput = () => {
            this.updateRows(+inputRows.value);
        }

        inputCols.oninput = () => {
            this.updateColumns(+inputCols.value);
        }

        document.querySelector("#demo").onclick = () => {
            
            // const rates = [
            //     [5,3,1],
            //     [3,2,4],
            //     [4,1,2]
            // ]
            // const reserves = [10,20,30];
            // const needs = [15,20,25];

            // const rates = [
            //     [13,17,6,8],
            //     [2,7,10,41],
            //     [12,18,2,22]
            // ]
            // const reserves = [60,80,106];
            // const needs = [44,70,50,82];

            const rates = [
                [3,8,5,2,0],
                [1,6,6,3,0],
                [7,2,1,8,0],
                [3,3,7,6,0]
            ]
            const reserves = [50,20,30,20];
            const needs = [40,10,45,10,15];

            const caclBlock = document.querySelector("#calc-block");
           
            
            const calculator = new CalculateMethod(rates, reserves, needs, caclBlock);

            inputCols.oninput = null;
            inputRows.oninput = null;
            buttonStartCalculate.onclick = null;
            document.querySelector("#input-block").classList.add("hide");
        }

        buttonStartCalculate.onclick = () => {
            this.startCalculate();
            inputCols.oninput = null;
            inputRows.oninput = null;
            buttonStartCalculate.onclick = null;
            document.querySelector("#input-block").classList.add("hide");
        }

        this.updateRows(+inputRows.value);
        this.updateColumns(+inputCols.value);

    }

    updateRows(rows) {

        const tableRows = this.ratesTable.querySelectorAll("tr").length || 0;

        if (tableRows < rows) {
            this.addRow();
            this.updateRows(rows);
        }

        else if (tableRows > rows) {
            this.removeRow();
            this.updateRows(rows);
        }

    }

    updateColumns(columns) {

        const row = this.ratesTable.querySelector("tr");
        const tableColumns = row.querySelectorAll("td").length || 0;

        if (tableColumns < columns) {
            this.addColumn();
            this.updateColumns(columns);
        }

        else if (tableColumns > columns) {
            this.removeColumn();
            this.updateColumns(columns);
        }

    }

    addColumn() {

        const rows = this.ratesTable.querySelectorAll("tr");

        for (const row of rows) {

            const cell = document.createElement("TD");
            const input = document.createElement("INPUT");

            input.setAttribute("type", "number");
            input.setAttribute("value", "1");

            cell.append(input);
            row.append(cell);

        }

        const row = this.needsTable.querySelector("TR");
        const cell = document.createElement("TD");
        const inp = document.createElement("INPUT");

        inp.setAttribute("type", "number");
        inp.setAttribute("value", "1");

        cell.append(inp);
        row.append(cell);

    }

    removeColumn() {

        const rows = this.ratesTable.querySelectorAll("tr");

        for (const row of rows) {

            const lastCell = row.querySelectorAll("td").last();

            lastCell.remove();

        }

        this.needsTable.querySelectorAll("td").last().remove();

    }

    addRow() {

        const cols = this.ratesTable.querySelector("TR").querySelectorAll("TD").length;


        const row = document.createElement("TR");

        this.ratesTable.append(row);

        for (let _=0 ; _ < cols; _++) {
            const cell = document.createElement("TD");
            const input = document.createElement("INPUT");

            input.setAttribute("type", "number");
            input.setAttribute("value", "1");

            row.append(cell);
            cell.append(input);
        }

        this.ratesTable.append(row);

        const resRow = document.createElement("TR");
        const cell = document.createElement("TD");
        const inp = document.createElement("INPUT");

        inp.setAttribute("type", "number");
        inp.setAttribute("value", 1);

        cell.append(inp);
        resRow.append(cell);

        this.reserveTable.append(resRow);

    }

    removeRow() {

        const lastRow = this.ratesTable.querySelectorAll("tr").last();
        lastRow.remove();

        const lastRow2 = this.reserveTable.querySelectorAll("tr").last();
        lastRow2.remove();

    }

    parseTables() {

        let rates = [], 
            reserve = [], 
            needs = [];
        
        rates.parseTable(this.ratesTable);
        reserve.parseTable(this.reserveTable);
        reserve.simplify();
        needs.parseTable(this.needsTable);
        needs = needs[0];

        return [rates, reserve, needs];

    }

    startCalculate() {

        let [rates, reserve, needs] = this.parseTables();
        const caclBlock = document.querySelector("#calc-block");

        const calculator = new CalculateMethod(rates, reserve, needs, caclBlock);

    }

}

function main() {

    const inpRw = document.querySelector("#input-rows");
    const inpCl = document.querySelector("#input-cols");
    const inpRt = document.querySelector("#input-rates");
    const inpRs = document.querySelector("#input-reserves");
    const inpNs = document.querySelector("#input-needs");
    const btnCl = document.querySelector("#calculate");

    const program = new Method(inpRw, inpCl, inpRt, inpRs, inpNs, btnCl);

}

window.onload = main;