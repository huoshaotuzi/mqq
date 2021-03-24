function disableBtn(rule) {
    $(rule).attr('disabled', true);
}

function enableBtn(rule) {
    $(rule).attr('disabled', false);
}

function showError(message, callback = null) {
    Swal.fire({
        type: "error",
        title: message,
        timer: 10000,
        onClose: function () {
            if (callback != null) {
                callback();
            }
        }
    });
}

function showSuccess(message, callback = null) {
    Swal.fire({
        type: "success",
        title: message,
        timer: 10000,
        onClose: function () {
            if (callback != null) {
                callback();
            }
        }
    });
}

function showConfirm(title, desc, callback) {
    swal.fire({
        title: title,
        text: desc,
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '确认',
        cancelButtonText: '取消',
    }).then(function (res) {
        if (res.value == true) {
            callback();
        }
    });
}

$(document).on("click", ".search-open", function (e) {
    location.href = $(this).data('url');
});

$(document).on("click", ".sign-in", function (e) {
    let url = $(this).data("url");
    $.ajax({
        type: "POST",
        url: url,
        success: (res) => {
            if (res.code == 0) {
                showSuccess(res.message, () => {
                    location.reload();
                });
            } else {
                showError(res.message);
            }
        }
    });
});

$(document).on("click", ".logout", function (e) {
    $.removeCookie("token", {path: "/"});
    location.href = "/";
});

$(document).on("click", ".login-submit", function (e) {
    e.preventDefault();
    disableBtn(".login-submit");
    let url = $(this).data('url');
    let password = $("input[name='login_password']").val();
    let email = $("input[name='login_email']").val();

    $.ajax({
        type: "POST",
        url: url,
        data: {
            email: email,
            password: password,
        },
        success: (res) => {
            if (res.code !== 0) {
                $(".error-tip").show().html('<i class="fa fa-close"></i> ' + res.message);
            } else {
                $.cookie('token', res.token, {expires: 7, path: "/"});
                location.reload();
            }
        }, complete: (res) => {
            setTimeout(() => {
                enableBtn(".login-submit");
            }, 3000);
        }
    });
});

$(document).on("click", ".register-submit", function (e) {
    e.preventDefault();
    disableBtn(".register-submit");
    let url = $(this).data('url');
    let name = $("input[name='reg_name']").val();
    let password = $("input[name='reg_password']").val();
    let email = $("input[name='reg_email']").val();
    let code = $("input[name='code']").val();

    $.ajax({
        type: "POST",
        url: url,
        data: {
            name: name,
            email: email,
            code: code,
            password: password,
        },
        success: (res) => {
            if (res.code !== 0) {
                $(".error-tip").show().html('<i class="fa fa-close"></i> ' + res.message);
            } else {
                $.cookie('token', res.token, {expires: 7, path: "/"});
                location.href = res.redirect;
            }
        }, complete: (res) => {
            setTimeout(() => {
                enableBtn(".register-submit");
            }, 1000)
        }
    });
});

$(document).on("click", ".email-code-submit", function (e) {
    e.preventDefault();
    $(".error-tip").hide();
    disableBtn(".email-code-submit");
    let url = $(this).data('url');
    let email = $("input[name='reg_email']").val();
    $.ajax({
        type: "POST",
        url: url,
        data: {
            email: email,
        },
        success: (res) => {
            if (res.code !== 0) {
                $(".error-tip").show().html('<i class="fa fa-close"></i> ' + res.message);
            }
        }, complete: (res) => {
            setTimeout(() => {
                enableBtn(".email-code-submit");
            }, 5000)
        }
    });
});

$(document).on("click", ".return-article-btn", function (e) {
    let id = $(this).data('id');
    let url = $(this).data('url');
    swal.fire({
        title: '请填写退款理由（影响审核结果）',
        input: 'textarea',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
    }).then(function (remark) {
        if (typeof remark.dismiss == "undefined") {
            showConfirm('退款确认[极其重要]', '一旦退款成功，你将无法查看此文隐藏内容（且无法再次购买），包括作者后续更新下载链接你也无法看到，请确认你是否真的需要退款？', () => {
                showConfirm('再次确认[极其重要]', '顶部导航栏有帮助文档，如果是不会解压、不会安装，建议你先看帮助文档，因为个人问题退款，下次退款就会变得更加困难，即便如此你仍要退款吗？', () => {
                    showConfirm('最终确认[极其重要]', '这是最后一次确认，我们可以认为你是在阅读过[退款说明]的情况下申请的退款吗？', () =>{
                        refundSubmit(url, id, remark.value);
                    })
                })
            });
        }
    });
});

function refundSubmit(url, id, content) {
    $.ajax({
        type: "POST",
        url: url,
        data: {
            id: id,
            content: content,
        },
        success: (res) => {
            if (res.code == 0) {
                showSuccess(res.message);
            } else {
                showError(res.message);
            }
        },
    });
}

$(document).on("click", ".report-submit", function (e) {
    let url = $(this).data("url");
    let id = $(this).data("id");
    swal.fire({
        title: '请填写举报内容',
        input: 'textarea',
        showCancelButton: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        allowOutsideClick: false
    }).then(function (remark) {
        if (typeof remark.dismiss == "undefined") {
            reportSubmit(url, id, remark.value);
        }
    });
});

function reportSubmit(url, id, remark) {
    $.ajax({
        type: "POST",
        url: url,
        data: {
            id: id,
            content: remark,
        },
        success: (res) => {
            if (res.code == 0) {
                showSuccess(res.message);
            } else {
                showError(res.message);
            }
        },
    });
}
