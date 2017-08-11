/**
 * Deselect all
 */
function clearSelection() {
    $(".square.ui-selected").each(function () {
        $(this).removeClass("ui-selected");
    })
}

/**
 * Check the board and mark conflicts
 */
function checkBoard() {
    $("." + conflictClass).removeClass(conflictClass);
    var cols = [];
    var rows = [];
    // Check for duplicates in the current row
    for (var i = 0; i < 9; ++i) {
        rows = $(".row" + i).toArray();
        for (var j = 0; j < 9; ++j) {
            for (var k = 0; k < 9; ++k) {
                // console.log(rows[k].innerHTML + "===" + rows[j].innerHTML);
                if (rows[j].innerHTML === rows[k].innerHTML &&
                    rows[j].innerHTML !== emptyChar &&
                    rows[k].innerHTML !== emptyChar &&
                    j !== k) {
                    rows[j].classList.add(conflictClass);
                    rows[k].classList.add(conflictClass);
                }
            }
        }
        // Check for duplicates in the current column
        cols = $(".col" + i).toArray();
        for (j = 0; j < 9; ++j) {
            for (k = 0; k < 9; ++k) {
                if (cols[j].innerHTML === cols[k].innerHTML &&
                    cols[j].innerHTML !== emptyChar &&
                    cols[k].innerHTML !== emptyChar &&
                    j !== k) {
                    cols[j].classList.add(conflictClass);
                    cols[k].classList.add(conflictClass);
                }
            }
        }
    }
    // Check for duplicates in the current square container
    var squares = [];
    for (i = 0; i < 9; ++i) {
        squares = $(".square" + i).children().toArray();
        for (j = 0; j < 9; ++j) {
            for (k = j + 1; k < 9; ++k) {
                if (squares[j].innerHTML === squares[k].innerHTML &&
                    squares[j].innerHTML !== emptyChar &&
                    squares[k].innerHTML !== emptyChar) {
                    squares[j].classList.add(conflictClass);
                    squares[k].classList.add(conflictClass);
                }
            }
        }
    }
}

/**
 * Fill the board with the given sudoku string
 * @param {string} sudokuString 
 */
function stringToBoard(sudokuString) {
    p = sudokuString.replace(/0/g, emptyChar)
    clearBoard();
    for (var i = 0, num = 0; i < 9; ++i) {
        $(".row" + i).html(function () {
            // If the character going into the square is not emptyChar, add fromSourceClass
            if (p[num] != emptyChar) {
                $(".row" + i + ".col" + num % 9).addClass(fromSourceClass);
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
    var str = prompt("Paste the Sudoku string:", "");
    if (!str.match(/\D/i)) {
        stringToBoard(str);
    } else {
        alert("Make sure the Sudoku string has the right format");
    }

}

/**
 * Clear the board
 */
function clearBoard() {
    $(".square").removeClass(conflictClass);
    $(".square").removeClass(fromSourceClass);
    for (var i = 0; i < 9; ++i) {
        $(".row" + i).html(function () { return emptyChar; });
    }
}

/**
 * Remove player modifications from the board
 */
function resetBoard() {
    $(".square").removeClass(conflictClass);
    for (var i = 0; i < 9; ++i) {
        $(".row" + i + ":not(." + fromSourceClass + ")").html(function () { return emptyChar; });
    }
}

/**
 * Brute force the puzzle
 */
function solve() {
    // First reset
    resetBoard();
    // Return if board is empty
    var shouldSolve;
    $(".square").each(function (i, obj) {
        if (obj.innerHTML != emptyChar)
            shouldSolve = true;
    });
    if (shouldSolve) {
        smarterBruteForceAlgorithm();
        stringToBoard(array.map(x => x.value).join(""));
        array = [];
        array.length = 0;
    } else {
        alert("Empty board. Can't solve that!");
    }
}

//http://www.norvig.com/sudoku.html
//http://www.dos486.com/sudoku/index.shtml
/** Better solution **/

/**
 * Check if two given cells can "see" (i.e. in a straight line,
 * or in the same square) each other
 */
function isPeer(c1, c2) {
    var l = 9;
    var b = 3; // Needs a value!
    return (Math.floor(c1 / l) == Math.floor(c2 / l))           // Same row
        || (c1 % l == c2 % l)                                   // Same column
        || ((Math.floor(c1 / l / b) == Math.floor(c2 / l / b)   // Same square
            && Math.floor(c1 % l / b) == Math.floor(c2 % l / b)))
        && (c1 != c2)                                           // Not same cell
}

/**
 * Return an array with all the cells that are peers of the
 * desired element
 */
function getPeers(index) {
    var peers = [];
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
 */
function hasConflict(index) {
    var peers = getPeers(index);
    var peerValues = [];
    peers.forEach(function (o, i) {
        peerValues.push(Number(array[o].value));
    });
    return peerValues.countOcurrencesOf(array[index].value) > 1;
}

/**
 * 
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


var array = [];

/**
 * Check every possible value
 */
function smarterBruteForceAlgorithm() {
    var index = 0;
    var endReached = false;
    var isBack = false;

    for (var i = 0; i < 9 * 9; ++i) {
        var val = $(".col" + String(i % 9) + ".row" + String(Math.floor(i / 9))).html()
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
                if (index == array.length - 1)
                    endReached = true;
                isBack = false;
            } else {
                if (array[index].numTried >= 9) {
                    isBack = true;
                    if (index == 0) {
                        endReached = true;
                        console.log("No solution could be found");
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