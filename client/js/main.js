"use strict";

var app = app || {};

window.onload = function() {
	console.log("window loaded");
	app.main.init();
};

$("#simPauseButton").on("click", function(e) {
	e.preventDefault();
	
	app.main.isPaused = !app.main.isPaused;
});

$("#simPaintButton").on("click", function(e) {
	e.preventDefault();
	
	app.main.erasing = false;
});

$("#simEraseButton").on("click", function(e) {
	e.preventDefault();
	
	app.main.erasing = true;
});

$("#simClearButton").on("click", function(e) {
	e.preventDefault();
	
	for(var i = 0; i < app.main.cells.length; i++)
	{
		for (var j = 0; j < app.main.cells[0].length; j++)
		{
			app.main.cells[i][j].isAlive = 0;
			app.main.cells[i][j].willBeAlive = 0;
		}
	}
	
	app.main.isPaused = true;
});


app.main = {
	canvas: undefined,
	ctx: undefined,
	cells: undefined,
	rule1: undefined,
	rule2: undefined,
	rule3: undefined,
	intervalID: undefined,
	isPaused: false,
	painting: false,
	erasing: false,
	
	
	init: function() {
		app.main.canvas = document.getElementById("gameWindow");
		app.main.canvas.width = Math.round(window.innerWidth*.75);
		app.main.canvas.height = 750//Math.round(window.innerHeight*.8);
		app.main.canvas.onmousedown = app.main.doMouseDown;
		app.main.canvas.onmousemove = app.main.doMouseMove;
		app.main.canvas.onmouseup = app.main.doMouseUp;
		app.main.canvas.onmouseout = app.main.doMouseOut;
		app.main.ctx = app.main.canvas.getContext('2d');
		
		var data = document.getElementById('ruleData');
		app.main.rule1 = data.dataset.rule1;
		app.main.rule2 = data.dataset.rule2;
		app.main.rule3 = data.dataset.rule3;
		app.main.cells = [];
		for(var i = 0; i < Math.round(app.main.canvas.width/5); i++)
		{
			app.main.cells.push([]);
			for(var j = 0; j < Math.round(app.main.canvas.height/5); j++)
				app.main.cells[i].push(new app.Cell(i, j));
		}
		console.log(Math.round(window.innerWidth*.75));
		console.log(Math.round(window.innerHeight*.9));
		app.main.update();
		app.main.intervalID = setInterval(app.main.update, 100);
	},
	
	update: function() {
		
		for(var i = 0; i < Math.round(app.main.canvas.width/5); i++)
		{
			for(var j = 0; j < Math.round(app.main.canvas.height/5); j++)
				app.main.cells[i][j].draw(app.main.ctx);
		}
		
		if(!app.main.isPaused)
		{	
			app.main.cycleCells();
		}
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
					
				app.main.cells[i][j].checkNeighbors(cellNeighbors, app.main.rule1, app.main.rule2, app.main.rule3);
			}
		}
		
		for(var i = 0; i < app.main.cells.length; i++)
		{
			for (var j = 0; j < app.main.cells[0].length; j++)
			{
				app.main.cells[i][j].isAlive = app.main.cells[i][j].willBeAlive;
			}
		}
	},
	
	doMouseDown: function(e) {
		if(app.main.isPaused)
		{
			app.main.painting = true;
			app.main.doMouseMove(e);
		}
	},
	
	doMouseMove: function(e) {
		if(app.main.isPaused && app.main.painting)
		{
			var mouse = {};
			mouse.x = e.pageX - e.target.offsetLeft;
			mouse.y = e.pageY - e.target.offsetTop;
			
			var i = Math.round(mouse.x/5);
			var j = Math.round(mouse.y/5);
			
			if(!app.main.erasing)
			{
				app.main.cells[i][j].isAlive = 1
				app.main.cells[i][j].willBeAlive = 1
			}
			else
			{
				app.main.cells[i][j].isAlive = 0
				app.main.cells[i][j].willBeAlive = 0
			}
			
			app.main.cells[i][j].draw(app.main.ctx);
		}
	},
	
	doMouseUp: function(e) {
		app.main.painting = false;
	},
	
	doMouseOut: function(e) {
		app.main.painting = false;
	},
	
	setup1: function(){
		for(var i = 0; i < app.main.cells.length; i++)
		{
			for (var j = 0; j < app.main.cells[0].length; j++)
			{
				app.main.cells[i][j].isAlive = 0;
				app.main.cells[i][j].willBeAlive = 0;
			}
		}
		
		app.main.cells[52][43].isAlive = 1;
		app.main.cells[52][43].willBeAlive = 1;		
		
		app.main.cells[52][44].isAlive = 1;
		app.main.cells[52][44].willBeAlive = 1;	
		
		app.main.cells[53][43].isAlive = 1;
		app.main.cells[53][43].willBeAlive = 1;
		
		app.main.cells[53][44].isAlive = 1;
		app.main.cells[53][44].willBeAlive = 1;
		
		app.main.cells[62][43].isAlive = 1;
		app.main.cells[62][43].willBeAlive = 1;
		
		app.main.cells[62][44].isAlive = 1;
		app.main.cells[62][44].willBeAlive = 1;
		
		app.main.cells[62][45].isAlive = 1;
		app.main.cells[62][45].willBeAlive = 1;
		
		app.main.cells[63][42].isAlive = 1;
		app.main.cells[63][42].willBeAlive = 1;
		
		app.main.cells[63][46].isAlive = 1;
		app.main.cells[63][46].willBeAlive = 1;
		
		app.main.cells[64][41].isAlive = 1;
		app.main.cells[64][41].willBeAlive = 1;
		
		app.main.cells[64][47].isAlive = 1;
		app.main.cells[64][47].willBeAlive = 1;
		
		app.main.cells[65][41].isAlive = 1;
		app.main.cells[65][41].willBeAlive = 1;
		
		app.main.cells[65][47].isAlive = 1;
		app.main.cells[65][47].willBeAlive = 1;
		
		app.main.cells[66][44].isAlive = 1;
		app.main.cells[66][44].willBeAlive = 1;
		
		app.main.cells[67][42].isAlive = 1;
		app.main.cells[67][42].willBeAlive = 1;
		
		app.main.cells[67][46].isAlive = 1;
		app.main.cells[67][46].willBeAlive = 1;
		
		app.main.cells[68][43].isAlive = 1;
		app.main.cells[68][43].willBeAlive = 1;
		
		app.main.cells[68][44].isAlive = 1;
		app.main.cells[68][44].willBeAlive = 1;
		
		app.main.cells[68][45].isAlive = 1;
		app.main.cells[68][45].willBeAlive = 1;
		
		app.main.cells[69][44].isAlive = 1;
		app.main.cells[69][44].willBeAlive = 1;
		
		app.main.cells[72][41].isAlive = 1;
		app.main.cells[72][41].willBeAlive = 1;
		
		app.main.cells[72][42].isAlive = 1;
		app.main.cells[72][42].willBeAlive = 1;
		
		app.main.cells[72][43].isAlive = 1;
		app.main.cells[72][43].willBeAlive = 1;
		
		app.main.cells[73][41].isAlive = 1;
		app.main.cells[73][41].willBeAlive = 1;
		
		app.main.cells[73][42].isAlive = 1;
		app.main.cells[73][42].willBeAlive = 1;
		
		app.main.cells[73][43].isAlive = 1;
		app.main.cells[73][43].willBeAlive = 1;
		
		app.main.cells[74][40].isAlive = 1;
		app.main.cells[74][40].willBeAlive = 1;
		
		app.main.cells[74][44].isAlive = 1;
		app.main.cells[74][44].willBeAlive = 1;
		
		app.main.cells[76][39].isAlive = 1;
		app.main.cells[76][39].willBeAlive = 1;
		
		app.main.cells[76][40].isAlive = 1;
		app.main.cells[76][40].willBeAlive = 1;
		
		app.main.cells[76][44].isAlive = 1;
		app.main.cells[76][44].willBeAlive = 1;
		
		app.main.cells[76][45].isAlive = 1;
		app.main.cells[76][45].willBeAlive = 1;
		
		app.main.cells[86][41].isAlive = 1;
		app.main.cells[86][41].willBeAlive = 1;
		
		app.main.cells[86][42].isAlive = 1;
		app.main.cells[86][42].willBeAlive = 1;
		
		app.main.cells[87][42].isAlive = 1;
		app.main.cells[87][42].willBeAlive = 1;
		
		app.main.cells[87][41].isAlive = 1;
		app.main.cells[87][41].willBeAlive = 1;
		
		app.main.cells[159][132].isAlive = 1;
		app.main.cells[159][132].willBeAlive = 1;
		
		app.main.cells[159][133].isAlive = 1;
		app.main.cells[159][133].willBeAlive = 1;
		
		app.main.cells[160][132].isAlive = 1;
		app.main.cells[160][132].willBeAlive = 1;
		
		app.main.cells[161][133].isAlive = 1;
		app.main.cells[161][133].willBeAlive = 1;
		
		app.main.cells[161][134].isAlive = 1;
		app.main.cells[161][134].willBeAlive = 1;
		
		app.main.cells[161][135].isAlive = 1;
		app.main.cells[161][135].willBeAlive = 1;
		
		app.main.cells[162][135].isAlive = 1;
		app.main.cells[162][135].willBeAlive = 1;
	},
	
	
	printOut: function() {
		for(var i = 0; i < app.main.cells.length; i++)
		{
			for (var j = 0; j < app.main.cells[0].length; j++)
			{
				if(app.main.cells[i][j].isAlive)
					console.log("i= " + i + ", j= " + j);
			}
		}
	}
	
};