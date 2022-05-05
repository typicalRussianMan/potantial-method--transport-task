/**
 * Послений элемент в NodeList
 */
NodeList.prototype.last = function() {
    return this[this.length - 1]; 
}

Math.sum = function(...args) {
    return args.filter(el => el !== null).reduce((a, b) => a+b, 0);
}

/**
 * Последний элемент в Array
 */
Array.prototype.last = function() {
    return this[this.length - 1];
}

/**
 * Создает копию массива
 */
Array.prototype.copy = function() {

    let copy = [];

    for (let i=0; i < this.length; i++) {
        copy.push(this[i]);
    }

    return copy;

}

/**
 * Создает полную копию массива
 */
Array.prototype.deepCopy = function() {

    let dpcopy = [];

    for (let el of this) {

        if (el instanceof Array) {
            dpcopy.push(el.deepCopy());
        } else dpcopy.push(el);

    }

    return dpcopy;

}

/**
 * Замена всех элементов в массиве на другие
 */
Array.prototype.deepReplace = function (replacement, newElement) {

    let dprep = [];

    for (let el of this) {
        if (el instanceof Array) {
            dprep.push(el.deepReplace(replacement, newElement));
        } else dprep.push(el === replacement ? newElement : el);
    }

    return dprep;

}

/**
 * Получение данных из таблицы в матрицу
 */
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

/**
 * Преобразует массив вида [[a], [b], [c]] в [a, b, c]
 */
Array.prototype.simplify = function() {
    for (let i=0; i < this.length; i++) this[i] = this[i][0];
}

/**
 * Проверяет, является ли каждый элемент в массиве нулевым
 */
Array.prototype.isZero = function() {
    return this.every(el => el === 0);
}

/**
 * Находит минимальный элемент в матрице и его координаты
 */
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

/**
 * Возвращает сумму массива
 */
Array.prototype.sum = function () {
    return this.reduce((a, b) => a + b, 0);
}

/**
 * Возвращает значения матрицы в колонке (index)
 */
Array.prototype.getCol = function(index) {
    return this.reduce((a, b) => a.concat(b[index]), []);
}

/**
 * Возвращает значения матрицы в строке (index)
 */
Array.prototype.getRow = function(index) {
    return this[index];
}

/**
 * Возвращает индекс максимального значения в массиве
 */
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

/**
 * Возвращает координаты минимального элемента в матрице
 */
Array.prototype.getIndexOfMin = function() {
    
    let min = this[0][0] || Infinity;
    let minId = [0,0];

    for (let i=0 ; i < this.length; i++) {
        for (let j=0; j < this[i].length; j++) {

            if (this[i][j] < min && this[i][j] !== null) {
                min = this[i][j];
                minId = [i,j];
            }

        }
    }

    return minId;

}

/**
 * Возвращает список координат минимальных элементов в матрице
 */
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

/**
 * Проверяет, существует ли отрицательный элемент в матрице
 */
Array.prototype.haveNegative = function() {
    return this.some(rw => rw.some(el => el < 0))
}

/**
 * Добавляет в матрицу колонку, заполненную значением filler
 */
Array.prototype.pushColumn = function(filler) {
    for (let i=0; i < this.length; i++) {
        this[i].push(filler);
    }
}

/**
 * Добавляет в матрицу строку, заполненную значением filler
 */
Array.prototype.pushRow = function(filler) {
    this.push(Array(this[0].length).fill(filler));
}

/**
 * Возвращает количество элементов со значением не null
 */
Array.prototype.notNullEnementsCount = function() {
    let cnt = 0;

    for (let row of this) {
        for (let el of row) {
            if (el !== null) cnt++;
        }
    }
    return cnt;
}

/**
 * Заменяет первое вхождение элемента 
 */
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

/**
 * Заполняет колонку матрицы значением filler
 */
Array.prototype.setColumn = function(id, filler) {

    for (let i=0; i < this.length; i++) {
        this[i][id] = filler;
    }

}

/**
 * Заполняет строчку матрицы значением filler
 */
Array.prototype.setRow = function(id, filler) {

    for (let i=0; i < this[id].length; i++) {
        this[id][i] = filler;
    }

}

/**
 * 
 * @param { function } fun 
 * Метод аналогичен методу map, но начинает обход с конца
 */
Array.prototype.reverseMap = function(fun) {
    let mapArr = [];
    for (let i = this.length-1; i >= 0; i--) {
        mapArr.push(fun(this[i], i));
    }
    return mapArr.reverse();
}

