import { DOMTable } from "./table.js";
import "./userFunction.js"

export class DisplayData {

    constructor(rates, needs, reserves, iterations, outputBlock) {

        this.rates = rates;
        this.needs = needs;
        this.reserves = reserves;
        this.iterations = iterations;
        this.currentIteration = 0;

        this.initOutput(outputBlock);

    }

    initOutput(outputBlock) {

        this.initTable(outputBlock);
        this.initTextNode(outputBlock);
        this.initButtons(outputBlock);

    }

    initTextNode(outputBlock) {

        this.textNode = document.createElement("DIV");
        this.textNode.setAttribute("id", "output-result");
        outputBlock.append(this.textNode);

    }

    initButtons(outputBlock) {
        const showWayBtn = document.createElement("BUTTON");
        showWayBtn.textContent = "Построить контур";

        const nextIterationBtn = document.createElement("BUTTON");
        nextIterationBtn.textContent = "Следующая итерация";
        nextIterationBtn.onclick = () => {
            this.nextIteration(showWayBtn);
        }

        const prevIterationBtn = document.createElement("BUTTON");
        prevIterationBtn.textContent = "Предыдущая итерация";
        prevIterationBtn.onclick = () => {
            this.prevIteration(showWayBtn);
        }

        outputBlock.append(prevIterationBtn);
        outputBlock.append(showWayBtn);
        outputBlock.append(nextIterationBtn);

        this.showIteration(this.iterations[this.currentIteration], showWayBtn);
    
    }

    initTable(outputBlock) {

        const tableW = this.needs.length + 2;
        const tableH = this.reserves.length + 2;

        const outputRates = document.createElement("DIV");
        outputRates.classList.add("output-rates");

        const outputPotents = document.createElement("DIV");
        outputPotents.classList.add("output-potentials");

        const outputSpends = document.createElement("DIV");
        outputSpends.classList.add("output-spends");

        const uDef = document.createElement("DIV");
        uDef.classList.add("def-u");

        const vDef = document.createElement("DIV");
        vDef.classList.add("def-v");

        const sections = {
            "rates": {
                position: [1, 1, tableH-2, tableW-2],
                structure: [
                    outputRates,
                    outputPotents,
                    outputSpends
                ]
            },
            "needs": {
                position: [tableH-1, 1, tableH-1, tableW-2],
                structure: null
            },
            "reserves": {
                position: [1, tableW-1, tableH-2, tableW-1],
                structure: null
            },
            "reserves-header": {
                position: [0, tableW-1, 0, tableW-1],
                structure:null
            },
            "needs-header": {
                position: [tableH-1, 0, tableH-1, 0],
                structure: null
            },
            "u": {
                position: [1, 0, tableH-2, 0],
                structure: null
            },
            "v": {
                position:[0, 1, 0, tableW-2] ,
                structure: null
            },
            "uv-header": {
                position: [0, 0, 0, 0],
                structure: [uDef, vDef]
            },
            "sum": {
                position: [tableH-1, tableW-1, tableH-1, tableW-1],
                structure: null
            }
        }

        this.table = new DOMTable(tableH, tableW, sections, "output-iterations");
        
        this.table.addTableToElement(outputBlock);

        this.table.pushData([this.needs.map((el, i) => "A" + (i+1) + "=" + el)], "needs");
        this.table.pushData(this.reserves.map((el, i)=> ["B" + (i+1) + "=" + el]), "reserves");
        this.table.pushData([[this.needs.reduce((a, b) => a + b, 0)]], "sum")
        this.table.pushData([["Запасы"]], "reserves-header");
        this.table.pushData([["Потребности"]], "needs-header");
        this.table.pushData([[["Ui", "Vj"]]], "uv-header")

        const borderColor = "#efefef"

        this.table.fillSector("needs", borderColor);
        this.table.fillSector("reserves", borderColor);
        this.table.fillSector("sum", borderColor);
        this.table.fillSector("reserves-header", borderColor);
        this.table.fillSector("needs-header", borderColor);
        this.table.fillSector("u", borderColor);
        this.table.fillSector("v", borderColor);
        this.table.fillSector("uv-header", borderColor);
    }

    nextIteration(showWayBtn) {

        if (this.currentIteration >= this.iterations.length - 1) return;

        this.currentIteration++;
        this.showIteration(this.iterations[this.currentIteration], showWayBtn);

    }

    prevIteration(showWayBtn) {

        if(this.currentIteration <= 0) return;

        this.currentIteration--;
        this.showIteration(this.iterations[this.currentIteration], showWayBtn);

    }

    showIteration({spends, potentials, u, v, way, cost}, showWayBtn) {

        this.table.clearSector("rates");

        const totalMatrix = spends.map((rw, i) => rw.map((el, j) => [this.rates[i][j], potentials[i][j], el]));

        this.table.pushData(totalMatrix, "rates");
        this.table.pushData(u.map(el => [el]), "u");
        this.table.pushData([v], "v");

        showWayBtn.onclick = () => {
            this.showWay(way)
        }

        this.textNode.textContent = "Итерация " + (this.currentIteration+1)+ ". Текущее решение: " + cost + ".";
        this.textNode.textContent += way ? " Решение не оптимально, можно найти решение не хуже нынешнего" : " Решение оптимально";

    }

    showWay(way) {
        if (!way) return;
        
        this.table.fillCell(way[0][0], way[0][1], "rates" , "#ffa");

        for (let i=1; i < way.length; i++) {
            this.table.fillCell(way[i][0], way[i][1], "rates", "#afa");
        }
    }
}