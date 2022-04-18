function isInRect([i, j], [i1,j1,i2,j2]) {
    return i >= i1 && i <= i2 && j >= j1 && j <= j2;
}

export class DOMTable {

    constructor(rows, columns, sections, id) {
        this.table = null;
        this.blocks = [];

        this.sections = sections;

        this.initTable(rows, columns, id);
    }

    /**
     * Инициализация таблицы и разбиение её на секторы
     */
    initTable(r, c, id) {
        this.table = document.createElement("TABLE");
        this.table.setAttribute("id", id);
        
        for (let i=0; i < r; i++) {
            const row = document.createElement("TR");

            for (let j=0; j < c; j++) {
                const cell = document.createElement("TD");
                const section = this.getSectionByCoord(i, j);

                if (section && section.structure) {
                    for (const el of section.structure) {
                        cell.append(el.cloneNode(false));
                    }
                }
                
                row.append(cell);
            }
            this.table.append(row);
        }
    }

    /**
     * Получение идентификатора сектора, в которого входит точка (i, j)
     */
    getSectionByCoord(i, j) {
        for (const id in this.sections) {
            const sector = this.sections[id];
            if (sector.position && isInRect([i, j], sector.position) ) return this.sections[id];
        }
        return null;
    }
    
    /**
     * Вставка таблицы в элемент-родитель
     */
    addTableToElement(node) {
        node.append(this.table);
    }

    /**
     * Получение ячейки таблицы по ее координатам
     */
    getCell(i ,j) {
        return this.table.querySelectorAll("TR")[i].querySelectorAll("TD")[j];
    }

    /**
     * Заполнение сектора таблицы данными из матрицы
     */
    pushData(data, sectionId) {
        const [i1, j1, i2, j2] = this.sections[sectionId].position;
        for (let i=i1; i <= i2; i++) {
            for (let j=j1; j <= j2; j++) {

                const cell = this.getCell(i, j);

                if (data[i-i1][j-j1] instanceof Array) {
                    const elements = cell.querySelectorAll("*");
                    for (let k=0; k < elements.length; k++) {
                        elements[k].textContent = data[i-i1][j-j1][k];
                    }
                } else cell.textContent = data[i-i1][j-j1];

            }
        }
    }

    /**
     * Очистка фона у всей таблицы
     */
    clearBackground() {
        const cells = this.table.querySelectorAll("td");
        cells.forEach(el => el.style.background = "transparent");
    }

    /**
     * Очистка фона у сектора
     */
    clearSector(sectionId) {
        const [i1,j1,i2,j2] = this.sections[sectionId].position;
        for (let i=i1; i <= i2; i++) {
            for (let j=j1; j <= j2; j++) {
                this.getCell(i, j).style.background = "transparent";
            }
        }
    }

    /**
     * Заливка ячейки в секторе необходимым  цветом
     */
    fillCell(i, j, sectionId,color) {
        const sectionPos = this.sections[sectionId].position;
        const biasI = sectionPos[0];
        const biasJ = sectionPos[1];

        const cell = this.getCell(i + biasI, j + biasJ);

        cell.style.background = color;
    }

    /**
     * Заполнение сектора необходимым цветом
     */
    fillSector(sectionId, color) {
        const [i1,j1,i2,j2] = this.sections[sectionId].position;

        for (let i=i1; i <= i2; i++) {
            for (let j=j1; j <= j2; j++) {
                this.getCell(i, j).style.background = color;
            }
        }
    }
}