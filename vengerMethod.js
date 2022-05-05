import "./userFunction.js";

export class VengerMethod {

    constructor(rates, reserves, needs) {

        this.rates = rates;
        this.needs = needs;
        this.reserves = reserves;

        this.evaluate();

    }

    findDualPlanComponents() {

        let rates = this.rates.deepCopy();

        let u = [];
        let v = [];

        for (let i=0; i < rates.length; i++) {
            u.push(Math.min(...rates[i]));
        }

        rates = rates.map((rw, i) => rw.map(el => {
            return el - u[i];
        }))

        for (let j=0; j < rates[0].length; j++) {
            const col = rates.getCol(j);
            v.push(Math.min(...col));
        }

        rates = rates.map(rw => rw.map((el, j) => {
            return el - v[j];
        }));

        return rates;

    }

    calculateSpends(rates) {

        let needs = this.needs.copy();
        let reserves = this.reserves.copy();

        let spends = rates.map((rw, i) => {
            return rw.reverseMap((el, j) => {
                if (el !== 0) return null;
                const spend = Math.min(reserves[i], needs[j]);
                reserves[i] -= spend;
                needs[j] -= spend;
                return spend;
            })
        })

        return [spends, needs, reserves];

    }

    crossedRC(id, Ucols, spends) {
        for (let j=0; j < Ucols.length; j++) {
            if (spends[id][j] === null) continue;

            if (Ucols[j] !== null) return [j+1, Math.min(Ucols[j][1], spends[id][j])];
        }
        return null;
    }

    crossedCR(id, Urows, spends) {
        for (let i=0; i < Urows.length; i++) {
            if (spends[i][id] == null) continue;

            if (Urows[i] !== null) return [i+1, Urows[i][1]];
        }
        return null;
    }

    findUnsaturated(spends, needs, reserves) {

        let Urows = reserves.map(el => {
            if (el === 0) return null;

            return [0, el];
        })

        let Ucols = needs.map((el, j) => {
            for (let i=0; i < reserves.length; i++) {
                if (spends[i][j] !== null && Urows[i]) {
                    return [i+1, Urows[i][1]];
                }
            }
            return null;
        })

        Urows = Urows.map((el, i) => {
            const Ucross = this.crossedRC(i, Ucols, spends)
            if (el === null && Ucross !== null) {
                return Ucross;
            }
            return el;
        })

        Ucols = Ucols.map((el, j) => {
            const Ucross = this.crossedCR(j, Urows, spends)
            if (el === null && Ucross !== null) {
                this.jStar = j;
                return Ucross;
            }
            return el;
        })


        return [Urows, Ucols];

    }

    findMin(rates, Ucols, Urows) {
        let min = Infinity;
        for (let i=0; i < rates.length; i++) {
            if (Urows[i] === null) continue;
            for (let j=0; j < rates[i].length; j++) {
                if (Ucols[j] !== null) continue;
                if (rates[i][j] < min) {
                    min = rates[i][j];
                }
            }
        }
        return min;
    }

    saturateRates(rates, Ucols, Urows) {
        const min = this.findMin(rates, Ucols, Urows);

        for (let i=0; i < rates.length; i++) {
            for (let j=0; j < rates[i].length; j++) {
                if (Urows[i] !== null && Ucols[j] === null) rates[i][j] -= min;
                if (Urows[i] === null && Ucols[j] !== null) rates[i][j] += min;
            }
        }

        return rates;
        
    }

    findWay(spends, Urows, Ucols) {
        
    }

    evaluate() {

        let rates = this.findDualPlanComponents();

        let [spends, Rneeds, Rreserves] = this.calculateSpends(rates);

        let [Urows, Ucols] = this.findUnsaturated(spends, Rneeds, Rreserves);

        while (Urows.some(el => el ===null) && Ucols.some(el => el === null)) {
            rates = this.saturateRates(rates, Ucols, Urows);
            let [spends, Rneeds, Rreserves] = this.calculateSpends(rates);
            [Urows, Ucols] = this.findUnsaturated(spends, Rneeds, Rreserves);
        }

        console.log("1st part", rates.deepCopy(), spends.deepCopy(), Urows.copy(), Ucols.copy());
        console.log(this.jStar);



    }

}