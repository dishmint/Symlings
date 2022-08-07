const params = {
	color: {r: 0, g: 0, b: 0},
	alpha: 255,
	population: 25,
	foodcount: 100,
	seeFood: false,
	seeAgent: true,
	seeViz: false,
	vizGrade: 10,
	seeHealth: false,
	seeCommsLink: false,
	seeFriends: true,
	symPoint: true,
	symTail: true
}

let sketchpane, sympop, symfood, seeFood, seeAgent, seeViz, seeHealth, seeCommsLink, seeFriends, symPoint, symTail
const createPane = () => {
	sketchpane = new Tweakpane.Pane();
	// TODO: #7 consider destructuring the folder items so they can be const'd. I don't want loose variables hanging around.

	let sketchfolder = sketchpane.addFolder({title: 'Sketch Settings'})
	sketchfolder.addInput(params, 'color', {view:'color'})
	sketchfolder.addInput(params, 'alpha', {min: 0, max: 255, step: 1})

	let symlingpoolfolder = sketchpane.addFolder({title: 'SymlingPool Settings'})
	sympop  = symlingpoolfolder.addInput(params, 'population', {min: 2, max: 300, step: 1})
	symfood = symlingpoolfolder.addInput(params, 'foodcount',  {min: 1, max: 300, step: 1})
	seeFood = symlingpoolfolder.addInput(params, 'seeFood')

	let symlingfolder = sketchpane.addFolder({title: 'Symling Settings'})
	seeAgent = symlingfolder.addInput(params, 'seeAgent', {label:'visible'})
	symPoint = symlingfolder.addInput(params, 'symPoint', {disabled: false})
	symTail = symlingfolder.addInput(params, 'symTail', {disabled: false})
	seeViz = symlingfolder.addInput(params, 'seeViz', {label:'visualField'})
	vizGrade = symlingfolder.addInput(params, 'vizGrade', {min: 1, max: 130, step: 1})
	seeHealth = symlingfolder.addInput(params, 'seeHealth')
	seeCommsLink = symlingfolder.addInput(params, 'seeCommsLink')
	seeFriends = symlingfolder.addInput(params, 'seeFriends')
}

let pool
function setup() {
	// createCanvas(windowWidth / 2, windowHeight / 2);
	const hfac = 3
	const wfac = hfac * .5
	createCanvas(windowWidth / wfac, windowHeight / hfac);
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
	sympop.on('change', (ev) => {
		pool.setPopulation(ev.value)
	})
	symfood.on('change', (ev) => {
		pool.setFoodCount(ev.value)
	})
	
	seeAgent.on('change', (ev) => {
		symPoint.disabled = !ev.value ? true : false
		symTail.disabled  = !ev.value ? true : false
	})
	
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