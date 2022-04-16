import { DisplayData } from "./displayOutput.js";

export class CalculateMethod {
    /**
     * 
     * @param {int[][]} rates 
     * @param {int[][]} reserve 
     * @param {int[][]} needs 
     * @param {node} calcBlock
     */
    constructor(rates, reserves, needs, calcBlock, firstIterationMethod) {

        this.rates = rates;
        this.reserve = reserves;
        this.needs = needs;

        this.calcBlock = calcBlock;
        calcBlock.classList.remove("hide");

        const reserve = reserves.reduce((a, b) => a+b, 0);
        const need = needs.reduce((a, b) => a+b, 0);

        if (reserve > need) {
            this.needs.push(reserve - need);
            this.rates.pushColumn(0);
        } else if (need > reserve) {
            this.reserve.push(need - reserve);
            this.rates.pushRow(0);
        }

        this.evaluate(firstIterationMethod);

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

    fogelsMethod() {

        let reserve = this.reserve.copy();
        let needs = this.needs.copy();
        let spends = this.rates.map(el => el.map(_ => null));

        const rows = reserve.length;
        const cols = needs.length;

        for (let _=0; _ < rows + cols - 1; _++) {

            let maxDelta = null;
            let maxDeltaId = [null, null];

            for (let j=0; j < cols; j++) {

                if (needs[j] === 0) continue;

                const col = this.rates.getCol(j).map((el, i) => reserve[i] ? el : null);
                const sortedCol = col.copy().sort((a, b) => a - b).filter(el => el !== null);

                const delta = sortedCol[1] - sortedCol[0] || 0;
                const i = col.indexOf(sortedCol[0]);

                if ((delta > maxDelta || maxDelta === null) && reserve[i]) {
                    maxDelta = delta;
                    maxDeltaId = [i, j];
                }

            }

            for (let i=0; i < rows; i++) {

                if (reserve[i] === 0) continue;

                const row = this.rates.getRow(i).map((el, j) => needs[j] ? el : null);
                const sortedRow = row.copy().sort((a, b) => a - b).filter(el => el !== null);

                const delta = sortedRow[1] - sortedRow[0] || 0;
                const j = row.indexOf(sortedRow[0]);

                if ((delta > maxDelta || maxDelta === null) && needs[j]) {
                    maxDelta = delta;
                    maxDeltaId = [i, j];
                }

            }

            const [i, j] = maxDeltaId;
            const currentSpend = Math.min(needs[j], reserve[i]);

            needs[j] -= currentSpend;
            reserve[i] -= currentSpend;

            if (needs[j] === reserve[i]) _++;

            spends[i][j] = currentSpend

        }

        for (let i=spends.notNullEnementsCount(); i < rows + cols - 1; i++) {
            spends.replaceFirst(null, 0);
        }

        return spends;

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

        for (let _ = 0; _ < u.length + v.length; _++) {
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
        }

        let potentials = spends.copy().map(el => el.map(_ => null));

        for (let i=0; i < spends.length; i++) {
            for (let j=0; j < spends[i].length; j++) {
                if (spends[i][j] === null) potentials[i][j] = this.rates[i][j] - (u[i] + v[j]);
            }
        }

        return [potentials, u, v];

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

            for (let i = 0; i < col.length; i++) {

                if (i === y || col[i] === null) continue;
        
                if (x === start[1] && i === start[0] && points.length > 1) return points;


                const elementsOnRow = spends.getRow(i).filter(el => el !== null).length;

                if (elementsOnRow >= 2) {
                    const way = findWayRow(spends, [i, x], points.concat([[i, x]]));
                    if (way) return findWayRow(spends, [i, x], points.concat([[i, x]]));
                }

            }

            return false;

        }
        
        let ways = [];
        let mins = [];

        for (let i=0; i < starts.length; i++) {

            const s = starts[i];
            
            start = starts[i];

            const x = s[1];
            const y = s[0];

            spends[y][x] = 0;

            const cutSpends = spends;

            const way = findWayCol(cutSpends, s, [s]);
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

        return [spends, way];

    }

    evaluate(firstIterationMethod) {
        
        const allIterations = [];
        let way;

        let spends = this[firstIterationMethod]();
        let [pot, u, v] = this.calculatePotentials(spends);

        allIterations.push({
            spends: spends.deepCopy(),
            potentials: pot.deepCopy(),
            u: u.deepCopy(),
            v: v.deepCopy(),
            cost: this.deliveryCost(spends)
        })

        let iterations = 0;

        while (pot.haveNegative()) {
            iterations++;
            [spends, way] = this.recount(spends, pot);
            [pot, u, v] = this.calculatePotentials(spends);

            allIterations.push({
                spends: spends.deepCopy(),
                potentials: pot.deepCopy(),
                u: u.deepCopy(),
                v: v.deepCopy(),
                cost: this.deliveryCost(spends)
            })

            allIterations[iterations-1].way = way;

        }

        const outputColution = new DisplayData(this.rates, this.needs, this.reserve, allIterations, this.calcBlock);

    }

}