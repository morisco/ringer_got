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

    this.size = 'small';

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

        // if(card.hasClass('expanded')){
        //     card.removeClass('expanded');
        //     card.addClass(cardlist.size);
        //     setTimeout(function(){
        //         cardlist.setHeight(card, cardlist.size);
        //     },250);
        // } else {
        //     card.addClass('large expanded');
        //     setTimeout(function(){
        //         cardlist.setHeight(card);
        //     },250)
        // }

    }

    this.changeSize = function(){
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
            $('body,html').animate({scrollTop:cardlist.filterOffsetPos});
        } else {
            $('body').removeClass('filters-open');
            if($(window).scrollTop() > cardlist.filterOffsetPos){
                $('body,html').animate({scrollTop:cardlist.filterOffsetPos});
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
            if($(window).scrollTop() > cardlist.filterOffsetPos){
                $('body,html').animate({scrollTop:cardlist.filterOffsetPos});
            }
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
