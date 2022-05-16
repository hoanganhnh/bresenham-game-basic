import "./style/style.css";

const menu = document.getElementById("menu") as HTMLSelectElement;
const submitBtn = document.getElementById("submit");
const solveBtn = document.getElementById("solve");
const nextBtn = document.getElementById("next");
const table = document.getElementById("gameTable") as HTMLTableElement;

const levelDecoration = null;

let rows = 0;
let columns = 0;
const level = 0;

function getMargin(columns: number) {
    return Math.abs(window.innerWidth / 2 - (50 * columns) / 2);
}

function drawPoint(x: number, y: number) {
    if (table?.rows[x].cells[y].hasAttribute("class")) {
        const attClass = table.rows[x].cells[y].getAttribute("class");
        table.rows[x].cells[y].setAttribute("class", attClass + " start");
    } else {
        table.rows[x].cells[y].setAttribute("class", "start");
    }
}

submitBtn?.addEventListener("click", () => {
    solveBtn?.removeAttribute("hidden");
    nextBtn?.setAttribute("hidden", "hidden");
    const difficulty = menu?.options[menu?.selectedIndex].value;
    let html = "";
    let margin = 0;

    switch (parseInt(difficulty)) {
        case 1:
            if (levelDecoration !== null) {
                // @ts-ignore
                levelDecoration.setAttribute(
                    "style",
                    "color:lime; font-weight:bolder;"
                );
            }
            rows = 1 + Math.round(Math.random() + level);

            if (rows !== 1) {
                columns = 2 + Math.round(Math.random() + level);
            } else {
                columns = 3;
            }

            for (let i = 0; i < rows; i++) {
                html += "<tr>";
                for (let j = 0; j < columns; j++) {
                    html += "<td> </td>";
                }
                html += "</tr>";
            }
            break;
        default:
            console.log("default");
            break;
    }

    margin = getMargin(columns);
    const dataEle = document.getElementById("data");
    if (dataEle && table) {
        dataEle.style.marginLeft = margin + "px";
        table.innerHTML = html;
    }
    // start point
    drawPoint(0, 0);
    // end point
    drawPoint(rows - 1, columns - 1);
});

// init game
window.addEventListener("load", () => {
    submitBtn?.click();
});
