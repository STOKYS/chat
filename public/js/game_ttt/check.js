

function checkWin() {
    let checked = tiles[tiles.length - 1]
    let checkedP = checked.charAt(0)
    let checkedX = checked.slice(-4, -2)
    let checkedY = checked.slice(-2)


    let matches = -1
    let i = (checkedX < 9) ? ("0" + (Number(checkedX) + 1)) : (Number(checkedX) + 1)
    while (tiles.find(element => element == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + checkedY)) == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + checkedY)) {
        i = (Number(i) < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)
        matches++
    }

    i = (checkedX < 11) ? ("0" + (Number(checkedX) - 1)) : (Number(checkedX) - 1)
    while (tiles.find(element => element == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + checkedY)) == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + checkedY)) {
        i = (Number(i) < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)
        matches++
    }
    if (matches < 1) {
        matches += 1
        if (matches == 0){
            matches += 1
        }
    }
    if (matches >= pointsToWin) {
        win(checkedP)
    } else {
        matches = -1
        i = (checkedY < 9) ? ("0" + (Number(checkedY) + 1)) : (Number(checkedY) + 1)
        while (tiles.find(element => element == (String(checkedP) + checkedX + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)))) == (String(checkedP) + checkedX + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)))) {
            i = (Number(i) < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)
            matches++
        }

        i = (checkedY < 11) ? ("0" + (Number(checkedY) - 1)) : (Number(checkedY) - 1)
        while (tiles.find(element => element == (String(checkedP) + checkedX + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)))) == (String(checkedP) + checkedX + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)))) {
            i = (Number(i) < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)
            matches++
        }
        if (matches  < 1) {
            matches += 1
            if (matches == 0){
                matches += 1
            }
        }
        if (matches >= pointsToWin) {
            win(checkedP)
        } else {
            matches = -1
            i = (checkedX < 9) ? ("0" + (Number(checkedX) + 1)) : (Number(checkedX) + 1)
            let j = (checkedY < 11) ? ("0" + (Number(checkedY) - 1)) : (Number(checkedY) - 1)
            while (tiles.find(element => element == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + ((j < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)))) == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + ((j < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)))) {
                i = (Number(i) < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)
                j = (Number(j) < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)
                matches++
            }

            i = (checkedX < 11) ? ("0" + (Number(checkedX) - 1)) : (Number(checkedX) - 1)
            j = (checkedY < 9) ? ("0" + (Number(checkedY) + 1)) : (Number(checkedY) + 1)
            while (tiles.find(element => element == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + ((j < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)))) == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + ((j < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)))) {
                i = (Number(i) < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)
                j = (Number(j) < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)
                matches++
            }
            if (matches < 1) {
                matches += 1
                if (matches == 0){
                    matches += 1
                }
            }
            if (matches >= pointsToWin) {
                win(checkedP)
            } else {
                matches = -1
                i = (checkedX < 9) ? ("0" + (Number(checkedX) + 1)) : (Number(checkedX) + 1)
                j = (checkedY < 9) ? ("0" + (Number(checkedY) + 1)) : (Number(checkedY) + 1)
                while (tiles.find(element => element == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + ((j < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)))) == (String(checkedP) + ((i < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)) + ((j < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)))) {
                    i = (Number(i) < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)
                    j = (Number(j) < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)
                    matches++
                }

                i = (checkedX < 11) ? ("0" + (Number(checkedX) - 1)) : (Number(checkedX) - 1)
                j = (checkedY < 11) ? ("0" + (Number(checkedY) - 1)) : (Number(checkedY) - 1)
                while (tiles.find(element => element == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + ((j < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)))) == (String(checkedP) + ((i < 9) ? ("0" + (Number(i) + 1)) : (Number(i) + 1)) + ((j < 9) ? ("0" + (Number(j) + 1)) : (Number(j) + 1)))) {
                    i = (Number(i) < 11) ? ("0" + (Number(i) - 1)) : (Number(i) - 1)
                    j = (Number(j) < 11) ? ("0" + (Number(j) - 1)) : (Number(j) - 1)
                    matches++
                }
                if (matches < 1) {
                    matches += 1
                    if (matches == 0){
                        matches += 1
                    }
                }

                if (matches >= pointsToWin) {
                    win(checkedP)
                }
            }
        }
    }





}