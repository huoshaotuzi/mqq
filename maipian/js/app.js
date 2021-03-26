// 懒加载
$(document).ready(function () {
    $("img").lazyload();
});

// 手机端搜索按键
$('#phone-search-from-sub-btn').on('click', () => {

    let wd = $('#phone-word').val();

    window.location.href = "/search?wd=" + wd;

});

var Search = {

    search: function () {
        var word = Search.$form.find('.word').val();
        word = word.replace(/\//g, ' ');
        word = $.trim(word);
        if (word !== '') {
            location.href = '/search?wd=' + encodeURIComponent(word);
        }
    },

    searchByKeyboard: function (event) {
        if (event.which === 13) {
            Search.search();
        }
    },

    inputFocus: function () {
        $(this).parent().addClass('-active');
    },

    inputBlur: function () {
        $(this).parent().removeClass('-active');
    },

    init: function ($parent) {
        this.$parent = $parent;
        this.$form = $parent;
        this.$form.on('focus', 'input', this.inputFocus);
        this.$form.on('blur', 'input', this.inputBlur);
        this.$form.on('click', '#search-from-sub-btn', this.search);
        this.$form.on('keydown', '.word', this.searchByKeyboard);
    }

};

$(document).ready(function () {
    Search.init($('.search-form'));
});
