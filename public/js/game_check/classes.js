/*class Pawn {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "pawn"
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves(side) {
        if (this.side == "light") {
            if (this.y == 0 && game.canTurn) {
                switchPawn("light")
            }
        } else {
            if (this.y == canvas.height - this.height && game.canTurn) {
                switchPawn("dark")
            }
        }
        for(let i = 1; i < 3; i++){
            game.highlights.push(new Tile(this.x + 200 * i, this.y + 200 * i, this.width, this.height, move))
            game.highlights.push(new Tile(this.x + 200 * i, this.y - 200 * i, this.width, this.height, move))
            game.highlights.push(new Tile(this.x - 200 * i, this.y + 200 * i, this.width, this.height, move))
            game.highlights.push(new Tile(this.x - 200 * i, this.y - 200 * i, this.width, this.height, move))
        }
        for (let i = 0; i < game.highlights.length; i+=2){
            game.pieces.forEach(function (obj) {
                if(game.highlights[i].x == obj.x && game.highlights[i].y == obj.y){
                    if (obj.side == side){
                        game.highlights.splice(i, 1)
                        game.highlights.splice(i + 1, 1)
                        i -= 2
                    } else {
                        for (let j = 1; j < game.highlights.length; j+=2){
                            game.pieces.forEach(function (obji) {
                                if(game.highlights[j].x == obj.x && game.highlights[j].y == obj.y){
                                    if (obj.side == side){
                                        game.highlights.splice(i, 1)
                                        game.highlights.splice(i + 1, 1)
                                        i -= 2
                                }
                            })
                        }
                    }
                }
            })
        }
        valid_pos_pawn()
        this.attack(this.x, this.y, this.side)
    }
    attack(x, y, side) {
        game.pieces.forEach(function (obj) {
            if (game.back){
                if (((obj.x - obj.width == x && obj.y - obj.height == y) || (obj.x + obj.width == x && obj.y - obj.height == y) || (obj.x - obj.width == x && obj.y + obj.height == y) || (obj.x + obj.width == x && obj.y + obj.height == y)) && obj.side != side) {
                    game.targets.push(obj)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            } else {
                if(side == "light" && ((obj.x - obj.width == x && obj.y + obj.height == y) || (obj.x + obj.width == x && obj.y + obj.height == y)) && side != obj.side){
                    game.targets.push(obj)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                } else if (side == "dark" && ((obj.x - obj.width == x && obj.y - obj.height == y) || (obj.x + obj.width == x && obj.y - obj.height == y)) && side != obj.side){
                    game.targets.push(obj)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            }
        });
    }
}

function valid_pos() {
    game.pieces.forEach(function (obj) {
        game.highlights.forEach(function (obji, index) {
            if (obj.x == obji.x && obj.y == obji.y && obj.side == game.selected.side) {
                game.highlights.splice(index, 1)
            }
        })
    })
}

function valid_pos_pawn() {
    game.pieces.forEach(function (obj) {
        game.highlights.forEach(function (obji, index) {
            if (obj.x == obji.x && obj.y == obji.y) {
                game.highlights.splice(index, 1)
            }
        })
    })
}

class Bishop {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "bishop"
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + this.height, this.width, this.height, move))
        valid_pos()
        this.attack(this.side)
    }
    attack(side) {
        game.pieces.forEach(function (obj) {
            game.highlights.forEach(function (obji, index) {
                if (obj.x == obji.x && obj.y == obji.y && side != obj.side) {
                    game.targets.push(obj)
                    game.highlights.splice(index, 1)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            })
        })
    }
}

class Rook {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "rook"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        let use = this
        let positions = [
            [-9999],
            [9999],
            [-9999],
            [9999]
        ]
        game.pieces.forEach(function (obj) {
            if ((obj.x == use.x || obj.y == use.y) && !(obj.x == use.x && obj.y == use.y)) {
                if (obj.y == use.y && obj.x < use.x && positions[0][0] < obj.x) positions[0] = [obj.x, obj.side]
                else if (obj.y == use.y && obj.x > use.x && positions[1][0] > obj.x) positions[1] = [obj.x, obj.side]
                else if (obj.x == use.x && obj.y < use.y && positions[2][0] < obj.y) positions[2] = [obj.y, obj.side]
                else if (obj.x == use.x && obj.y > use.y && positions[3][0] > obj.y) positions[3] = [obj.y, obj.side]
            }
        })
        if (positions[0].length != 1) {
            for (let i = 1; i <= ((use.x - positions[0][0]) / use.width); i++) {
                if (i == ((use.x - positions[0][0]) / use.width)) {
                    if (use.side != positions[0][1]) {
                        game.highlights.push(new Tile(positions[0][0], use.y, use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x - (use.width * i), use.y, use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x - (use.width * i), use.y, use.width, use.height, move))
            }
        }
        if (positions[1].length != 1) {
            for (let i = 1; i <= ((positions[1][0] - use.x) / use.width); i++) {
                if (i == ((positions[1][0] - use.x) / use.width)) {
                    if (use.side != positions[1][1]) {
                        game.highlights.push(new Tile(positions[1][0], use.y, use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x + (use.width * i), use.y, use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x + (use.width * i), use.y, use.width, use.height, move))
            }
        }
        if (positions[2].length != 1) {
            for (let i = 1; i <= ((use.y - positions[2][0]) / use.height); i++) {
                if (i == ((use.y - positions[2][0]) / use.height)) {
                    if (use.side != positions[2][1]) {
                        game.highlights.push(new Tile(use.x, positions[2][0], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x, use.y - (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x, use.y - (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[3].length != 1) {
            for (let i = 1; i <= ((positions[3][0] - use.y) / use.height); i++) {
                if (i == ((positions[3][0] - use.y) / use.height)) {
                    if (use.side != positions[3][1]) {
                        game.highlights.push(new Tile(use.x, positions[3][0], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x, use.y + (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x, use.y + (use.height * i), use.width, use.height, move))
            }
        }
        this.attack(this.side)
    }
    attack(side) {
        game.pieces.forEach(function (obj) {
            game.highlights.forEach(function (obji, index) {
                if (obj.x == obji.x && obj.y == obji.y && side != obj.side) {
                    game.targets.push(obj)
                    game.highlights.splice(index, 1)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            })
        })
    }
}

class Knight {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "knight"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + (2 * this.height), this.width, this.height, move))
        game.highlights.push(new Tile(this.x - (2 * this.height), this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - (2 * this.height), this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + (2 * this.height), this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + (2 * this.height), this.y + this.height, this.width, this.height, move))
        valid_pos()
        this.attack(this.side)
    }
    attack(side) {
        game.pieces.forEach(function (obj) {
            game.highlights.forEach(function (obji, index) {
                if (obj.x == obji.x && obj.y == obji.y && side != obj.side) {
                    game.targets.push(obj)
                    game.highlights.splice(index, 1)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            })
        })
    }
}

class Queen {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "queen"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        let use = this
        let positions = [
            [-9999],
            [9999],
            [-9999],
            [9999],
            [9999, 9999],
            [-9999, -9999],
            [9999, -9999],
            [-9999, 9999]
        ]
        game.pieces.forEach(function (obj) {
            if ((obj.x == use.x || obj.y == use.y) && !(obj.x == use.x && obj.y == use.y)) {
                if (obj.y == use.y && obj.x < use.x && positions[0][0] < obj.x) positions[0] = [obj.x, obj.side]
                else if (obj.y == use.y && obj.x > use.x && positions[1][0] > obj.x) positions[1] = [obj.x, obj.side]
                else if (obj.x == use.x && obj.y < use.y && positions[2][0] < obj.y) positions[2] = [obj.y, obj.side]
                else if (obj.x == use.x && obj.y > use.y && positions[3][0] > obj.y) positions[3] = [obj.y, obj.side]
            }
            if (!(obj.x == use.x && obj.y == use.y)) {
                for (let i = 1; i <= Game.TILES; i++) {
                    if (obj.y == use.y + (use.height * i) && obj.x == use.x + (use.width * i) && positions[4][0] > obj.x && positions[4][1] > obj.y) positions[4] = [obj.x, obj.y, obj.side]
                    else if (obj.y == use.y - (use.height * i) && obj.x == use.x - (use.width * i) && positions[5][0] < obj.x && positions[5][1] < obj.y) positions[5] = [obj.x, obj.y, obj.side]
                    else if (obj.y == use.y - (use.height * i) && obj.x == use.x + (use.width * i) && positions[6][0] > obj.x && positions[6][1] < obj.y) positions[6] = [obj.x, obj.y, obj.side]
                    else if (obj.y == use.y + (use.height * i) && obj.x == use.x - (use.width * i) && positions[7][0] < obj.x && positions[7][1] > obj.y) positions[7] = [obj.x, obj.y, obj.side]
                }
            }
        })
        if (positions[0].length != 1) {
            for (let i = 1; i <= ((use.x - positions[0][0]) / use.width); i++) {
                if (i == ((use.x - positions[0][0]) / use.width)) {
                    if (use.side != positions[0][1]) {
                        game.highlights.push(new Tile(positions[0][0], use.y, use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x - (use.width * i), use.y, use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x - (use.width * i), use.y, use.width, use.height, move))
            }
        }
        if (positions[1].length != 1) {
            for (let i = 1; i <= ((positions[1][0] - use.x) / use.width); i++) {
                if (i == ((positions[1][0] - use.x) / use.width)) {
                    if (use.side != positions[1][1]) {
                        game.highlights.push(new Tile(positions[1][0], use.y, use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x + (use.width * i), use.y, use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x + (use.width * i), use.y, use.width, use.height, move))
            }
        }
        if (positions[2].length != 1) {
            for (let i = 1; i <= ((use.y - positions[2][0]) / use.height); i++) {
                if (i == ((use.y - positions[2][0]) / use.height)) {
                    if (use.side != positions[2][1]) {
                        game.highlights.push(new Tile(use.x, positions[2][0], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x, use.y - (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x, use.y - (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[3].length != 1) {
            for (let i = 1; i <= ((positions[3][0] - use.y) / use.height); i++) {
                if (i == ((positions[3][0] - use.y) / use.height)) {
                    if (use.side != positions[3][1]) {
                        game.highlights.push(new Tile(use.x, positions[3][0], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x, use.y + (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x, use.y + (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[4].length != 2) {
            for (let i = 1; i <= ((positions[4][0] - use.x) / use.width); i++) {
                if (i == ((positions[4][0] - use.x) / use.width)) {
                    if (use.side != positions[4][2]) {
                        game.highlights.push(new Tile(positions[4][0], positions[4][1], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x + (use.width * i), use.y + (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x + (use.width * i), use.y + (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[5].length != 2) {
            for (let i = 1; i <= ((use.x - positions[5][0]) / use.width); i++) {
                if (i == ((use.x - positions[5][0]) / use.width)) {
                    if (use.side != positions[5][2]) {
                        game.highlights.push(new Tile(positions[5][0], positions[5][1], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x - (use.width * i), use.y - (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x - (use.width * i), use.y - (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[6].length != 2) {
            for (let i = 1; i <= ((positions[6][0] - use.x) / use.width); i++) {
                if (i == ((positions[6][0] - use.x) / use.width)) {
                    if (use.side != positions[6][2]) {
                        game.highlights.push(new Tile(positions[6][0], positions[6][1], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x + (use.width * i), use.y - (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x + (use.width * i), use.y - (use.height * i), use.width, use.height, move))
            }
        }
        if (positions[7].length != 2) {
            for (let i = 1; i <= ((use.x - positions[7][0]) / use.width); i++) {
                if (i == ((use.x - positions[7][0]) / use.width)) {
                    if (use.side != positions[7][2]) {
                        game.highlights.push(new Tile(positions[7][0], positions[7][1], use.width, use.height, move))
                    }
                } else {
                    game.highlights.push(new Tile(use.x - (use.width * i), use.y + (use.height * i), use.width, use.height, move))
                }
            }
        } else {
            for (let i = 1; i <= Game.TILES; i++) {
                game.highlights.push(new Tile(use.x - (use.width * i), use.y + (use.height * i), use.width, use.height, move))
            }
        }
        this.attack(this.side)
    }
    attack(side) {
        game.pieces.forEach(function (obj) {
            game.highlights.forEach(function (obji, index) {
                if (obj.x == obji.x && obj.y == obji.y && side != obj.side) {
                    game.targets.push(obj)
                    game.highlights.splice(index, 1)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            })
        })
    }
}

class King {
    constructor(x, y, width, height, image, side) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.side = side
        this.name = "king"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {
        game.highlights.push(new Tile(this.x - this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.width, this.y + this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x - this.height, this.y, this.width, this.height, move))
        game.highlights.push(new Tile(this.x + this.height, this.y, this.width, this.height, move))
        game.highlights.push(new Tile(this.x, this.y - this.height, this.width, this.height, move))
        game.highlights.push(new Tile(this.x, this.y + this.height, this.width, this.height, move))
        valid_pos()
        this.attack(this.side)
    }
    attack(side) {
        game.pieces.forEach(function (obj) {
            game.highlights.forEach(function (obji, index) {
                if (obj.x == obji.x && obj.y == obji.y && side != obj.side) {
                    game.targets.push(obj)
                    game.highlights.splice(index, 1)
                    game.highlights.push(new Tile(obj.x, obj.y, obj.width, obj.height, attack))
                }
            })
        })
    }
}

class Tile {
    constructor(x, y, width, height, image) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.image = image
        this.name = "highlight"
    }
    update() {

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
    moves() {

    }
}*/