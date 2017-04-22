$(document).ready(function(){
    setTimeout(function(){
        var masterList = new CardList();
    },500);
});

var CardList = function() {
    var cardlist = this;

    this.templateSource = $("#player-card-template").html();
    this.template = Handlebars.compile(this.templateSource);

    this.cards = [];

    this.initial_player = GLOBALS.player || false;

    this.filterOffsetPos = $('#content').offset().top - 30;

    this.init = function() {
        this.initEvents();
        if(this.initial_player){
            cardlist.openPlayer();
        }
    }

    this.initEvents = function() {
        $('#item-list').on('click', '.toggle-card', this.toggleCard);
        $('#filters a').on('click', this.filter);
        $('.size-toggle').on('click', 'li', this.changeSize);
        $('.has-media').on('mouseenter', this.showMedia);
        $('.has-media').on('mouseleave', this.hideMedia);
        $(window).on('resize', function(){
            clearTimeout(cardlist.sizeTimeout);
            cardlist.sizeTimeout = setTimeout(function(){
                cardlist.filterOffsetPos = $('#content').offset().top - 30;
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
        var id = $(e.target).data('id');
        $('.card-item[data-id="' + id + '"]').toggleClass('expanded');
    }

    this.changeSize = function(){
        $('.size-toggle .active').removeClass('active');
        $(this).addClass('active');
        $('.card-item').removeClass('small medium large expanded').addClass($(this).data('size'));
    };

    this.scrollWatch = function() {
        var scrollPos = $(window).scrollTop(),
            marginTop = scrollPos - cardlist.filterOffsetPos;
        if(scrollPos > cardlist.filterOffsetPos && $(window).width() > 768){
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.showMedia = function() {
        var showMedia = $(this).data('media');
        $('.player-stat-image').addClass('media-shown');
        $('.plus-minus-media[data-id="'+showMedia+'"]').addClass('visible');
    }

    this.hideMedia = function() {
        var hideMedia = $(this).data('media');
        $('.player-stat-image').removeClass('media-shown');
        $('.plus-minus-media[data-id="'+hideMedia+'"]').removeClass('visible');
    }

    this.filter = function(){
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

        var filter = $(this).data('filter');
        var cards = cardlist.cards.slice(0);
        var filtered_cards = cards;
        if(filter !== 'All') {
            var filtered_cards = _.filter(cards, function(card) { return card.category === filter; });
        }
        $("#filters .active").removeClass('active');
        $(this).addClass('active');
        cardlist.buildList(filtered_cards);
    }

    this.buildList = function(cards) {
        $('#item-list').empty();
        $.each(cards, function(index){
            this.displayOrder = index + 1;
            $('#item-list').append(cardlist.template(this));
        });
        $('body').addClass('loaded');
    }

    this.init();

    return cardlist;
}
