function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    // return `hsl(${hue},50,75)`;
    return color(hue,50,75, 100);
    // return color(hue,50,75, 200);
  }


class SymlingPool {
    constructor(symlingcount, foodcount) {
        this.symlingcount = symlingcount;
        this.foodcount = foodcount;
        this.conditions = {
            symlings: [],
            objects:  [],
            food: [],
            spread: {}
        }
        this.salutations()
        this.boundary = {
            center: createVector(width/2, height/2),
            w: width,
            h: height
        }

        this.channelColors = []
        this.introduceSymlings(this.symlingcount)
        this.introduceFood(this.foodcount)
    }

    setPopulation(newpopulation) {
        // If population is greater than symlingcount then add the difference, otherwise remove symlings
        if(this.symlingcount > newpopulation){
            this.conditions.symlings = this.conditions.symlings.slice(0, newpopulation -1)
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
         if(this.foodcount > newfood){
             this.conditions.food = this.conditions.food.slice(0, newfood -1)
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

    wrapSymlings(wrapQ){
        this.conditions.symlings.forEach((symling) => {
            symling.wrapQ = wrapQ
        })
    }

    salutations() {
        this.conditions.symlings.forEach((symling) => {
            symling.initMessage(this.conditions.spread);
        })
    }

    update(){

        const allBadFood = this.conditions.food.every(snack => snack.val < 0)

        if (allBadFood) this.introduceFood(this.foodcount);
        
        this.conditions.symlings.forEach((symling) => {
            symling.update(this.conditions);
        })

    }

    show(){

        this.conditions.symlings.forEach((symling) => {
            symling.show()
        })

        // comms link

        for(let i = 0; i < this.conditions.symlings.length; i++) {
            const symlingA = this.conditions.symlings[i];
            // console.log(symlingA, 'symlingA')
            for(let j = i + 1; j < this.conditions.symlings.length; j++) {
                const symlingB = this.conditions.symlings[j]
                // console.log(symlingB, 'symlingB')
                if(symlingA.commsChannel === symlingB.commsChannel) {
                    symlingA.pos.x -= ((symlingA.pos.x - symlingB.pos.x) / (10000. * (1 / symlingA.commsChannel)))
			        symlingA.pos.y -= ((symlingA.pos.y - symlingB.pos.y) / (10000. * (1 / symlingA.commsChannel)))

                    if(params.seeCommsLink) this.showCommsLink(symlingA, symlingB)
                };
            }
        }

        this.conditions.food.forEach((food) => {
            food.show()
        })
    }

    showCommsLink(symA, symB) {
        // TODO: #5 If beings are on the same channel, draw moving dashed lines between them with the same stroke color as the objects themselves
        push()
        let huenum = ((symA.commsChannel / this.symlingcount))
        // let huenum = ((symA.commsChannel / 5))
        // let huenum = symA.commsChannel
        colorMode(HSL, 360)
        stroke(selectColor(huenum))
        line(symA.pos.x, symA.pos.y, symB.pos.x, symB.pos.y)
        pop()
    }
}