$(document).ready(function(){
    var masterList = new CardList();
    var filters = new Filters();
});

var CardList = function() {
    var cardlist = this;

    this.cards = [];

    this.init = function(){
        this.getData();
    }

    this.getData = function() {
        $.getJSON( "data/cards.json", function(data) {
            cardlist.cards = data.cards;
        }) 
        .fail(function(data) {
            console.log(arguments);
            console.log( "error" );
        });
    };

    this.init();

    return cardlist;
}

var Filters = function(data) {
    var filters = this;

    filters.init = function() {
        console.log(data);
    };

    filters.init(data);
    return filters
}