var app = app || {};

app.Cell = function() {
	
	
	function Cell(XIndex, YIndex){
		this.x = XIndex;
		this.y = YIndex;
		this.isAlive = Math.floor(Math.random() * 2);
		this.willBeAlive = this.isAlive;
	};
	
	var c = Cell.prototype;
	
	c.draw = function(ctx) {
		ctx.save();
		if(this.isAlive == 0)
			ctx.fillStyle = "white";
		else
			ctx.fillStyle = "black";
		
		ctx.fillRect((this.x*5), (this.y*5), 5, 5);
		ctx.restore();
	}
	
	c.checkNeighbors = function(neighbors, n1, n2, n3)
	{
		var numAlive = 0;
		var numDead = 0;
		//console.log("Current Cell: " + this.x + ", " + this.y);
		for(var i = 0; i < neighbors.length; i++)
		{
			//console.log("Neighbor " + i + ": " + neighbors[i].x + ", " + neighbors[i].y);
			if(neighbors[i].isAlive == 0)
				numDead++;
			else
				numAlive++
		}
		
		if(this.isAlive == 1)
		{
			if(numAlive < n1 || numAlive > n2)
				this.willBeAlive = 0;
		}
		else
		{
			if(numAlive == n3)
				this.willBeAlive = 1;
		}
		
	}
	
	return Cell;
}();