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
            symlings: this.introduceSymlings(this.symlingcount),
            objects: [],
            food: this.introduceFood(this.foodcount),
            spread: {}
        }
        this.salutations()
        this.boundary = {
            center: createVector(width/2, height/2),
            w: width,
            h: height
        }

        this.channelColors = []
    }

    introduceSymlings(symlingcount) {
        const symlingContainer = [];
        const symlingColors = [];
        for (let i = 0; i < symlingcount; i++) {
            // const csize = 5
            const csize = symlingcount
            const comms = random([...Array(csize).keys()])
            symlingContainer.push(new Symling(true, i, comms))
            const channel = symlingContainer[i].commsChannel
            const clr = selectColor(channel)
            symlingColors.push(clr)
        }
        this.channelColors = symlingColors
        return symlingContainer;
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

    introduceFood(foodcount) {
        const foodContainer = [];
        for (let i = 0; i < foodcount; i++) {
            foodContainer.push(new Food())
        }
        return foodContainer;
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
                    push()
                    let huenum = ((symlingA.commsChannel / this.symlingcount))
                    // let huenum = ((symlingA.commsChannel / 5))
                    // let huenum = symlingA.commsChannel
                    colorMode(HSL, 360)
                    stroke(selectColor(huenum))
                    
                    // symlingA.pos.x -= (symlingA.pos.x - symlingB.pos.x) / 100.
			        // symlingA.pos.y -= (symlingA.pos.y - symlingB.pos.y) / 100.
                    
                    // symlingA.pos.x -= (symlingA.pos.x - symlingB.pos.x) / ((symlingA.health + symlingB.health) * 100)
			        // symlingA.pos.y -= (symlingA.pos.y - symlingB.pos.y) / ((symlingA.health + symlingB.health) * 100)
                    
                    symlingA.pos.x -= ((symlingA.pos.x - symlingB.pos.x) / (10000. * (1 / symlingA.commsChannel)))
			        symlingA.pos.y -= ((symlingA.pos.y - symlingB.pos.y) / (10000. * (1 / symlingA.commsChannel)))
                    line(symlingA.pos.x, symlingA.pos.y, symlingB.pos.x, symlingB.pos.y)
                    pop()
                };
            }
            
        }

        this.conditions.food.forEach((food) => {
            food.show()
        })
    }
}