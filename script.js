'use strict';

import './userFunction.js';
import {Method} from './initMethod.js';

function main() {

    // Необходимые элементы заполнения данных для рассчетов
    const inpRw = document.querySelector("#input-rows");
    const inpCl = document.querySelector("#input-cols");
    const inpRt = document.querySelector("#input-rates");
    const inpRs = document.querySelector("#input-reserves");
    const inpNs = document.querySelector("#input-needs");
    const btnCl = document.querySelector("#calculate");
    const inpMd = document.querySelectorAll(".input-method");

    // Взаимодействие с полями ввода данных
    const program = new Method(inpRw, inpCl, inpRt, inpRs, inpNs, btnCl, inpMd);

}

window.onload = main;

// 4 - венгерский метод (новая программа)