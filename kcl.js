let currents = []; // Array to store current values
let directions = []; // Array to store directions
let numCurrents = 5; // Default number of currents

// Initialize Paper.js and set up event listeners
paper.install(window);
window.onload = function() {
    paper.setup('canvas');
    setupCurrents();
};

function setupCurrents() {
    numCurrents = parseInt(document.getElementById('numCurrents').value);
    currents = new Array(numCurrents).fill(0);
    directions = new Array(numCurrents).fill('in');

    // Create input fields for currents and directions
    let currentInputs = document.getElementById('currentInputs');
    currentInputs.innerHTML = '';
    for (let i = 0; i < numCurrents; i++) {
        currentInputs.innerHTML += `
            <label for="I${i}">I${i + 1}: <input type="number" id="I${i}" value="0" step="0.1" onchange="updateCurrents()"> A</label>
            <label for="D${i}">Direction:
                <select id="D${i}" onchange="updateCurrents()">
                    <option value="in">In</option>
                    <option value="out">Out</option>
                </select>
            </label>
        `;
    }

    updateCurrents();
}

function updateCurrents() {
    for (let i = 0; i < numCurrents; i++) {
        currents[i] = parseFloat(document.getElementById(`I${i}`).value);
        directions[i] = document.getElementById(`D${i}`).value;
    }

    // Calculate the total current based on Kirchhoff's Current Law
    let I6 = currents.reduce((sum, current, index) => {
        return sum + (directions[index] === 'in' ? current : -current);
    }, 0); // Sum of all currents, accounting for direction

    // Display the output
    document.getElementById('output').textContent = `Total Current: ${I6.toFixed(2)} A`;

    drawCircuit();
}

function drawCircuit() {
    paper.project.clear();

    // Draw the node
    let node = new paper.Path.Circle({
        center: paper.view.center,
        radius: 40,
        fillColor: 'black'
    });

    // Draw the currents
    let labels = currents.map((_, index) => `I${index + 1}`);
    let angles = Array.from({ length: numCurrents }, (_, index) => (360 / numCurrents) * index);
    let labelOffsets = new Array(numCurrents).fill(220); // Adjust label positions

    for (let i = 0; i < numCurrents; i++) {
        let endPoint = getEndPoint(angles[i], 120);
        let arrowDirection = directions[i] === 'in' ? angles[i] + 180 : angles[i]; // Adjust direction
        let arrowHeadOffset = getEndPoint(arrowDirection, 15);

        let arrow = new paper.Path({
            segments: [endPoint, paper.view.center],
            strokeColor: 'blue',
            strokeWidth: 5
        });

        let arrowHead = new paper.Path.RegularPolygon({
            center: endPoint.subtract(arrowHeadOffset.subtract(endPoint).normalize(10)),
            sides: 3,
            radius: 10,
            fillColor: 'blue',
            rotation: arrowDirection - 90
        });

        new paper.PointText({
            point: getEndPoint(angles[i], labelOffsets[i]),
            content: `${labels[i]}: ${currents[i].toFixed(1)}A (${directions[i]})`,
            fillColor: 'black',
            fontFamily: 'Arial',
            fontSize: 18,
            justification: 'center'
        });
    }

    function getEndPoint(angle, length = 80) {
        return paper.view.center.add(
            new paper.Point({
                length: length,
                angle: angle
            })
        );
    }

    paper.view.draw();
}
