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
	
	c.checkNeighbors = function(neighbors)
	{
		var numAlive = 0;
		var numDead = 0;
		
		for(var i = 0; i < neighbors.length; i++)
		{
			if(neighbors[i].isAlive == 0)
				numDead++;
			else
				numAlive++
		}
		
		if(this.isAlive == 1)
		{
			if(numAlive < 2 || numAlive > 3)
				this.willBeAlive = 0;
		}
		else
		{
			if(numAlive == 3)
				this.willBeAlive = 1;
		}
		
	}
	
	return Cell;
}();