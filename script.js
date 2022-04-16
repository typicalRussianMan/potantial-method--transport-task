'use strict';

import './userFunction.js';
import {Method} from './initMethod.js';

function main() {

    const inpRw = document.querySelector("#input-rows");
    const inpCl = document.querySelector("#input-cols");
    const inpRt = document.querySelector("#input-rates");
    const inpRs = document.querySelector("#input-reserves");
    const inpNs = document.querySelector("#input-needs");
    const btnCl = document.querySelector("#calculate");
    const inpMd = document.querySelectorAll(".input-method");

    const program = new Method(inpRw, inpCl, inpRt, inpRs, inpNs, btnCl, inpMd);

}

window.onload = main;

// 2 - возможность поиска контура из точки, выбранной пользователем
// 4 - венгерский метод (новая программа)