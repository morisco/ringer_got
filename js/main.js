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

    this.init = function() {
        this.initEvents();
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
        $(window).on('resize', function(){
            clearTimeout(cardlist.sizeTimeout);
            cardlist.sizeTimeout = setTimeout(function(){
                cardlist.filterOffsetPos = $('#content').offset().top;
                // $('#filter-bar-wrapper').css({'width': $('#main-content').width() + 'px' });
            },250);
        });

        if(!GLOBALS.player){
            $(window).on('scroll', cardlist.scrollWatch);
        }
    }

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
        var id = $(this).data('id');
        $('.card-item[data-id="' + id + '"]').toggleClass('expanded');
    }

    this.changeSize = function(){
        $('.size-toggle .active').removeClass('active background-theme');
        $(this).addClass('active background-theme');
        $('.card-item').removeClass('small medium large expanded').addClass($(this).data('size'));
        _.each($('.card-item'), function(cardItem){
            cardlist.setHeight(cardItem, $(this).data('size'));
        });
    };

    this.setHeight = function(el, size) {
        var $el = $(el),
            height = 0;
            console.log('pad-top-info-col', parseInt($el.find('.info-column').css('padding-top'), 10))
            console.log('pad-bot-info-col', parseInt($el.find('.info-column').css('padding-bottom'), 10))
            console.log('height-player-main', parseInt($el.find('.player-main').outerHeight(), 10))
            console.log('pad-top-player-info', parseInt($el.find('.player-info').css('padding-top'), 10) || 30)
            console.log('height-player-meta', parseInt($el.find('.player-meta').outerHeight(), 10))
            console.log('padding-top-player-desc', parseInt($el.find('.player-description').css('padding-top'), 10));
            console.log('margin-top-player-desc', parseInt($el.find('.player-description').css('margin-top'), 10));
            console.log('height-player-desc', parseInt($el.find('.player-description').outerHeight(), 10));
            height = height + parseInt($el.find('.info-column').css('padding-top'), 10);
            height = height + parseInt($el.find('.info-column').css('padding-bottom'), 10);
            height = height + parseInt($el.find('.player-main').outerHeight(), 10);
            height = height + parseInt($el.find('.player-info').css('padding-top'), 10);
            height = height + parseInt($el.find('.player-meta').outerHeight(), 10);
            height = height + parseInt($el.find('.player-description').css('margin-top'), 10);
            height = height + parseInt($el.find('.player-description').outerHeight(), 10);
            console.log(height);
    }

    this.scrollWatch = function() {
        var scrollPos = $(window).scrollTop(),
            marginTop = scrollPos - cardlist.filterOffsetPos;
        if(scrollPos > cardlist.filterOffsetPos && $(window).width() > 768){
            // $('#filter-bar-wrapper').css({'width': $('#main-content').width() + 'px' });
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.showMedia = function() {
        var showMedia = $(this).data('media');
        $(this).addClass('color-theme');
        $('.player-stat-image').addClass('media-shown');
        $('.plus-minus-media[data-id="'+showMedia+'"]').addClass('visible');
    }

    this.hideMedia = function() {
        var hideMedia = $(this).data('media');
        $(this).removeClass('color-theme');
        $('.player-stat-image').removeClass('media-shown');
        $('.plus-minus-media[data-id="'+hideMedia+'"]').removeClass('visible');
    }

    this.setColors = function(filter_id) {
        var colors = {
            'ringer': '#43be6d',
            'kevin': '#ffff00',
            'danny': '#00adef',
            'johnathan': '#c800ff',
            'a_z': '#0043cc'
        };
        var selected_color = colors[filter_id];
        $('.background-theme').css({'background-color': selected_color + ' !important'});
        $('.border-theme').css({'border-color': selected_color});
        $('.border-theme-before').removeClass('ringer kevin danny johnathan a_z').addClass(filter_id);
        $('.background-theme-after').removeClass('ringer kevin danny johnathan a_z').addClass(filter_id);
        $('.color-theme').css({'color': selected_color + ' !important'});
        $('a.active').css({'color': selected_color + ' !important'});
        $('.stroke').attr('style', "stroke:"+selected_color + ' !important');
        $('.arrow').attr('style', "fill:"+selected_color + ' !important');
    }

    this.sort = function(e){
        e.preventDefault();
        var player,
            coverage_count = 5;

        $('.active_filter').removeClass('active_filter');
        $(this).addClass('active_filter');
        $('#item-list').addClass('sorting');

        cardlist.filter_id = $(this).data('filter-id');
        cardlist.article_base = 0;
        cardlist.buildList(GLOBALS.data.players);
    }

    this.filter = function(){

        var players,
            filter;
        $('#filters a.active').removeClass('active color-theme');
        $(this).addClass('active color-theme');
        if($(window).width() < 768 && !$('body').hasClass('filters-open')){
            $('body').addClass('filters-open');
            return;
        } else if($(window).width() < 768) {
            $('body').removeClass('filters-open');
            $('body,html').scrollTop(cardlist.filterOffsetPos);
        } else {
            $('body').removeClass('filters-open');
            if($(window).scrollTop() > cardlist.filterOffsetPos){
                $('body,html').scrollTop(cardlist.filterOffsetPos);
            }
        }

        filter = $(this).data('filter');
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

    this.buildPlayer = function(index, player){
        var more_coverage = {};
        cardlist.coverage_count--;
        player.id = parseInt(index,10)+1;
        player.rank =  ("0" + player.id).slice(-2);
        player.className = 'sorted';
        $('#item-list').append(cardlist.template(player));
        setTimeout(function(){
            $('#item-list .card-item[data-id="' + player.id + '"]').addClass('shown');
        },index * 125);

        if(cardlist.coverage_count === 0){
            cardlist.coverage_count = 5;
            more_coverage.articles = GLOBALS.more_coverage_articles.articles.slice((cardlist.article_base * 3), (cardlist.article_base * 3) + 3);
            $('#item-list').append(cardlist.coverage_template(more_coverage));
            cardlist.article_base++;
        }
    }

    this.buildList = function(players) {
        setTimeout(function(){
            $('html,body').scrollTop($('#item-list').offset().top - 130);
            $('#item-list').removeClass('sorting');
            $('#item-list').empty();
            cardlist.coverage_count = 5;
            var playerCount = 0;
            _.each(GLOBALS.list[cardlist.filter_id], function(player, index){
                player = _.findWhere(players, { filter_id: player.filter_id});
                if(player){
                    cardlist.buildPlayer(index,player);
                    playerCount++;
                }
            });
            cardlist.setColors(cardlist.filter_id);
        },250);
    }

    this.init();

    return cardlist;
}
