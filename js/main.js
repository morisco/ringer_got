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
        $('#filter-bar').on('click', 'a', this.sort);
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
        var id = $(this).data('id');
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

    this.sort = function(e){
        e.preventDefault();
        var filter_id = $(this).data('filter-id'),
            player;

        $('.active_filter').removeClass('active_filter');
        $(this).addClass('active_filter');
        $('#item-list').empty();
        _.each(GLOBALS.list[filter_id], function(player, index){
            player = _.findWhere(GLOBALS.data.players, { filter_id: player.filter_id});
            if(player){
                player.id = parseInt(index,10)+1;
                player.rank =  ("0" + player.id).slice(-2);
                player.className = 'sorted';
                $('#item-list').append(cardlist.template(player));
                setTimeout(function(){
                    $('#item-list .card-item[data-id="' + player.id + '"]').addClass('shown');
                },index * 250);
            }
        });
        cardlist.setColors(filter_id);
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
        $('.background-theme').css({'background-color': selected_color});
        $('.border-theme').css({'border-color': selected_color});
        $('.border-theme-before').removeClass('ringer kevin danny johnathan a_z').addClass(filter_id);
        $('.background-theme-after').removeClass('ringer kevin danny johnathan a_z').addClass(filter_id);
        $('.color-theme').css({'color': selected_color});
        $('a.active').css({'color': selected_color});
        $('.stroke').attr('style', "stroke:"+selected_color);
        $('.arrow').attr('style', "fill:"+selected_color);
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
