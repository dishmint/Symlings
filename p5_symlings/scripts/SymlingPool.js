function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    // return `hsl(${hue},50,75)`;
    return color(hue, 50, 75, 100);
    // return color(hue,50,75, 200);
}


class SymlingPool {
    constructor(symlingcount, foodcount) {
        this.symlingcount = symlingcount;
        this.foodcount = foodcount;
        this.conditions = {
            symlings: [],
            objects: [],
            food: [],
            spread: {}
        }
        this.salutations()
        this.boundary = {
            center: createVector(width / 2, height / 2),
            w: width,
            h: height
        }

        this.channelColors = []
        this.introduceSymlings(this.symlingcount)
        this.introduceFood(this.foodcount)

        this.pulseRate = 2
    }

    setPopulation(newpopulation) {
        // If population is greater than symlingcount then add the difference, otherwise remove symlings
        if (this.symlingcount > newpopulation) {
            this.conditions.symlings = this.conditions.symlings.slice(0, newpopulation - 1)
            this.symlingcount = newpopulation
        } else {
            const newsize = newpopulation - this.conditions.symlings.length
            this.introduceSymlings(newsize)
        }
    }

    introduceSymlings(count) {
        for (let i = 0; i < count; i++) {
            const comms = random([...Array(count).keys()])
            this.conditions.symlings.push(new Symling(true, i, comms))
            const channel = this.conditions.symlings[i].commsChannel
            const clr = selectColor(channel)
            this.channelColors.push(clr)
        }
    }

    setFoodCount(newfood) {
        // If newfood is greater than foodcount then add the difference, otherwise remove food
        if (this.foodcount > newfood) {
            this.conditions.food = this.conditions.food.slice(0, newfood - 1)
            this.foodcount = newfood
        } else {
            const newsize = newfood - this.conditions.food.length
            this.introduceFood(newsize)
        }
    }

    introduceFood(foodcount) {
        for (let i = 0; i < foodcount; i++) {
            this.conditions.food.push(new Food())
        }
    }

    wrapSymlings(wrapQ) {
        this.conditions.symlings.forEach((symling) => {
            symling.wrapQ = wrapQ
        })
    }

    salutations() {
        this.conditions.symlings.forEach((symling) => {
            symling.initMessage(this.conditions.spread);
        })
    }

    update() {
        this.conditions.food.forEach((food) => {
            food.update();
        })

        const allBadFood = this.conditions.food.every(snack => snack.val < 0)

        if (allBadFood) this.introduceFood(this.foodcount);

        this.conditions.symlings.forEach((symling) => {
            symling.update(this.conditions);
        })

    }

    show() {

        this.conditions.symlings.forEach((symling) => {
            symling.show()
        })

        // comms link

        for (let i = 0; i < this.conditions.symlings.length; i++) {
            const symlingA = this.conditions.symlings[i];
            // console.log(symlingA, 'symlingA')
            for (let j = i + 1; j < this.conditions.symlings.length; j++) {
                const symlingB = this.conditions.symlings[j]
                // console.log(symlingB, 'symlingB')
                if (symlingA.commsChannel === symlingB.commsChannel) {
                    symlingA.pos.x -= ((symlingA.pos.x - symlingB.pos.x) / (10000. * (1 / symlingA.commsChannel)))
                    symlingA.pos.y -= ((symlingA.pos.y - symlingB.pos.y) / (10000. * (1 / symlingA.commsChannel)))

                    if (params.seeCommsLink) this.showCommsLink(symlingA, symlingB)
                };
            }
        }

        this.conditions.food.forEach((food) => {
            food.show()
        })
    }

    showCommsLink(symA, symB) {
        this.pulse(symA, symB)
        this.pulse(symB, symA)
    }

    pulse(sa, sb) {
        push();
        const segments = dist(sa.pos.x, sa.pos.y, sb.pos.x, sb.pos.y)
        const aura = sa.aura.levels
        sa.pulseIndex += this.pulseRate
        if (sa.pulseIndex > segments) sa.pulseIndex = 0

        const step = (sa.pulseIndex / segments)

        const cur_loc = {
            x: lerp(sa.pos.x, sb.pos.x, step),
            y: lerp(sa.pos.y, sb.pos.y, step)
        }

        const signal = bezierPoint(0., .5, .5, 1., step)

        stroke(aura[0], aura[1], aura[2], 255 * signal);
        // stroke(255, 255, 255, 255 * signal);
        strokeWeight(2 * signal)
        point(cur_loc.x, cur_loc.y);
        pop();
    }

}