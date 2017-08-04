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
    $(".conflict").removeClass("conflict");
    var cols = [];
    var rows = [];
    for (var i = 0; i < 9; ++i) {
        rows = $(".row" + i).toArray();
        for (var j = 0; j < 9; ++j) {
            for (var k = 0; k < 9; ++k) {
                // console.log(rows[k].innerHTML + "===" + rows[j].innerHTML);
                if (rows[j].innerHTML === rows[k].innerHTML &&
                    rows[j].innerHTML !== emptyChar &&
                    rows[k].innerHTML !== emptyChar &&
                    j !== k) {
                    rows[j].classList.add("conflict");
                    rows[k].classList.add("conflict");
                }
            }
        }
        cols = $(".col" + i).toArray();
        for (j = 0; j < 9; ++j) {
            for (k = 0; k < 9; ++k) {
                if (cols[j].innerHTML === cols[k].innerHTML &&
                    cols[j].innerHTML !== emptyChar &&
                    cols[k].innerHTML !== emptyChar &&
                    j !== k) {
                    cols[j].classList.add("conflict");
                    cols[k].classList.add("conflict");
                }
            }
        }
    }
    var squares = [];
    for (i = 0; i < 9; ++i) {
        squares = $(".square" + i).children().toArray();
        for (j = 0; j < 9; ++j) {
            for (k = j + 1; k < 9; ++k) {
                if (squares[j].innerHTML === squares[k].innerHTML &&
                    squares[j].innerHTML !== emptyChar &&
                    squares[k].innerHTML !== emptyChar) {
                    squares[j].classList.add("conflict");
                    squares[k].classList.add("conflict");
                }
            }
        }
    }
}

function populateBoard() {
    clearBoard();
    for (var i = 0, num = 0; i < 9; ++i) {
        $(".row" + i).html(function () { return p[num++]; });
    }
}

/**
 * Clear the board
 */
function clearBoard() {
    //$(".square").html(emptyChar);
    $(".square").removeClass("conflict");
    //$(".square").html(function () { return p[num++]; });
    for (var i = 0, num = 0; i < 9; ++i) {
        $(".row" + i).html(function () { return emptyChar; });
    }
}

/**
 * Brute force the puzzle
 */
function solve() {
    
}