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

Array.prototype.deepCopy = function() {

    let dpcopy = [];

    for (let el of this) {

        if (el instanceof Array) {
            dpcopy.push(el.deepCopy());
        } else dpcopy.push(el);

    }

    return dpcopy;

}

Array.prototype.deepReplace = function (replacement, newElement) {

    let dprep = [];

    for (let el of this) {
        if (el instanceof Array) {
            dprep.push(el.deepReplace(replacement, newElement));
        } else dprep.push(el === replacement ? newElement : el);
    }

    return dprep;

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

    return this.every(el => el === 0);
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

    return this.reduce((a, b) => a.concat(b[index]), []);

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
    for (let i=0; i < this.length; i++) 
        for (let j=0; j < this[i].length; j++) 
            if (this[i][j] < 0) return true;
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

Array.prototype.cut = function() {

    let arr = this.deepCopy();
    let isDeleted = false;

    for (let i=0; i < arr.length; i++) {
        if (arr[i].filter(el => el !== null).length < 2) {
            arr[i] = arr[i].map(_ => null);
            isDeleted = true;
        }
    }

    for (let i=0; i < arr[0].length; i++) {
        const col = arr.getCol(i);
        if (col.filter(el => el !== null).length < 2) {
            arr.map(el => { 
                el[i] = null;
            })
            isDeleted = true;
        }
    }

    return isDeleted ? arr.cut() : arr;

}

Array.prototype.replaceFirst = function(rep, fill) {

    for (let i=0; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) {
            if (this[i][j] === rep) {
                this[i][j] = fill;
                return;
            }
        }
    }

}