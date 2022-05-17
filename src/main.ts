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

function drawPoint(x: number, y: number, styleClass: "start" | "final") {
    if (table?.rows[x].cells[y].hasAttribute("class")) {
        const attClass = table.rows[x].cells[y].getAttribute("class");
        table.rows[x].cells[y].setAttribute(
            "class",
            attClass + ` ${styleClass}`
        );
    } else {
        table.rows[x].cells[y].setAttribute("class", styleClass);
    }
}

function bresenhamLine(x1: number, y1: number, x2: number, y2: number) {
    if (x2 == x1 && y2 == y1) {
        drawPoint(x1, y1, "final");
        return;
    }

    const dx = x2 - x1;
    const dy = y2 - y1;
    const sx = dx < 0 ? -1 : 1;
    const sy = dy < 0 ? -1 : 1;

    if (Math.abs(dy) < Math.abs(dx)) {
        const m = dy / dx;
        const b = y1 - m * x1;
        const temp = Math.round(m * x1 + b);

        while (x1 !== x2) {
            drawPoint(temp, y1, "final");
            x1 += sx;
        }
    } else {
        const m = dx / dy;
        const b = x1 - m * y1;
        const temp = Math.round(m * y1 + b);

        while (y1 !== y2) {
            drawPoint(temp, y1, "final");
            y1 += sy;
        }
    }

    drawPoint(x2, y2, "final");
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
    drawPoint(0, 0, "start");
    // end point
    drawPoint(rows - 1, columns - 1, "start");
});

solveBtn?.addEventListener("click", function () {
    bresenhamLine(0, 0, rows - 1, columns - 1);
    nextBtn?.removeAttribute("hidden");
});

// init game
window.addEventListener("load", () => {
    submitBtn?.click();
});
