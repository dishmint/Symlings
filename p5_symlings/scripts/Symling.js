class Symling {
    constructor(wrapQ, id, commsChannel) {
        // SPATIAL PROPERTIES
        this.pos = createVector(random(width), random(height))
        this.previous = createVector(this.pos.x,this.pos.y)
        this.stuck = 0.8
        this.wrapQ = wrapQ
        this.vel = createVector()
        this.acc = createVector()
        this.cruisingSpeed = random(.25)
        this.vscale = width * 0.05
        this.visualField = floor((random(this.vscale) + this.vscale) / 2)
        this.bodysize = ceil(width * .02)

        // EXPERIENTIAL PROPERTIES
		this.percepts = []
		// this.commsChannel = floor(random(Number.MAX_SAFE_INTEGER))
		this.commsChannel = commsChannel
		this.identifier = id
		this.health = 1

		this.healthy = color(255, 255, 255)
		this.sickly = color(0, 0, 255)

		// MEMORY PROPERTIES
		this.historySize = floor(random(9) + 1)
		this.history = new Array(this.historySize)
		this.memorySize = floor(random(9) + 1)
		this.memory = new Array(this.memorySize)

		// AESTHETIC PROPERTIES
		this.clr = [random(255), random(255), 0]
		this.aura = color(random(255), random(255), random(255))
		// this.aura = color(255, 255, 255)
    }

    initMessage(spaceComms) {
		// find channel
		// — if not there add channe; to spaceComms
		let found = Object.entries(spaceComms).find(
			(comms) => {
				return (comms.channel === `channel${this.commsChannel}`)
			}
		)

		if (found) {
			found.push({ id: this.identifier, message: "Salutations!" })
		} else {
			let firstComm = { id: this.identifier, message: "Salutations!!" }
			let ch = `channel${this.commsChannel}`
			spaceComms[ch] = firstComm
		}

		// TODO: If beings are on the same channel, draw moving dashed lines between them with the same stroke color as the objects themselves

	}

    restrict(poolConditions) {
		let others = poolConditions.symlings.concat(poolConditions.objects, poolConditions.food)
		// console.log('OTHERS', others);
		let percepts = {
			sight: (() => {
				let thingsISee = others.filter(
					thingToSee =>
						(dist(this.pos.x, this.pos.y, thingToSee.pos.x, thingToSee.pos.y) < (this.visualField / 2)) && !Object.is(this, thingToSee)
				)
				return thingsISee
			})()
		}
		return percepts
	}

    update(input) {
		this.health -= 0.0001
		this.percepts = this.restrict(input)
		this.makeDecision(this.percepts, input)
	}

    makeDecision(perceivedSurroundings, input) {
		// MOVE ?
		this.move(perceivedSurroundings.sight, input)
		this.seeFriends(perceivedSurroundings.sight)
		// CHANGE ENV => ['Change Environment', <env_change>]
	}

    move(thingsPerceived, inSignal) {
		this.stuck = 0
		// EAT ?
		//  if instance of food pass through to eat function
		const foodInSight = thingsPerceived.filter(item => item instanceof Food);
        
		if (foodInSight.length > 0) {
            let foodDistance = []
			foodInSight.forEach(snack => {
                 foodDistance.push({'foodItem': snack, 'distance': dist(this.pos.x, this.pos.y, snack.pos.x, snack.pos.y)})
            })

            let distances = []
            foodDistance.forEach(snack => {distances.push(snack.distance)})
            
			// 1 — get closest food
			const closestSnacks = foodDistance.filter(snack => (snack.distance <= min(distances)))
			// 2 — select closest food
			const foodOfInterest = random(closestSnacks).foodItem

            // console.log(foodOfInterest)
			// MOVE TOWARDS FOOD
			this.pos.x -= (this.pos.x - foodOfInterest.pos.x) / abs(foodOfInterest.val)
			this.pos.y -= (this.pos.y - foodOfInterest.pos.y) / abs(foodOfInterest.val)

			this.stuck = 0

			this.history.push(['Changed Position', this.pos])
			// 4 — On arrival, eat
			if ((dist(this.pos.x, this.pos.y, foodOfInterest.pos.x, foodOfInterest.pos.y) < .0001)) {
				this.eat(foodInSight, inSignal.food)
				inSignal.food.push(new Food())

			}

            if(this.wrapQ){
                this.wrap()
            } else {
                this.bounce()
            }
		} else {
			// IDLE MOVEMENT
			this.acc.x += random([-0.1, 0.1])
			this.acc.y += random([-0.1, 0.1])
			// this.vel = createVector(random(-width, width), random(-height, height)).normalize()
			this.vel = createVector(random(-1, 1), random(-1, 1))
			// this.vel = createVector(random(-.5, .5), random(-.5, .5))
			// this.vel.mult(createVector(random(-.5, .5), random(-.5, .5)))
			this.vel.add(this.acc)
			this.pos.add(this.vel)

            if(this.wrapQ){
                this.wrap()
            } else {
                this.bounce()
            }
		}
        // worm scrunch
		if (frameCount % 5 == 0) {
			this.previous.x = this.pos.x
			this.previous.y = this.pos.y
		}

        if(this.wrapQ){
            this.wrap()
        } else {
            this.bounce()
        }

		this.vel.mult(this.health)
		// this.acc.mult(.75)
        let accel = constrain(this.health, -1, 1);
		this.acc.mult(accel)
	}

    wrap(){
        if (this.pos.x > width) {
            // if (this.pos.x > (width - this.visualField/2) + 1) {
            this.pos.x = (this.visualField / 2) + 1
            this.previous.x = this.pos.x
        }
        if (this.pos.x < 0) {
            // if (this.pos.x < (this.visualField/2) + 1) {
            this.pos.x = (width - this.visualField / 2) + 1
            this.previous.x = this.pos.x
        }
        if (this.pos.y > height) {
            // if (this.pos.y > (height - (this.visualField/2) + 1)) {
            this.pos.y = (this.visualField / 2) + 1
            this.previous.y = this.pos.y
        }
        if (this.pos.y < 0) {
            // if (this.pos.y < (this.visualField/2) + 1) {
            this.pos.y = (height - (this.visualField / 2) + 1)
            this.previous.y = this.pos.y
        }
    }

    bounce(){
        // if(this.pos.x < 0 || this.pos.x > width) {
        //     // this.pos.x = width/2
        //     this.vel.x = this.vel.x * -1;
        // }
        // if(this.pos.y < 0 || this.pos.y > height) {
        //     // this.pos.y = height/2
        //     this.vel.y = this.vel.y * -1;
        // }

        if(this.pos.x < 0) {
            this.vel.x *= -1;
            this.pos.x = this.bodysize
        }

        if(this.pos.x > width) {
            this.vel.x *= -1;
            this.pos.x = width - this.bodysize
        }

        if(this.pos.y < 0) {
            this.vel.y *= -1;
            this.pos.y = this.bodysize
        }

        if(this.pos.y > height) {
            this.vel.y *= -1;
            this.pos.y = height - this.bodysize
        }
    }

    seeFriends(thingsPerceived) {
		let friendos = thingsPerceived.filter(item => item instanceof Symling && !Object.is(this, item))
		for (let buddy of friendos) {
			push()
			// gradientLine(this.pos, buddy.pos, 130, this.aura, buddy.aura)
			gradientLine(this.pos, buddy.pos, 10, this.aura, buddy.aura)

			// The following is a bit silly because the blue unhealthy agents will never have a VF big enough to draw a line.
			// let curcol = color(this.clr[0], this.clr[1], this.clr[2]);
			// let budcol = color(this.clr[0], this.clr[1], this.clr[2]);
			// gradientLine(this.pos, buddy.pos, 130, curcol, budcol)
			// stroke(255)
			// line(this.pos.x, this.pos.y, buddy.pos.x, buddy.pos.y)
			pop()

		}
	}

	eat(snacks, allFood) {
		// Change Agent properties based on what was eaten
		// console.log('FOOD',snacks);
        snacks.forEach(snack => {
            this.health += snack.val;
			this.visualField += snack.val;
			this.visualField = constrain(this.visualField, 1, width / 2);
			if (this.history.length < this.historySize) {
				this.history.push(['Ate Food', snack]);
				this.history.push(['Change Visual Field Radius', this.visualField]);
			} else {
				this.history.shift();
			}

            allFood = allFood.splice(allFood.indexOf(snack), 1)
        });
	}

	// APPEARANCE
	show() {
		// SHOW AGENT
		push()
		stroke(this.aura.levels)
		fill(this.aura.levels.concat(25))
		point(this.pos.x, this.pos.y)
		line(this.pos.x, this.pos.y, this.previous.x, this.previous.y)
		pop()

		this.clr = lerpColor(this.sickly, this.healthy, sigmoid(this.health)).levels.slice(0, 3)

		// SHOW AGENT WITH HEALTHINDICATOR
		// this.showHealthIndicator();

		// SHOW VISUAL FIELD
		// this.showVisualField()
	}

    showVisualField() {
        push()
		stroke(this.clr.concat(50))
		fill(this.clr.concat(25))
		ellipse(this.pos.x, this.pos.y, this.visualField, this.visualField)
		pop()
    }
    showHealthIndicator() {
        push()
		stroke(this.clr)
		fill(this.clr.concat(25))
		point(this.pos.x, this.pos.y)
		line(this.pos.x, this.pos.y, this.previous.x, this.previous.y)
		pop()
    }

}