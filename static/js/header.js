
//@ sourceURL=header.js
//下拉列表
$(function () {
    $('.nav_piece h1').mouseenter(function () {
        $(this).next().slideDown(500,'elasticOut');
    })
    $('.nav_piece').mouseleave(function () {
        $(this).find('ul').slideUp(100);
    }).click(function () {
        $(this).addClass('now').siblings().removeClass('now')
    })
})
