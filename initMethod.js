import { CalculateMethod } from './potentialMethod.js';
import { VengerMethod } from './vengerMethod.js';

export class Method {
    /**
     * 
     * @param {node} inputRows 
     * @param {node} inputCols 
     * @param {node} inputRatesTable 
     * @param {node} inputReserveTable 
     * @param {node} inputNeedTable 
     * @param {node} buttonStartCalculate 
     */
    constructor(inputRows,inputCols,inputRatesTable,inputReserveTable,inputNeedTable,buttonStartCalculate, methodInput, vengerMethodBtn) {

        this.ratesTable = inputRatesTable;
        this.reserveTable = inputReserveTable;
        this.needsTable = inputNeedTable

        //Привязка размеров таблицы к значению поля ввода
        inputRows.oninput = () => {
            this.updateRows(+inputRows.value);
        }

        inputCols.oninput = () => {
            this.updateColumns(+inputCols.value);
        }

        //Добавление обработчика событий для начала вычисления 
        document.querySelector("#demo").onclick = () => {

            const rates = [
                [5,2,3,8],
                [3,4,7,2],
                [6,5,3,4]
            ]

            const reserves = [6,5,8];
            const needs = [4,3,7,5];

            const caclBlock = document.querySelector("#calc-block");

            let method = "northWestMethod";
            methodInput.forEach(el => {
                if (el.checked) method = el.value;
            })
           
            const calculator = new CalculateMethod(rates, reserves, needs, caclBlock, method);

            inputCols.oninput = null;
            inputRows.oninput = null;
            buttonStartCalculate.onclick = null;
            document.querySelector("#input-block").classList.add("hide");
        }
        buttonStartCalculate.onclick = () => {

            let method = "northWestMethod";
            methodInput.forEach(el => {
                if (el.checked) method = el.value;
            })

            this.startCalculate(method);

            inputCols.oninput = null;
            inputRows.oninput = null;
            buttonStartCalculate.onclick = null;
            document.querySelector("#input-block").classList.add("hide");
        }

        vengerMethodBtn.onclick = () => {
            this.startVengerMethod(...this.parseTables());
        }

        document.querySelector("#example-venger").onclick = () => {
            const rates = [
                [5,2,3,8],
                [3,4,7,2],
                [6,5,3,4]
            ];
            const reserves = [6,5,8];
            const needs = [4,3,7,5];
            this.startVengerMethod(rates, reserves, needs);
        }

        // Первоначальное обновление размеров таблицы
        this.updateRows(+inputRows.value);
        this.updateColumns(+inputCols.value);

    }

    /**
     * обновление количества строк в таблице
     */
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

    /**
     * Обновление количества столбцов в таблице
     */
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

    /**
     * Добавление колонки в таблицу справа
     */
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

    /**
     * Удаление правой колонки в таблице
     */
    removeColumn() {

        const rows = this.ratesTable.querySelectorAll("tr");

        for (const row of rows) {

            const lastCell = row.querySelectorAll("td").last();

            lastCell.remove();

        }

        this.needsTable.querySelectorAll("td").last().remove();

    }

    /**
     * Добавление строки в низ таблицы
     */
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

    /**
     * Удаление нижней строки в таблице
     */
    removeRow() {

        const lastRow = this.ratesTable.querySelectorAll("tr").last();
        lastRow.remove();

        const lastRow2 = this.reserveTable.querySelectorAll("tr").last();
        lastRow2.remove();

    }

    /**
     * Фукнция которая собирает данные из таблицы в массивы/матрицы
     */
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

    /**
     * Вызов функции для начала расчетов
     */
    startCalculate(method) {

        let [rates, reserve, needs] = this.parseTables();
        const caclBlock = document.querySelector("#calc-block");

        const calculator = new CalculateMethod(rates, reserve, needs, caclBlock, method);

    }

    startVengerMethod(rates, reserve, needs) {

        const calcBlock = document.querySelector("#calc-block");

        new VengerMethod(rates, reserve, needs);

    }

}