let layout = {
    title: '3D Graphing Calculator',
    showlegend: true,
    autosize: true,
    scene: {
        xaxis: {range: [-5, 5]},
        yaxis: {range: [-5, 5]},
        zaxis: {range: [-5, 5]}
    }
};

let config = {
    displaylogo: false,
    responsive: true
};

Plotly.newPlot('graph', [], layout, config);

function addEquation() {
    const equationList = document.getElementById('equation-list');
    const newEquation = document.createElement('div');
    newEquation.className = 'equation-item';
    newEquation.innerHTML = `
        <input type="text" class="equation-input" placeholder="Enter an equation (e.g., x^2 + y^2)">
        <button class="remove-equation">×</button>
    `;
    equationList.appendChild(newEquation);
    
    newEquation.querySelector('.equation-input').addEventListener('input', updateGraph);
    newEquation.querySelector('.remove-equation').addEventListener('click', function() {
        equationList.removeChild(newEquation);
        updateGraph();
    });
}

function updateGraph() {
    const equations = document.querySelectorAll('.equation-input');
    const graphType = document.querySelector('input[name="graph-type"]:checked').value;
    let data = [];

    equations.forEach((eq, index) => {
        if (eq.value.trim() !== '') {
            try {
                const expr = math.compile(eq.value);
                if (graphType === '2d') {
                    let x = math.range(-5, 5, 0.1).toArray();
                    let y = x.map(x => expr.evaluate({x: x}));
                    
                    data.push({
                        x: x,
                        y: y,
                        type: 'scatter',
                        mode: 'lines',
                        name: `y = ${eq.value}`
                    });
                } else {
                    let xValues = math.range(-5, 5, 0.1).toArray();
                    let yValues = math.range(-5, 5, 0.1).toArray();
                    let zValues = [];

                    for (let i = 0; i < yValues.length; i++) {
                        zValues.push(xValues.map(x => expr.evaluate({x: x, y: yValues[i]})));
                    }

                    data.push({
                        x: xValues,
                        y: yValues,
                        z: zValues,
                        type: 'surface',
                        name: `z = ${eq.value}`
                    });
                }
            } catch (error) {
                console.error(`Error evaluating equation ${index + 1}:`, error);
            }
        }
    });

    layout.scene.xaxis.range = [-5, 5];
    layout.scene.yaxis.range = [-5, 5];
    layout.scene.zaxis.range = [-5, 5];

    Plotly.react('graph', data, layout, config);
}

document.getElementById('add-equation').addEventListener('click', addEquation);
document.addEventListener('input', function(e) {
    if (e.target.classList.contains('equation-input')) {
        updateGraph();
    }
});
document.querySelectorAll('input[name="graph-type"]').forEach(radio => {
    radio.addEventListener('change', updateGraph);
});

addEquation();