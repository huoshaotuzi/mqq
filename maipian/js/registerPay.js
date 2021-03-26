// 订单状态检查
let order = $('#main').data('order');
let statusInter = setInterval(function () {
    $.get(order, function (data, status) {
        if (data.status) {
            clearInterval(statusInter);
            $('#order-status').html('<b style="color:red;">付款成功！正在跳转，请勿关闭或刷新页面。</b>');
            setTimeout(function () {
                location.href = data.data.url;
            }, 1000)
        }
    });
}, 5000);

// 页面计时器
let current = 300;
$('#pay-time').text(current);
let inter = setInterval(function () {
    $('#pay-time').text(current--);
    if (current <= -1) {
        clearInterval(inter);
        clearInterval(statusInter);
        $('#order-status').html('<b style="color:red;">未完成支付，订单已失效，请刷新页面重新下单。</b>');
    }
}, 1000);
