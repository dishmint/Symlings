const params = {
	color: {r: 0, g: 0, b: 0},
	alpha: 255,
	population: 25,
	foodcount: 100,
	spoilRate: .0001,
	seeFood: false,
	seeAgent: true,
	seeViz: false,
	linkRes: 10,
	seeHealth: false,
	seeCommsLink: false,
	pulseRate: 5,
	seeFriends: true,
	symPoint: true,
	symTail: true
}

const createPane = () => {
	const sketchpane = new Tweakpane.Pane();
	// TODO: #7 consider destructuring the folder items so they can be const'd. I don't want loose variables hanging around.

	const sketchfolder = sketchpane.addFolder({title: 'Sketch Settings', expanded: false})
	sketchfolder.addInput(params, 'color', {view:'color'})
	sketchfolder.addInput(params, 'alpha', {min: 0, max: 255, step: 1})

	const symlingpoolfolder = sketchpane.addFolder({title: 'SymlingPool Settings', expanded: false})
	symlingpoolfolder.addInput(params, 'population', {min: 2, max: 300, step: 1}).on('change', (ev) => {
		pool.setPopulation(ev.value)
	})
	symlingpoolfolder.addInput(params, 'foodcount',  {min: 1, max: 300, step: 1}).on('change', (ev) => {
		pool.setFoodCount(ev.value)
	})
	symlingpoolfolder.addInput(params, 'seeFood')
	symlingpoolfolder.addInput(params, 'spoilRate', {min: 0.0001, max: 0.01})

	const symlingfolder = sketchpane.addFolder({title: 'Symling Settings'})
	const symlingAppearance = symlingfolder.addFolder({title: 'Symling Appearance', expanded: false})
	symlingAppearance.addInput(params, 'seeAgent', {label:'visible'}).on('change', (ev) => {
		symPoint.disabled = !ev.value ? true : false
		symTail.disabled  = !ev.value ? true : false
	})
	symlingAppearance.addInput(params, 'symPoint', {disabled: false})
	symlingAppearance.addInput(params, 'symTail', {disabled: false})

	const symlingProperties = symlingfolder.addFolder({title: 'Symling Properties'})
	symlingProperties.addInput(params, 'seeViz', {label:'vField'})
	symlingProperties.addInput(params, 'seeFriends', {label:'sLink'})
	symlingProperties.addInput(params, 'linkRes', {min: 1, max: 130, step: 1})
	symlingProperties.addSeparator()
	symlingProperties.addInput(params, 'seeHealth', {label: 'hMarker'})
	const seeCommsLink = symlingProperties.addInput(params, 'seeCommsLink', {label: 'cLink'})
	const pulseRate    = symlingProperties.addInput(params, 'pulseRate', {min: 1, max:50, disabled: true}).on('change', (ev) => {
		pool.pulseRate = ev.value
	})

	seeCommsLink.on('change', () => {
		pulseRate.disabled = !pulseRate.disabled
	})
}

let pool
function setup() {
	const w = windowWidth * .75
	const h = windowHeight * .75
	createCanvas(w, h);
	background(0);
	pixelDensity(displayDensity());
	noCursor();
	rectMode(CENTER)
	ellipseMode(CENTER)
	colorMode(RGB)

	createPane()

	pool = new SymlingPool(params.population, params.foodcount);
	pool.wrapSymlings(true)
}

function draw() {
	extern('white')	
	pool.update()
	pool.show()
}

function extern(strclr) {
	background(params.color.r, params.color.g, params.color.b, params.alpha)
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