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

    initTable(r, c, id) {
        this.table = document.createElement("TABLE");
        this.table.setAttribute("id", id);
        
        for (let i=0; i < r; i++) {
            const row = document.createElement("TR");

            for (let j=0; j < c; j++) {
                const cell = document.createElement("TD");
                const section = this.getSecrionByCoord(i, j);

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

    getSecrionByCoord(i, j) {
        for (const id in this.sections) {
            const sector = this.sections[id];
            if (sector.position && isInRect([i, j], sector.position) ) return this.sections[id];
        }
        return null;
    }
    
    addTableToElement(node) {
        node.append(this.table);
    }

    getCell(i ,j) {
        return this.table.querySelectorAll("TR")[i].querySelectorAll("TD")[j];
    }

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

    clearBackground() {
        const cells = this.table.querySelectorAll("td");
        cells.forEach(el => el.style.background = "transparent");
    }

    clearSector(sectionId) {
        const [i1,j1,i2,j2] = this.sections[sectionId].position;
        for (let i=i1; i <= i2; i++) {
            for (let j=j1; j <= j2; j++) {
                this.getCell(i, j).style.background = "transparent";
            }
        }
    }

    fillCell(i, j, sectionId,color) {
        const sectionPos = this.sections[sectionId].position;
        const biasI = sectionPos[0];
        const biasJ = sectionPos[1];

        const cell = this.getCell(i + biasI, j + biasJ);

        cell.style.background = color;
    }

    fillSector(sectionId, color) {
        const [i1,j1,i2,j2] = this.sections[sectionId].position;

        for (let i=i1; i <= i2; i++) {
            for (let j=j1; j <= j2; j++) {
                this.getCell(i, j).style.background = color;
            }
        }
    }
}


// section - position (Pstart, Pend) + cell structure (array of dom elements) + id