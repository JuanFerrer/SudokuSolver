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

function hasConflict() {
    checkBoard();
    if ($("." + conflictClass).toArray().length > 0)
        return true;
    return false;
}

function bruteForceAlgorithm() {
    var index = 0;
    var numArray = [];
    numArray.length = 9 * 9;
    numArray.fill(0);
    var endReached = false;
    var isBack = false;
    while (!endReached) {
        if (numArray[index] < 9 && !$(".col" + String(index % 9) + ".row" + String(Math.floor(index / 9))).hasClass(fromSourceClass)) {
            $(".col" + String(index % 9) + ".row" + String(Math.floor(index / 9))).html(++numArray[index]);

            if (!hasConflict()) {
                index++;
                if (index == numArray.length)
                    endReached = true;
                isBack = false;
            } else {
                if (numArray[index] >= 9) {
                    isBack = true;
                }
            }
        }
        else {
            if (!$(".col" + String(index % 9) + ".row" + String(Math.floor(index / 9))).hasClass(fromSourceClass)) {
                $(".col" + String(index % 9) + ".row" + String(Math.floor(index / 9))).html(emptyChar);
            }
            numArray[index] = 0;
            index = isBack ? index - 1 : index + 1
        }
    }
}

function populateBoard() {
    var str = prompt("Paste the Sudoku string:", "");
    if (!str.match(/\D/i)) {
        p = str.replace(/0/g, emptyChar)
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
        bruteForceAlgorithm();
    } else {
        alert("Empty board. Can't solve that!");
    }
}