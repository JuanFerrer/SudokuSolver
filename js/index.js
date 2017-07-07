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

function checkBoard() {
    var cols = [];
    var rows = [];
    for (var i = 0; i < 9; ++i) {
        console.log("row" + i);
        rows = $(".row" + i).toArray();
        for (var j = 0; j < 9; ++j) {
            console.log(rows[i].innerHTML + " == " + rows[j].innerHTML);
            if (rows[i].innerHTML === rows[j].innerHTML) {
                rows[i].classList.add("conflict");
                rows[j].classList.add("conflict");
            }
        }
    }
    for (var i = 0; i < 9; ++i) {
        console.log("col" + i);
        cols = $(".col" + i).toArray();
        for (var j = 0; j < 9; ++j) {
            console.log(cols[i].innerHTML + " == " + cols[j].innerHTML);
            if (cols[i].innerHTML === cols[j].innerHTML) {
                cols[i].classList.add("conflict");
                cols[j].classList.add("conflict");
            }
        }
    }
}