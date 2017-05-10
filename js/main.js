$(document).ready(function(){
    setTimeout(function(){
        var masterList = new CardList();
    },500);
});

var CardList = function() {
    var cardlist = this;

    this.templateSource = $("#player-card-template").html();
    this.template = Handlebars.compile(this.templateSource);

    this.coverageTemplateSource = $("#coverage-template").html();
    this.coverage_template = Handlebars.compile(this.coverageTemplateSource);

    this.cards = [];

    this.filter_id = 'ringer';

    this.initial_player = GLOBALS.player || false;

    this.filterOffsetPos = $('#content').offset().top;

    this.size = $(window).width() > 1100 || $(window).width() <= 768 ? 'small' : 'medium';

    this.init = function() {
        this.windowResize();
        this.initEvents();
        this.scrollWatch();
        if(this.initial_player){
            cardlist.openPlayer();
        }
    }

    this.initEvents = function() {
        $('#item-list').on('click', '.toggle-card', this.toggleCard);
        $('#filters a').on('click', this.filter);
        $('#filter-bar').on('click', 'a', this.sort);
        $('.size-toggle').on('click', 'li', this.changeSize);
        $('.has-media').on('mouseenter', this.showMedia);
        $('.has-media').on('mouseleave', this.hideMedia);
        $('#mobile-nav').on('click', '.toggle-zone', this.toggleMobileNav);
        $('#mobile-nav').on('click', '.sort li', this.mobileSort);
        $('#mobile-nav').on('click', '.nav-filter a', this.mobileFilter);
        $('#mobile-nav .nav-switcher').on('click', 'a', this.mobileChangeSize);
        $(window).on('resize', this.windowResize);
        if(!GLOBALS.player){
            $(window).on('scroll', cardlist.scrollWatch);
        }
    }

    this.toggleMobileNav = function(){
        if($(window).scrollTop() < cardlist.filterOffsetPos){
            $('body,html').scrollTop((cardlist.filterOffsetPos + 1));
        }
        $('#mobile-nav').toggleClass('open');
    };

    this.mobileChangeSize = function(e){
        e.preventDefault();
        $('#mobile-nav .nav-switcher a').removeClass('active color-theme');
        $(e.target).addClass('active color-theme');
        $('#mobile-nav .size-toggle li[data-size="' + $(this).data('size') + '"]').click();
        $('#mobile-nav').removeClass('open');
    }

    this.mobileSort = function(e){
        e.preventDefault();
        $('#mobile-nav .sort li').removeClass('active color-theme');
        $(e.target).addClass('active color-theme');
        cardlist.sort(e);
        $('#mobile-nav').removeClass('open');
    }

    this.mobileFilter = function(e){
        e.preventDefault();
        cardlist.filter(e);
        $('#mobile-nav').removeClass('open');
    }

    this.windowResize = function(){
        var windowWidth = $(window).width();
        clearTimeout(cardlist.sizeTimeout);
        cardlist.sizeTimeout = setTimeout(function(){
            windowWidth = $(window).width();
            cardlist.filterOffsetPos = $('#content').offset().top;
            cardlist.size = windowWidth > 1100 ? 'small' : 'medium';
        },250);
        $('.card-item:not(.large)').removeClass('small medium').addClass(cardlist.size);
        if(windowWidth < 1100 && windowWidth > 767 ){
            $('body').removeClass('mobile');
            $('body').addClass('tablet no-transition');
        } else if(windowWidth < 768){
            $('body').removeClass('tablet');
            $('body').addClass('mobile no-transition');
        } else {
            $('body').addClass('no-transition');
            $('body').removeClass('tablet mobile');
        }
        setTimeout(function(){
            $('body').removeClass('no-transition');
        },100);
    };

    this.openPlayer = function() {
        var openCard = $('.card-item[data-id="' + GLOBALS.player + '"]');
        var openScollPos = openCard.offset().top - 100;
        var timeout = false;
        $('body').addClass('filter-fixed');
        $('body,html').animate({scrollTop: openScollPos}, function(){
            clearTimeout(timeout);
            timeout = setTimeout(function(){
                openCard.addClass('expanded');
                $(window).on('scroll.scrollWatch', cardlist.scrollWatch);
            },100);
        });
    }

    this.toggleCard = function(e) {
        var id = $(this).data('id'),
            card = $('.card-item[data-id="' + id + '"]');

        if(card.hasClass('expanded-card')){
            card.removeClass('small medium large expanded expanded-card').addClass(cardlist.size);
            setTimeout(function(){
                cardlist.setHeight(card);
            },250);
        } else {
            card.removeClass('small medium large expanded').addClass('large expanded-card')
            setTimeout(function(){
                cardlist.setHeight(card, 'large');
            },250);
        }
    }

    this.changeSize = function(e){
        e.preventDefault();
        cardlist.size = $(this).data('size');
        $('.size-toggle .active').removeClass('active background-theme');
        $(this).addClass('active background-theme');
        $('.card-item').removeClass('small medium large expanded expanded-card').addClass($(this).data('size'));
        setTimeout(function(){
            _.each($('.card-item'), function(cardItem){
                cardlist.setHeight(cardItem);
            });
        },250);

    };

    this.setHeight = function(el, size) {
        var $el = $(el),
            size = size || cardlist.size
            height = 0;
            if(size === 'medium'){
                height = $el.find('.medium-show').outerHeight(true);
                height += (parseInt($el.find('.info-column').css('padding-top'),10) * 2);
            } else if(size === 'large'){
                height = $el.find('.info-column').outerHeight(true);
            } else{
                height = 145;
            }

            $el.css({'max-height': height + 'px'});
    }

    this.scrollWatch = function() {

        var scrollPos = $(window).scrollTop();
        if(scrollPos > cardlist.filterOffsetPos){
            // $('#filter-bar-wrapper').css({'width': $('#main-content').width() + 'px' });
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.showMedia = function() {
        var showMedia   = $(this).data('media'),
            mediaBG     = $('.plus-minus-media[data-id="'+showMedia+'"]').css('background-image');
        $(this).addClass('color-theme');
        $('.player-stat-image').addClass('media-shown');
        $('.plus-minus-media[data-id="'+showMedia+'"]').addClass('visible');
        $('.plus-minus-media[data-id="'+showMedia+'"] img').attr('src', '');
        $('.plus-minus-media[data-id="'+showMedia+'"] img').attr('src', showMedia);
    }

    this.hideMedia = function() {
        var hideMedia = $(this).data('media');
        $(this).removeClass('color-theme');
        $('.player-stat-image').removeClass('media-shown');
        $('.plus-minus-media[data-id="'+hideMedia+'"]').removeClass('visible');
    }

    this.setColors = function(filter_id) {
        $('body').removeClass('ringer kevin danny johnathan az');
        $('body').addClass(filter_id);
        var selected_color = GLOBALS.theme_colors[filter_id];
        $('.stroke').attr('style', "stroke:"+selected_color + ' !important');
        $('.arrow').attr('style', "fill:"+selected_color + ' !important');
    }

    this.sort = function(e){
        e.preventDefault();
        var player,
            coverage_count = 5;

        $('.active_filter').removeClass('active_filter');
        $(e.currentTarget).addClass('active_filter');
        $('#item-list').addClass('sorting');

        cardlist.filter_id = $(e.target).data('filter-id');
        cardlist.article_base = 0;
        cardlist.buildList(GLOBALS.data.players);
    }

    this.filter = function(e){
        var players,
            filter;

        $('#filters a.active').removeClass('active color-theme');
        $(e.currentTarget).addClass('active color-theme');
        $('body').removeClass('filters-open');
        if($(window).scrollTop() > cardlist.filterOffsetPos){
            $('body,html').animate({scrollTop:cardlist.filterOffsetPos+1});
        }
        filter = $(e.currentTarget).data('filter');
        $('#item-list').addClass('sorting');

        cardlist.coverage_count = 5;
        cardlist.article_base = 0;
        if(filter === 'all'){
            players = GLOBALS.data.players;
        } else {
            players = _.where(GLOBALS.data.players, {position_group: filter});
        }
        cardlist.buildList(players);

    }

    this.buildPlayer = function(index, player, delay){
        var more_coverage = {};
        cardlist.coverage_count--;
        player.id = parseInt(index,10)+1;
        player.rank =  ("0" + player.id).slice(-2);
        player.className = 'sorted';
        $('#item-list').append(cardlist.template(player));
        console.log(delay);
        setTimeout(function(){
            console.log('here');
            $('#item-list .card-item[data-id="' + player.id + '"]').addClass('shown');
        },delay);

        if(cardlist.coverage_count === 0){
            cardlist.coverage_count = 5;
            more_coverage.articles = GLOBALS.more_coverage_articles.articles.slice((cardlist.article_base * 3), (cardlist.article_base * 3) + 3);
            $('#item-list').append(cardlist.coverage_template(more_coverage));
            cardlist.article_base++;
        }
    }

    this.buildList = function(players) {
        setTimeout(function(){
            if($(window).scrollTop() > cardlist.filterOffsetPos){
                $('body,html').animate({scrollTop:cardlist.filterOffsetPos + 1});
            }
            $('#item-list').removeClass('sorting');
            $('#item-list').empty();
            cardlist.coverage_count = 5;
            var playerCount = 0;
            _.each(GLOBALS.list[cardlist.filter_id], function(player, index){
                player = _.findWhere(players, { filter_id: player.filter_id});
                if(player){
                    var delay = (playerCount * 125);
                    playerCount++;
                    cardlist.buildPlayer(index,player,delay);
                }
            });
            cardlist.setColors(cardlist.filter_id);
        },250);
    }

    this.init();

    return cardlist;
}
