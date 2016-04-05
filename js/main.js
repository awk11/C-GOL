"use strict";

var app = app || {};

window.onload = function() {
	console.log("window loaded");
	app.main.init();
};


app.main = {
	canvas: undefined,
	ctx: undefined,
	cells: undefined,
	
	init: function() {
		app.main.canvas = document.getElementById("gameWindow");
		app.main.canvas.width = Math.round(window.innerWidth*.75);
		app.main.canvas.height = Math.round(window.innerHeight*.8);
		app.main.ctx = app.main.canvas.getContext('2d');
		app.main.cells = [];
		for(var i = 0; i < app.main.canvas.width/5; i++)
		{
			app.main.cells.push([]);
			for(var j = 0; j < app.main.canvas.height/5; j++)
				app.main.cells[i].push(new app.Cell(i, j));
		}
		console.log(Math.round(window.innerWidth*.75));
		console.log(Math.round(window.innerHeight*.9));
		app.main.update();
		setInterval(app.main.update, 100);
	},
	
	update: function() {
			for(var i = 0; i < app.main.canvas.width/5; i++)
			{
				for(var j = 0; j < app.main.canvas.height/5; j++)
					app.main.cells[i][j].draw(app.main.ctx);
			}
			
			app.main.cycleCells();
	},
	
	cycleCells: function() {
		for(var i = 0; i < app.main.cells.length; i++)
		{
			for (var j = 0; j < app.main.cells[0].length; j++)
			{
				var cellNeighbors  = [];
				if(i != 0 && j != 0)
					cellNeighbors.push(app.main.cells[i-1][j-1]);
				if(i != 0)
					cellNeighbors.push(app.main.cells[i-1][j]);
				if(i != 0 && j != Math.round(app.main.canvas.height/5)-1)
					cellNeighbors.push(app.main.cells[i-1][j+1]);
				if(j != 0)
					cellNeighbors.push(app.main.cells[i][j-1]);
				if(j != Math.round(app.main.canvas.height/5)-1)
					cellNeighbors.push(app.main.cells[i][j+1]);
				if(i != Math.round(app.main.canvas.width/5)-1 && j != 0)
					cellNeighbors.push(app.main.cells[i+1][j-1]);
				if(i != Math.round(app.main.canvas.width/5)-1)
					cellNeighbors.push(app.main.cells[i+1][j]);
				if(i != Math.round(app.main.canvas.width/5)-1 && j != Math.round(app.main.canvas.height/5)-1)
					cellNeighbors.push(app.main.cells[i+1][j+1]);
					
				app.main.cells[i][j].checkNeighbors(cellNeighbors);
			}
		}
		
		for(var i = 0; i < app.main.cells.length; i++)
		{
			for (var j = 0; j < app.main.cells[0].length; j++)
			{
				app.main.cells[i][j].isAlive = app.main.cells[i][j].willBeAlive;
			}
		}
	}
};