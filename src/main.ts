import "./style/style.css";

const menu = document.getElementById("menu") as HTMLSelectElement;
const submitBtn = document.getElementById("submit");
const solveBtn = document.getElementById("solve");
const nextBtn = document.getElementById("next");
const table = document.getElementById("gameTable") as HTMLTableElement;
const para = document.getElementById("para");

const levelDecoration = document.getElementById("level");

let rows = 0;
let columns = 0;
let level = 0;
let score = 0;
let overall = 0;

const NODE_NAME_TABLE_DATA = "TD";

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

function bresenhamLine(x0: number, y0: number, x1: number, y1: number) {
    if (x0 === x1 && y0 === y1) {
        drawPoint(x0, y0, "final");
        return;
    }

    const dx = x1 - x0;
    const sx = dx < 0 ? -1 : 1;
    const dy = y1 - y0;
    const sy = dy < 0 ? -1 : 1;

    if (Math.abs(dy) < Math.abs(dx)) {
        const m = dy / dx;
        const b = y0 - m * x0;

        while (x0 !== x1) {
            drawPoint(x0, Math.round(m * x0 + b), "final");
            x0 += sx;
        }
    } else {
        const m = dx / dy;
        const b = x0 - m * y0;

        while (y0 !== y1) {
            drawPoint(Math.round(m * y0 + b), y0, "final");
            y0 += sy;
        }
    }

    drawPoint(x1, y1, "final");
}

function plotLine(x0: number, y0: number, x1: number, y1: number) {
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
        drawPoint(x0, y0, "final"); // Do what you need to for this

        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

function increaseLevel(level: number) {
    if (level < 6) {
        menu.options[0].selected = true;
    } else if (level < 11) {
        menu.options[1].selected = true;
    } else if (level < 16) {
        menu.options[2].selected = true;
    } else {
        menu.options[3].selected = true;
    }
}

function roundQuarter(num: number) {
    return Math.round(num * 4) / 4;
}

function calculateScore() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            const cellItem = table.rows[i].cells[j];
            const classCellItem = cellItem.getAttribute("class");

            if (classCellItem !== null && classCellItem.includes("start")) {
                continue;
            } else if (classCellItem === "clicked final") {
                score++;
                overall++;
            } else if (
                classCellItem !== null &&
                classCellItem.includes("final")
            ) {
                overall++;
            }
        }
    }

    let rate = (score * 100) / overall;
    if (isNaN(rate)) {
        rate = 0;
    }
    increaseLevel(level);
    if (para) {
        para.innerHTML =
            '<span id="level">LEVEL: ' +
            ++level +
            "</span><br>Current Score: " +
            score +
            " out of " +
            overall +
            "<br>Success rate: " +
            roundQuarter(rate) +
            "%";
    }
}

menu.addEventListener("change", function () {
    document.getElementById("rows")?.setAttribute("hidden", "hidden");
    document.getElementById("columns")?.setAttribute("hidden", "hidden");
    submitBtn?.click();
    table?.style.removeProperty("pointer-events");
});

submitBtn?.addEventListener("click", () => {
    solveBtn?.removeAttribute("hidden");
    nextBtn?.setAttribute("hidden", "hidden");
    const difficulty = menu?.options[menu?.selectedIndex].value;
    let html = "";

    function displayTable() {
        for (let i = 0; i < rows; i++) {
            html += "<tr>";
            for (let j = 0; j < columns; j++) {
                html += "<td> </td>";
            }
            html += "</tr>";
        }
    }

    switch (parseInt(difficulty)) {
        case 1:
            if (levelDecoration !== null) {
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

            displayTable();
            break;
        case 2:
            if (level === 0) {
                level = 7;
            }
            if (levelDecoration !== null) {
                levelDecoration.setAttribute(
                    "style",
                    "color:green; font-weight:bold;"
                );
            }
            rows = 4 + Math.round(Math.random() + level);
            columns = 6 + Math.round(Math.random() + level);
            displayTable();
            break;
        case 3:
            if (level === 0) {
                level = 12;
            }
            if (levelDecoration !== null) {
                levelDecoration.setAttribute(
                    "style",
                    "color:green; font-weight:bold;"
                );
            }
            rows = 6 + Math.round(Math.random() + level);
            columns = 8 + Math.round(Math.random() + level);
            displayTable();
            break;
        case 4:
            if (level === 0) {
                level = 17;
            }
            if (levelDecoration !== null) {
                levelDecoration.setAttribute(
                    "style",
                    "color:green; font-weight:bold;"
                );
            }
            rows = 8 + Math.round(Math.random() + level);
            columns = 12 + Math.round(Math.random() + level);
            displayTable();
            break;
        default:
            console.log("default");
            break;
    }

    if (table) {
        table.innerHTML = html;
    }
    // start point
    drawPoint(0, 0, "start");
    // end point
    drawPoint(rows - 1, columns - 1, "start");
});

document.addEventListener("click", function (event: Event) {
    const target = event.target as HTMLElement;

    if (target.nodeName === NODE_NAME_TABLE_DATA) {
        const classesNodeTarget = target.getAttribute("class");
        if (
            !target.hasAttribute("class") ||
            classesNodeTarget!.includes("undo")
        ) {
            target.setAttribute("class", "clicked");
        } else {
            target.setAttribute(
                "class",
                classesNodeTarget!.replace("clicked", "undo")
            );
        }
    }
});

solveBtn?.addEventListener("click", function () {
    bresenhamLine(0, 0, rows - 1, columns - 1);
    calculateScore();
    nextBtn?.removeAttribute("hidden");
    solveBtn.setAttribute("hidden", "hidden");
    table.style.pointerEvents = "none";
});

nextBtn?.addEventListener("click", function () {
    submitBtn?.click();
    solveBtn?.removeAttribute("hidden");
    table.style.removeProperty("pointer-events");
});

// init game
window.addEventListener("load", () => {
    submitBtn?.click();
});
