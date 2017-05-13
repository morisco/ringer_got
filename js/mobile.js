function Mobile(list) {
    var mobile = this;
        mobile.list = list;
        mobile.filterOffsetPos = $('#content').offset().top;
        mobile.size = 'medium';


    mobile.init = function(){
        mobile.initEvents();
    }

    mobile.initEvents = function(){
        $('#mobile-nav').on('click', '.toggle-zone', mobile.toggleMobileNav);
        $('#mobile-nav').on('click', '.sort li', mobile.mobileSort);
        $('#mobile-nav').on('click', '.nav-filter a', mobile.mobileFilter);
        $('#mobile-nav .nav-switcher').on('click', 'a', mobile.mobileChangeSize);
    }

    this.toggleMobileNav = function(){
        window.clearTimeout(mobile.navTimeout);
        if($(window).scrollTop() < mobile.filterOffsetPos && !$('#mobile-nav').hasClass('open')){
            $('body,html').scrollTop((mobile.filterOffsetPos + 1));
        }

        $('#mobile-nav').toggleClass('open');
        $('body').off("click.clickout");
        mobile.navTimeout = setTimeout(function(){
            if($('#mobile-nav').hasClass('open')){
                $('body').on("click.clickout", function(e){
                    if(!$(e.target).hasClass('toggle-zone') && $(e.target).parents('#mobile-nav').length == 0){
                        $('#mobile-nav').removeClass('open');
                        $('body').off("click.clickout");
                    }
                });
            }
        }, 500);
    };

    this.mobileChangeSize = function(e){
        e.preventDefault();
        var newSize = $(this).data('size');
        $('#mobile-nav').removeClass('open');

        mobile.old_size = mobile.size;
        mobile.size = $(this).data('size');
        events.publish('size.update', {size: mobile.size});
        transitionClass = mobile.old_size + '-to-' + mobile.size;

        $('.size-indicator').attr('class', 'size-indicator').addClass(mobile.size);
        $('#mobile-nav .size-toggle .active').removeClass('active background-theme');
        $('#mobile-nav .size-toggle li[data-size="'+mobile.size+'"]').addClass('active background-theme');
        $('#mobile-nav .nav-switcher a').removeClass('active color-theme');
        $(e.target).addClass('active color-theme');

        $('body').removeClass('small medium large').addClass(mobile.size + ' ' + transitionClass);
    }

    mobile.mobileSort = function(e){
        e.preventDefault();
        $('#mobile-nav').removeClass('open');
        setTimeout(function(){
            $('#mobile-nav .sort li').removeClass('active color-theme');
            $(e.target).addClass('active color-theme');
            mobile.list.sort(e);
        },100);
    }

    mobile.mobileFilter = function(e){
        e.preventDefault();
        setTimeout(function(){
            mobile.list.filter(e);
            $('#mobile-nav').removeClass('open');
        },100)
    }

    mobile.init();

    return mobile;
};
