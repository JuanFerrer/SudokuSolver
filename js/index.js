const emptyChar = ' ';
const conflictClass = 'conflict';
const fromSourceClass = 'from-source';

$(function () {
    $('#sudoku').selectable();
});

$(function () {
    $('.square').click(function () {
        $(this).addClass('ui-selected');
    });
})

/**
 * Adding event listeners
 */
document.addEventListener('keydown', function (e) {
    // Not pressed Control
    if (e.keyCode !== 17) {

        switch (e.keyCode) {
            case 49: case 97:
                num = '1';
                break;
            case 50: case 98:
                num = '2';
                break;
            case 51: case 99:
                num = '3';
                break;
            case 52: case 100:
                num = '4';
                break;
            case 53: case 101:
                num = '5';
                break;
            case 54: case 102:
                num = '6';
                break;
            case 55: case 103:
                num = '7';
                break;
            case 56: case 104:
                num = '8';
                break;
            case 57: case 105:
                num = '9';
                break;
            default:
                num = emptyChar;
                break;
        }
        $('.square.ui-selected').each(function () {
            $(this).html(num);
            $(this).removeClass('ui-selected');
        })
    }
})

document.getElementsByTagName('html')[0].addEventListener('click', function () {
    clearSelection();
});

let p = '003020600900305001001806400008102900700000008006708200002609500800203009005010300'.replace(/0/g, emptyChar);