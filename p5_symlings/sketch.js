const backgrounds = new Presets(['id', 'color', 'alpha'])

backgrounds.loadPresets(
	[
		{ 'id': 1, 'color': 0, 'alpha': 0 },
		{ 'id': 2, 'color': 0, 'alpha': 1 },
		{ 'id': 3, 'color': 0, 'alpha': 3 },
		{ 'id': 4, 'color': 0, 'alpha': 5 },
		{ 'id': 5, 'color': 0, 'alpha': 25 },
		{ 'id': 6, 'color': 0, 'alpha': 50 },
		{ 'id': 7, 'color': 0, 'alpha': 75 },
		{ 'id': 8, 'color': 0, 'alpha': 150 },
		{ 'id': 9, 'color': 0, 'alpha': 255 }	
	]
)

const parameters  = new Presets(['id', 'population', 'food_count'])

parameters.loadPresets(
	[
		{ 'id': 1, 'population': 1, 'food_count': 100 },
		{ 'id': 2, 'population': 5, 'food_count': 100 },
		{ 'id': 3, 'population': 25, 'food_count': 100 },
		{ 'id': 4, 'population': 75, 'food_count': 100 },
		{ 'id': 5, 'population': 100, 'food_count': 100 },
		{ 'id': 6, 'population': 100, 'food_count': 250 },
		{ 'id': 7, 'population': 250, 'food_count': 100 },
		{ 'id': 8, 'population': 2, 'food_count': 300 },
		{ 'id': 9, 'population': 10, 'food_count': 25 }
	]
)

let pool
function setup() {
	// createCanvas(windowWidth / 2, windowHeight / 2);
	createCanvas(windowWidth / 1.5, windowHeight / 1.5);
	background(0);
	pixelDensity(displayDensity());
	noCursor();
	rectMode(CENTER)
	ellipseMode(CENTER)
	colorMode(RGB)

	let state = parameters.selectPreset(3);
	pool = new SymlingPool(state.population, state.food_count);
	pool.wrapSymlings(true)
}

function draw() {
	extern('white')
	pool.update()
	pool.show()
}

function extern(strclr) {
	let bkg = backgrounds.selectPreset(9)
	background(bkg.color, bkg.alpha)
	push()
	stroke(strclr)
	noFill()
	rect(width / 2, height / 2, width - 2, height - 2)
	pop()
}

function sigmoid(t){
	return 1 / (1 + Math.pow(Math.E, -t))
}

// https://editor.p5js.org/slow_izzm/sketches/Kq7GfV545
function gradientLine(start, end, segments, c1, c2) {
	let prev_loc = {
		x: start.x,
		y: start.y
	};

	for (let i = 1; i <= segments; i++) {
		let cur_loc = {
			x: lerp(start.x, end.x, i / segments),
			y: lerp(start.y, end.y, i / segments)
		}
		push();
		stroke(lerpColor(c1, c2, (i / segments)), 0, 100);
		line(prev_loc.x, prev_loc.y, cur_loc.x, cur_loc.y);
		// point(prev_loc.x, prev_loc.y);point(cur_loc.x, cur_loc.y);
		pop();
		prev_loc.x = cur_loc.x;
		prev_loc.y = cur_loc.y;
	}
}