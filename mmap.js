const canvas = document.getElementById('mindmap-canvas');
const ctx = canvas.getContext('2d');
const toolbar = document.getElementById('toolbar');
const colorPicker = document.getElementById('color-picker');
const lineColorPicker = document.getElementById('line-color-picker');  // Line color picker
const inputElement = document.createElement('input');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - toolbar.offsetHeight;

let nodes = [];
let connections = [];
let undoStack = [];
let redoStack = [];
let isConnecting = false;
let selectedNodes = [];
let editingNode = null;

inputElement.style.position = 'absolute';
inputElement.style.display = 'none';
document.body.appendChild(inputElement);

inputElement.addEventListener('blur', () => {
    if (editingNode) {
        editingNode.text = inputElement.value;
        saveState();
        draw();
    }
    inputElement.style.display = 'none';
    editingNode = null;
});

canvas.addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    if (isConnecting) {
        const clickedNode = findNodeAt(x, y);
        if (clickedNode) {
            selectedNodes.push(clickedNode);
            if (selectedNodes.length === 2) {
                connections.push({ from: selectedNodes[0], to: selectedNodes[1], lineColor: lineColorPicker.value });
                saveState();
                draw();
                selectedNodes = [];
                isConnecting = false;
            }
        }
    } else {
        const clickedNode = findNodeAt(x, y);
        if (clickedNode) {
            inputElement.value = clickedNode.text;
            inputElement.style.left = `${clickedNode.x - 20}px`;
            inputElement.style.top = `${clickedNode.y - 20}px`;
            inputElement.style.display = 'block';
            inputElement.focus();
            editingNode = clickedNode;
        }
    }
});

document.getElementById('add-node').addEventListener('click', () => {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const color = colorPicker.value;
    nodes.push({ x, y, color, text: 'Node', id: Date.now() });
    saveState();
    draw();
});

document.getElementById('connect-nodes').addEventListener('click', () => {
    isConnecting = true;
    selectedNodes = [];
    alert('Click two nodes to connect them!');
});

document.getElementById('undo').addEventListener('click', () => {
    if (undoStack.length > 0) {
        redoStack.push({ nodes: [...nodes], connections: [...connections] });
        const state = undoStack.pop();
        nodes = state.nodes;
        connections = state.connections;
        draw();
    }
});

document.getElementById('redo').addEventListener('click', () => {
    if (redoStack.length > 0) {
        undoStack.push({ nodes: [...nodes], connections: [...connections] });
        const state = redoStack.pop();
        nodes = state.nodes;
        connections = state.connections;
        draw();
    }
});

function findNodeAt(x, y) {
    return nodes.find(node => Math.hypot(node.x - x, node.y - y) < 20);
}

function saveState() {
    undoStack.push({ nodes: [...nodes], connections: [...connections] });
    redoStack = [];
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = conn.lineColor || '#000';  // Use the line color selected
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    nodes.forEach(node => {
        const nodeWidth = ctx.measureText(node.text).width + 20;
        const nodeHeight = 40;

        ctx.fillStyle = node.color;
        ctx.fillRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(node.x - nodeWidth / 2, node.y - nodeHeight / 2, nodeWidth, nodeHeight);

        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(node.text, node.x, node.y + 5);
    });
}

let draggingNode = null;
canvas.addEventListener('mousedown', (e) => {
    const node = findNodeAt(e.offsetX, e.offsetY);
    if (node) draggingNode = node;
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingNode) {
        draggingNode.x = e.offsetX;
        draggingNode.y = e.offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggingNode) saveState();
    draggingNode = null;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - toolbar.offsetHeight;
    draw();
});

saveState();
draw();

let selectedNodeForDeletion = null;

document.getElementById('delete-node').addEventListener('click', () => {
    if (selectedNodeForDeletion) {
        nodes = nodes.filter(node => node !== selectedNodeForDeletion);
        connections = connections.filter(conn => conn.from !== selectedNodeForDeletion && conn.to !== selectedNodeForDeletion);
        saveState();
        draw();
        selectedNodeForDeletion = null;
    } else {
        alert('No node selected for deletion!');
    }
});

canvas.addEventListener('click', (e) => {
    const x = e.offsetX;
    const y = e.offsetY;

    const clickedNode = findNodeAt(x, y);
    if (clickedNode) {
        selectedNodeForDeletion = clickedNode;

        inputElement.value = clickedNode.text;
        inputElement.style.left = `${clickedNode.x - 20}px`;
        inputElement.style.top = `${clickedNode.y - 20}px`;
        inputElement.style.display = 'block';
        inputElement.focus();
        editingNode = clickedNode;
    } else {
        selectedNodeForDeletion = null;
    }
});
