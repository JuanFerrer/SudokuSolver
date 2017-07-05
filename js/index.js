$(function () {
    $("#sudoku").selectable();
});

$(function () {
    $(".square").click(function () {
        $(this).addClass("ui-selected");
    });
})