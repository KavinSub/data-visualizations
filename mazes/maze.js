var squareSide = 20;
var columns = 20;
var rows = 20;
var canvasWidth = columns * squareSide;
var canvasHeight = rows * squareSide;

var edges = [];
var vertices = [];
var removedVertices = [];

var fr = 50;
var frameCount = 1;
var disappearRate = 5; // Number of frames to pass before disappearing.

function setup(){
	generateEdges();
	shuffleArray(edges);
	generateVertices();
	generateMaze();

	createCanvas(canvasWidth, canvasHeight);
	frameRate(fr);
}


function draw(){
	background(255);
	drawEdges();
	drawWalls();
	drawVertices();
}

// Undirected edge:
// v1: (x1, y1)
// v2: (x2, y2)
function generateEdges(){
	for(var i = 0; i < columns - 1; i++){
		for(var j = 0; j < rows; j++){
			var edge = {
				v1: [i, j],
				v2: [i + 1, j]
			}
			edges.push(edge);
		}
	}

	for(var i = 0; i < columns; i++){
		for(var j = 0; j < rows - 1; j++){
			var edge = {
				v1: [i, j],
				v2: [i, j + 1]
			}
			edges.push(edge);
		}
	}
}

// Vertex
// parent: vertex
// rank: integer
// c: (x, y)
// Position in array = columns * y + x
function generateVertices(){
	for(var i = 0; i < columns; i++){
		for(var j = 0; j < rows; j++){
			var vertex = {
				rank: 0,
				c: [i, j],
				drawn: true
			}
			vertex.parent = vertex;
			vertices.push(vertex);
		}
	}
}

// Merges two sets together
// Returns false, if x, y are in the same set already
function union(x, y){
	var xRoot = find(x);
	var yRoot = find(y);

	// If x, y are already in the same set
	if(xRoot == yRoot){
		return false;
	}
	var dx = Math.abs(x.c[0] - y.c[0]);
	if(x.drawn == true){
		if(dx == 1) x.delta = 0;
		else x.delta = 1;
		removedVertices.push(x);
	}
	if(y.drawn == true){
		if(dx == 1) y.delta = 0;
		else y.delta = 1;
		removedVertices.push(y);
	}
	x.drawn = false;
	y.drawn = false;
	if(xRoot.rank < yRoot.rank){
		xRoot.parent = yRoot;
	}else if(yRoot.rank < xRoot.rank){
		yRoot.parent = xRoot;
	}else{
		yRoot.parent = xRoot;
		xRoot.rank += 1;
	}
	return true;
}

// Given a vertex x, finds the root of x's tree
function find(x){
	var xRoot = x;
	while(xRoot.parent != xRoot){
		xRoot = xRoot.parent;
	}
	return xRoot;
}

function generateMaze(){
	for(var i = 0; i < edges.length; i++){
		removeEdge(i);
	}
}

// Removes an edge between two distinct vertices
function removeEdge(index){
	var edge = edges[index];
	var x = getVertex(edge.v1[0], edge.v1[1]);
	var y = getVertex(edge.v2[0], edge.v2[1]);
	var removed = union(x, y);
	if(removed) edges[index] = null;
}

// Returns the vertex at column c, row r
function getVertex(c, r){
	return vertices[rows*c + r];
}

function drawVertices(){
	fill(0);
	if(frameCount % disappearRate == 0) removedVertices.shift();
	if(removedVertices.length > 0){
		for(var i = 0; i < removedVertices.length; i++){
			var vertex = removedVertices[i];
			if(i > 0){
				rect(vertex.c[0] * squareSide, vertex.c[1] * squareSide, squareSide, squareSide);
			}else{
				var newSize = Math.floor(squareSide - squareSide*((frameCount % disappearRate)/disappearRate))
				if(vertex.delta == 0) rect(vertex.c[0] * squareSide, vertex.c[1] * squareSide, newSize, squareSide);
				else rect(vertex.c[0] * squareSide, vertex.c[1] * squareSide, squareSide, newSize);
			}
		}
		frameCount += 1;
	}
}

// Shuffles an array a
function shuffleArray(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function drawWalls(){
	stroke(0, 0, 0);

	// Draw Horizontal Lines
	for(var i = 0; i < columns; i++){
		line(i * squareSide, 0, (i + 1)*squareSide, 0);
		line(i * squareSide, canvasHeight - 1, (i + 1)*squareSide, canvasHeight - 1);
	}

	// Draw Vertical Lines
	for(var i = 0; i < rows; i++){
		line(0, i * squareSide, 0, (i + 1)*squareSide);
		line(canvasWidth - 1, i * squareSide, canvasWidth - 1, (i + 1)*squareSide);
	}
}

function drawEdges(){
	for(var i = 0; i < edges.length; i++){
		if(edges[i] != null) drawEdge(edges[i]);
	}
}

function drawEdge(edge){
	var dx = edge.v2[0] - edge.v1[0];
	var x1, y1, x2, y2;

	if(dx == 1){ // If edge connects two vertices horizontally
		x1 = (edge.v1[0] + 1) * squareSide;
		y1 = (edge.v1[1]) * squareSide;
		x2 = x1;
		y2 = y1 + squareSide;
	}else{ // If edge connects two vertices vertically
		x1 = (edge.v1[0]) * squareSide;
		y1 = (edge.v1[1] + 1) * squareSide;
		x2 = x1 + squareSide;
		y2 = y1;
	} 
	stroke(0, 0, 0);
	line(x1, y1, x2, y2);
}