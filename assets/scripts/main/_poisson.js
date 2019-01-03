(function(window, $) {

	if (!$('#poisson')[0]) return;
	

	var sketch = function( p ) {

	  var settings = {
	  	r: 13,
	  	k: 30,
	  	DOT_SIZE: 1,
	  	DOT_LIMIT: 800000
	  };
	  var NUM_POISSON = 2;
	  var poissons = [];

	  var w = settings.r / Math.sqrt(2);


	  var dotsPerDraw = 6;

	  p.setup = function() {
	  	var canvas = p.createCanvas(p.windowWidth, p.windowHeight);
	  	canvas.parent("poisson");
	  	p.background(0,0,0);
	  	p.strokeWeight(4);

	  	for (var i = 0; i < NUM_POISSON; i++) {
	  		var pos = makePoisson(settings);
	  		poissons.push(pos);
	  	}
	  	p.frameRate(10);
	  };

	  p.draw = function() {
	    p.background(0,0,0);

	    for (var b = 0; b < poissons.length; b++) {

	    	var dotDrawSlopeDown = p.floor((poissons[b].dotCount/poissons[b].DOT_LIMIT)*10);

	    	if (dotsPerDraw-dotDrawSlopeDown < 0) {
	    		p.noLoop();
	    	}
	    	for (var total = 0; total < dotsPerDraw-dotDrawSlopeDown; total++) {
	    		if (poissons[b].active.length > 0 && poissons[b].dotCount < poissons[b].DOT_LIMIT){
	    			var randIndex = p.floor(p.random(poissons[b].active.length));
	    			var pos = poissons[b].active[randIndex];
	    			var found = false;
	    			for (var n = 0; n < poissons[b].k; n++) {
	    				var sample = p5.Vector.random2D();

	    				var m = p.random(poissons[b].r, 2*poissons[b].r);
	    				sample.setMag(m);
	    				sample.add(pos);

	    				var col = p.floor(sample.x / w);
	    				var row = p.floor(sample.y / w);

	    				if (col > -1 && row > -1 && col < poissons[b].cols && row < poissons[b].rows && !poissons[b].grid[col+row * poissons[b].cols]) {
	    					var ok = true;
	    					for (var i = -1; i <= 1; i++) {
	    						for (var j = -1; j <= 1; j++) {
	    							var index = (col+i) + (row+j) * poissons[b].cols;
	    							var neighbor = poissons[b].grid[index];
	    							if (neighbor) {
	    								var d = p5.Vector.dist(sample, neighbor);
	    								if (d < poissons[b].r) {
	    									ok = false;
	    								}
	    							}
	    						}
	    					}

	    					if (ok) {
	    						found = true;
	    						poissons[b].grid[col+row * poissons[b].cols] = sample;
	    						poissons[b].active.push(sample);
	    					}
	    				}
	    			}
	    			if (!found) {
	    				// console.log('splice');
	    				poissons[b].active.splice(randIndex,1);
	    			}
	    		}
	    	}

	    	//inside dots
	    	for (var q = 0; q < poissons[b].grid.length; q++) {
	    		if (poissons[b].grid[q]) {
	    			p.stroke(255, 126, 0);
	    			p.strokeWeight(poissons[b].DOT_SIZE);
	    			p.point(poissons[b].grid[q].x, poissons[b].grid[q].y);
	    			poissons[b].dotCount++;

	    		}
	    	}

	    	//outside dots
	    	for (var l = 0; l < poissons[b].active.length; l++) {
	    		p.stroke(255,255,255);
	    		p.strokeWeight(poissons[b].DOT_SIZE);
	    		p.point(poissons[b].active[l].x, poissons[b].active[l].y);
	    		poissons[b].dotCount++;
	    	}
	    }


	  };
	  function makePoisson(settings){
	  	var poisson = {};

	  	poisson.grid = [];
	  	poisson.active = [];
	  	poisson.r = settings.r;
	  	poisson.k = settings.k;
	  	poisson.DOT_LIMIT = settings.DOT_LIMIT;
	  	poisson.DOT_SIZE = settings.DOT_SIZE;
	  	poisson.dotCount = 0;

	  	poisson.cols = p.floor(p.width/w);
	  	poisson.rows = p.floor(p.height/w);

	  	for (var i = 0; i < poisson.cols * poisson.rows; i++) {
	  		poisson.grid[i] = undefined;
	  	}

	  	var x = p.random(p.width);
	  	var y = p.random(p.height);
	  	// var x = width/2;
	  	// var y = height/2;
	  	var h = p.floor(x/w);
	  	var j = p.floor(y/w);
	  	var pos = p.createVector(x,y);

	  	poisson.grid[h+j * poisson.cols] = pos;

	  	poisson.active.push(pos);

	  	return poisson;
	  }
	};

	var myp5 = new p5(sketch);

})(window, jQuery);