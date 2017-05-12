$(document).ready(function(){
    setTimeout(function(){
        var masterList = new CardList();
    },500);
});

var CardList = function() {
    var cardlist = this;

    this.$el = $('#item-list');

    this.templateSource = $("#player-card-template").html();
    this.template = Handlebars.compile(this.templateSource);

    this.coverageTemplateSource = $("#coverage-template").html();
    this.coverage_template = Handlebars.compile(this.coverageTemplateSource);

    this.cards = [];

    this.sort_id = GLOBALS.current_sort;
    this.filter_id = 'all';

    this.initial_player = GLOBALS.player || false;

    this.filterOffsetPos = $('#content').offset().top;

    this.size = 'medium';
    this.cards = [];

    this.init = function() {
        this.windowResize();
        this.initEvents();
        this.scrollWatch();
        if(this.initial_player){
            cardlist.openPlayer();
        }
        this.initCards();
    }

    this.initCards = function(){
        var playerCard;
        var playerCount = 0;
        _.each(GLOBALS.list[cardlist.sort_id], function(player, index){
            var id = player.filter_id;
            player = _.findWhere(GLOBALS.data.players, { filter_id: id});
            if(player){
                playerCount++;
                playerCard = new Card(playerCount, player);
                cardlist.cards.push(playerCard);
            } else{
                console.log('missing player', id);
            }
        });
    }


    this.initEvents = function() {

        $('#filters a').on('click', this.filter);
        $('#filter-bar').on('click', 'a', this.sort);
        $('.size-toggle').on('click', 'li', this.changeSize);

        $('.size-toggle').on('mouseenter', 'li', this.previewSize);
        $('.size-toggle').on('mouseleave', 'li', this.revertSize);

        $('#mobile-nav').on('click', '.toggle-zone', this.toggleMobileNav);
        $('#mobile-nav').on('click', '.sort li', this.mobileSort);
        $('#mobile-nav').on('click', '.nav-filter a', this.mobileFilter);
        $('#mobile-nav .nav-switcher').on('click', 'a', this.mobileChangeSize);
        $(window).on('resize', this.windowResize);
        if(!GLOBALS.player){
            $(window).on('scroll', cardlist.scrollWatch);
        }
    }

    this.previewSize = function(){
        cardlist.size_preview = $(this).data('size');
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size_preview);
    };

    this.revertSize = function(){
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size);
    };

    this.toggleMobileNav = function(){
        if($(window).scrollTop() < cardlist.filterOffsetPos && !$('#mobile-nav').hasClass('open')){
            $('body,html').scrollTop((cardlist.filterOffsetPos + 1));
        }

        $('#mobile-nav').toggleClass('open');
        if($('#mobile-nav').hasClass('open')){
            $('body').on("click.clickout", function(e){
                if(!$(e.target).hasClass('toggle-zone') && $(e.target).parents('#mobile-nav').length == 0){
                    cardlist.toggleMobileNav();
                }
            });
        } else {
            $('body').off("click.clickout");
        }

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

    this.changeSize = function(e){
        e.preventDefault();
        var transitionClass;
        cardlist.old_size = cardlist.size;
        cardlist.size = $(this).data('size');
        transitionClass = cardlist.old_size + '-to-' + cardlist.size;
        $('.size-indicator').attr('class', 'size-indicator').addClass(cardlist.size);
        $('.size-toggle .active').removeClass('active background-theme');
        $(this).addClass('active background-theme');
        $('.card-item').removeClass('small medium large expanded expanded-card small-to-large small-to-medium medium-to-small medium-to-large large-to-medium large-to-small').addClass(transitionClass + ' ' + cardlist.size);
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
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.setColors = function() {
        var color = GLOBALS.theme_colors[cardlist.sort_id];
        $('body').removeClass('ringer kevin danny jonathan az');
        $('body').addClass(cardlist.sort_id);
        $('.stroke').attr('style', 'stroke:' + color + ';');
        $('.arrow').attr('style', 'fill:' + color + ';');

    }

    this.sort = function(e){
        e.preventDefault();
        var player,
            coverage_count = 5;

        $('.active_filter').removeClass('active_filter');
        $(e.currentTarget).addClass('active_filter');
        cardlist.sort_id = $(e.currentTarget).data('sort-id');
        cardlist.setColors();
        events.publish('sort.update', {});
        cardlist.buildList(GLOBALS.data.players);
    }

    this.filter = function(e){
        cardlist.filter_id = $(e.currentTarget).data('filter');

        $('#filters a.active, #mobile-nav .nav-filter a').removeClass('active color-theme');
        $(e.currentTarget).addClass('active color-theme');

        if($(window).scrollTop() > cardlist.filterOffsetPos){
            $('body,html').animate({scrollTop:cardlist.filterOffsetPos+1});
        }

        if(cardlist.filter_id === 'all'){
            cardlist.$el.removeClass('filtered');
        } else {
            cardlist.$el.addClass('filtered');
        }

        events.publish('filter.update', { filter: cardlist.filter_id });
    }

    this.buildList = function() {
        var playerCount = 0;
        _.each(GLOBALS.list[cardlist.sort_id], function(player, index){
            player = _.findWhere(GLOBALS.data.players, { filter_id: player.filter_id});
            if(player){
                if(cardlist.cards[index]){
                    playerCount++;
                    cardlist.cards[index].update(player);
                }
            }
        });
    }

    this.init();

    return cardlist;
}
