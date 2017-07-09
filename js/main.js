$(window).load(function () {
    var masterList = new CardList();
    // var mobile = new Mobile(masterList);
});

function CardList() {
    var cardlist = this;

    this.$el = $('#item-list');
    this.sort_id = GLOBALS.current_sort;

    this.initial_episode = GLOBALS.episode || false;

    this.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
    this.filterResetPos = this.filterOffsetPos + $('#filter-bar').height() + 38;

    this.size = 'medium';

    this.init = function() {
        this.windowResize();
        this.initEvents();
        if(this.initial_episode){
            cardlist.openCard();
        }
    }

    this.initEvents = function() {
        $('header').on('click', '.fixed-nav a:not(.active_filter)', this.sort);
        $('#filter-bar').on('click', '.filter:not(.active_filter)', this.sort);
        $(window).on( "orientationchange", this.orientationChange );

        $('.mobile header:not(.open)').on('click', ' .fixed-nav', this.toggleNav);
        $('.mobile header').on('click', ' .close-nav', this.toggleNav);

        $(window).on('resize', this.windowResize);
        if(!cardlist.initial_episode){
            $(window).on('scroll', cardlist.scrollWatch);
            cardlist.scrollWatch();
        }
    }

    this.toggleNav = function(){
        $('header').toggleClass('open');
    };

    this.orientationChange = function(){
        setTimeout(function(){
            cardlist.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
        }, 500);
    };

    this.windowResize = function(){
        var windowWidth = $(window).width();
        clearTimeout(cardlist.sizeTimeout);
        cardlist.sizeTimeout = setTimeout(function(){
            windowWidth = $(window).width();
            cardlist.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
        },250);
        // $('.card-item:not(.large)').removeClass('small medium').addClass(cardlist.size);
        if(windowWidth < 1100 && windowWidth > 767 ){
            $('body').removeClass('mobile');
            $('body').addClass('tablet no-transition');
        } else if(windowWidth < 768){
            $('body').removeClass('tablet');
            $('body').addClass('mobile no-transition');
        } else {
            $('.image-column img').each(function(){
                $(this).attr('src', $(this).data('src'));
            });
            $('body').addClass('no-transition');
            $('body').removeClass('tablet mobile');
        }
        setTimeout(function(){
            $('body').removeClass('no-transition');
        },100);
    };

    this.openCard = function() {
        var timeout = false,
            openCard = $('.card-item.episode-' + this.initial_episode),
            openScrollPos = openCard.offset().top,
            scrollOffset = $(window).width() < 768 ? 50 : 100;

            $('body').addClass('filter-fixed');
            $('body,html').animate({scrollTop: openScrollPos - scrollOffset}, function(){
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    $(window).on('scroll.scrollWatch', cardlist.scrollWatch);
                },100);
            });

    }

    this.scrollWatch = function() {
        var scrollPos = $(window).scrollTop();
        if(scrollPos > cardlist.filterOffsetPos){
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.sort = function(e){
        e.preventDefault();
        e.stopPropagation();
        if(cardlist.sort_id  == $(e.currentTarget).data('sort-id')){
            return;
        }

        var player,
            coverage_count = 5;
        cardlist.$el.addClass('filtered');
        $('.active_filter').removeClass('active_filter');
        $('header').removeClass('open');
        $('header .fixed-nav a[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').addClass('active_filter');
        $('header .fixed-nav a[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').parent().addClass('active_filter');
        $('.filter[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').addClass('active_filter');
        $(e.currentTarget).addClass('active_filter');
        cardlist.sort_id = $(e.currentTarget).data('sort-id');
        cardlist.$el.removeClass('season-1 season-2 season-3 season-4 season-5 season-6 all');
        if(cardlist.sort_id === 'all'){
            cardlist.$el.removeClass('filtered');
        } else {
            cardlist.$el.addClass('season-' + cardlist.sort_id);
        }
        if($(window).scrollTop() > cardlist.filterOffsetPos){
            if($(window).width() < 767){
                $('html,body').scrollTop(cardlist.filterResetPos);
            } else {
                $('body,html').animate({scrollTop:cardlist.filterResetPos});
            }
        }
    }

    this.init();

    return cardlist;
}
