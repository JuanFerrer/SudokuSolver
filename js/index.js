$(function () {
    $("#sudoku").selectable();
});

$(function () {
    $(".square").click(function () {
        $(this).addClass("ui-selected");
    });
})

document.addEventListener("keydown", function (e) {
    // Not pressed Control
    if (e.keyCode !== 17) {

        switch (e.keyCode) {
            case 49: case 97:
                num = "1";
                break;
            case 50: case 98:
                num = "2";
                break;
            case 51: case 99:
                num = "3";
                break;
            case 52: case 100:
                num = "4";
                break;
            case 53: case 101:
                num = "5";
                break;
            case 54: case 102:
                num = "6";
                break;
            case 55: case 103:
                num = "7";
                break;
            case 56: case 104:
                num = "8";
                break;
            case 57: case 105:
                num = "9";
                break;
            default:
                num = "-";
                break;
        }
        $(".square.ui-selected").each(function () {
            $(this).html(num);
            $(this).removeClass("ui-selected");
        })
    }
})

var emptyChar = "-";

function checkBoard() {
    $(".conflict").removeClass("conflict");
    var cols = [];
    var rows = [];
    for (var i = 0; i < 9; ++i) {
        rows = $(".row" + i).toArray();
        for (var j = 0; j < 9; ++j) {
            for (var k = 0; k < 9; ++k) {
                // console.log(rows[k].innerHTML + "===" + rows[j].innerHTML);
                if (rows[j].innerHTML === rows[k].innerHTML
                    && rows[j].innerHTML !== emptyChar
                    && rows[k].innerHTML !== emptyChar
                    && j !== k) {
                    rows[j].classList.add("conflict");
                    rows[k].classList.add("conflict");
                }
            }
        }
        cols = $(".col" + i).toArray();
        for (j = 0; j < 9; ++j) {
            for (k = 0; k < 9; ++k) {
                if (cols[j].innerHTML === cols[k].innerHTML
                    && cols[j].innerHTML !== emptyChar
                    && cols[k].innerHTML !== emptyChar
                    && j !== k) {
                    cols[j].classList.add("conflict");
                    cols[k].classList.add("conflict");
                }
            }
        }
    }
}

var p = "003020600900305001001806400008102900700000008006708200002609500800203009005010300".replace(/0/g, emptyChar);

function clearBoard() {
    //$(".square").html(emptyChar);
    var num = 0;
    //$(".square").html(function () { return p[num++]; });
    for (var i = 0; i < 9; ++i) {
        $(".row" + i).html(function () { return p[num++]; });
    }
}