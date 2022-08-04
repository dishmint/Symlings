class Food {
	constructor() {
		this.pos = createVector(random(width), random(height))
		this.val = this.genVal()
		this.goodfood = color(0, 255, 0)
		this.badfood = color(255, 0, 0)
	}

	genVal() {
		const val = (random() < .65) ? (random(10) + 1) : (random(10) + 1) * -1
		if (val == 0) {
			this.genVal()
		}
		// return (val / 10.)
		return (val)
	}

	show() {
		// push()
		// // let foodcolor = lerpColor(this.badfood, this.goodfood, ((this.val + 1.) / 2.))._array.slice(0, 3).map((x) => { return 255. * x })
		// let foodcolor = lerpColor(this.badfood, this.goodfood, ((this.val + 10.) / 20.))._array.slice(0, 3).map((x) => { return 255. * x })
		// stroke(foodcolor)
		// fill(foodcolor.concat(50))
		// // ellipse(this.pos.x, this.pos.y, abs(this.val + 1.), abs(this.val + 1.))
		// ellipse(this.pos.x, this.pos.y, abs(this.val + 10.), abs(this.val + 10.))
		// pop()
	}

}
