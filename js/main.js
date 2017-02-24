$(document).ready(function(){
    var masterList = new CardList();
});

var CardList = function() {
    var cardlist = this;

    this.templateSource = $("#food-card-template").html();
    this.template = Handlebars.compile(this.templateSource);

    this.cards = [];

    this.init = function() {
        this.getData();
        this.initEvents();
    }

    this.initEvents = function() {
        $('#filters a').on('click', this.filter);
    }

    this.filter = function(){

        if($(window).width() < 768 && !$('body').hasClass('filters-open')){
            $('body').addClass('filters-open');
            return;
        } else {
            $('body').removeClass('filters-open');
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

    this.getData = function() {
        $.getJSON( "data/cards.json", function(data) {
            cardlist.cards = data.cards;
            cardlist.buildList(cardlist.cards);
        }) 
        .fail(function(data) {
            console.log( "ERROR: Cards did not load" );
        });
    };

    this.buildList = function(cards) {
        $('#item-list').empty();
        $.each(cards, function(index){
            this.displayOrder = index + 1;
            $('#item-list').append(cardlist.template(this));
        });
    }

    this.init();

    return cardlist;
}