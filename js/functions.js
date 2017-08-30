let array = [];

/**
 * Deselect all
 */
function clearSelection() {
    $('.square.ui-selected').each(function () {
        $(this).removeClass('ui-selected');
    })
}

/**
 * Check the board and mark conflicts
 */
function checkBoard() {
    $('.' + conflictClass).removeClass(conflictClass);
    let cols = [];
    let rows = [];
    // Check for duplicates in the current row
    for (let i = 0; i < 9; ++i) {
        rows = $(`.row${i}`).toArray();
        rows.forEach((j) => {
            rows.forEach((k) => {
                if (j.innerHTML === k.innerHTML &&
                    j.innerHTML !== emptyChar &&
                    k.innerHTML !== emptyChar &&
                    j !== k) {
                    j.classList.add(conflictClass);
                    k.classList.add(conflictClass);
                }
            })
        })
        // Check for duplicates in the current column
        cols = $(`.col${i}`).toArray();
        cols.forEach((j) => {
            cols.forEach((k) => {
                if (j.innerHTML === k.innerHTML &&
                    j.innerHTML !== emptyChar &&
                    k.innerHTML !== emptyChar &&
                    j !== k) {
                    j.classList.add(conflictClass);
                    k.classList.add(conflictClass);
                }
            })
        })
    }
    // Check for duplicates in the current square container
    let squares = [];
    for (i = 0; i < 9; ++i) {
        squares = $(`.square${i}`).children().toArray();
        squares.forEach((j) => {
            squares.forEach((k) => {
                if (j.innerHTML === k.innerHTML &&
                    j.innerHTML !== emptyChar &&
                    k.innerHTML !== emptyChar &&
                    j !== k) {
                    j.classList.add(conflictClass);
                    k.classList.add(conflictClass);
                }
            })
        })
    }
}

/**
 * Fill the board with the given sudoku string
 * @param {string} sudokuString 
 */
function stringToBoard(sudokuString, fromUser = true) {
    p = sudokuString.replace(/0/g, emptyChar)
    for (var i = 0, num = 0; i < 9; ++i) {
        $(`.row${i}`).html(function () {
            // If the character going into the square is not emptyChar, add fromSourceClass
            if (fromUser) {
                if (p[num] != emptyChar) {
                    $(`.row${i}.col${num % 9}`).addClass(fromSourceClass);
                }
            }
            // Either way, return the character
            return p[num++];
        });
    }
}

/**
 * Read sudoku string from player to populate board
 */
function populateBoard() {
    let str = prompt('Paste the Sudoku string:', '');
    if (str !== '' && str !== null && !str.match(/\D/i)) {
        stringToBoard(str);
    } else {
        alert('Make sure the Sudoku string has the right format');
    }

}

/**
 * Clear the board
 */
function clearBoard() {
    $('.square').removeClass(conflictClass);
    $('.square').removeClass(fromSourceClass);
    for (let i = 0; i < 9; ++i) {
        $(`.row${i}`).html(function () { return emptyChar; });
    }
}

/**
 * Remove player modifications from the board
 */
function resetBoard() {
    $('.square').removeClass(conflictClass);
    for (let i = 0; i < 9; ++i) {
        $(`.row${i}:not(.${fromSourceClass})`).html(function () { return emptyChar; });
    }
}

/**
 * Brute force the puzzle
 */
function solve() {
    // First reset
    resetBoard();
    // Return if board is empty
    let shouldSolve = false;
    $('.square').each(function (i, obj) {
        if (!shouldSolve || obj.innerHTML !== emptyChar) {
            shouldSolve = true;
        }
    });
    if (shouldSolve) {
        smarterBruteForceAlgorithm();
        stringToBoard(array.map(x => x.value).join(''), false);
        array = [];
        array.length = 0;
    } else {
        alert('Empty board. Can\'t solve that!');
    }
}

//http://www.norvig.com/sudoku.html
//http://www.dos486.com/sudoku/index.shtml
/** Better solution **/

/**
 * Check if two given cells can "see" (i.e. in a straight line,
 * or in the same square) each other
 * @return {boolean}
 */
function isPeer(c1, c2) {
    const l = 9;
    const b = 3; // Needs a value!
    return (Math.floor(c1 / l) == Math.floor(c2 / l))           // Same row
        || (c1 % l == c2 % l)                                   // Same column
        || ((Math.floor(c1 / l / b) == Math.floor(c2 / l / b)   // Same square
            && Math.floor(c1 % l / b) == Math.floor(c2 % l / b)))
        && (c1 != c2)                                           // Not same cell
}

/**
 * Return an array with all the cells that are peers of the
 * desired element
 * @return {number[]}
 */
function getPeers(index) {
    let peers = [];
    array.forEach(function (o, i) {
        if (isPeer(index, i) && !array.includes(i)) {
            peers.push(i);
        }
    })
    return peers;
}

/**
 * Check if the passed index has generated a coflict
 * @param {number} index - It should always be the last number inserted in the sudoku
 * @return {boolean}
 */
function hasConflict(index) {
    let peers = getPeers(index);
    let peerValues = [];
    peers.forEach(function (o, i) {
        peerValues.push(Number(array[o].value));
    });
    return peerValues.countOcurrencesOf(array[index].value) > 1;
}

/**
 * Each cell of the sudoku
 */
class Cell {
    /**
     * 
     * @param {number} value - Value of the cell taken from the array
     * @param {number} index - Index in the array
     */
    constructor(value) {
        this.numTried = 0;
        this.value = value;
        this.isFromSource = value != 0;
    }
};

/**
 * Check every possible value
 */
function smarterBruteForceAlgorithm() {
    let index = 0;
    let endReached = false;
    let isBack = false;

    for (let i = 0; i < 9 * 9; ++i) {
        let val = $(`.col${String(i % 9)}.row${String(Math.floor(i / 9))}`).html()
        array.push(new Cell(Number(val != emptyChar ? val : 0)));
    }
    while (!endReached) {
        if (index > array.length - 1) {
            endReached = true;
        }
        else if (array[index].value < 9 && !array[index].isFromSource) {
            array[index].value = ++array[index].numTried;

            if (!hasConflict(index)) {
                index++;
                if (index > array.length - 1)
                    endReached = true;
                isBack = false;
            } else {
                if (array[index].numTried >= 9) {
                    isBack = true;
                    if (index == 0) {
                        endReached = true;
                        console.log('No solution could be found');
                    }
                }
            }
        } else {
            if (!array[index].isFromSource) {
                array[index].value = 0;
            }
            array[index].numTried = 0;
            index = isBack ? index - 1 : index + 1
        }
    }
}

/**
 * Check if the array has duplicates
 */
if (!Array.prototype.countOcurrencesOf) {
    Array.prototype.countOcurrencesOf = function (search) {
        return this.reduce(function (n, val) {
            return n + (val === search);
        }, 0);
    }
}