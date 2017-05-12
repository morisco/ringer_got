function Card(id, data){
    var card = this;

    this.data = data;
    this.id = id;
    this.el = $('.card-item[data-id="'+this.id+'"]');
    this.size = 'medium';

    this.infoTemplateSource = $("#info-template").html();
    this.infoTemplate = Handlebars.compile(this.infoTemplateSource);


    this.init = function(){
        this.initEvents();
    };

    this.initEvents = function(){
        events.subscribe('filter.update', this.filter);
        events.subscribe('sort.update', this.sort);
        this.el.on('mouseenter', this.loadGifs)
        this.el.find('.has-media').on('mouseenter', this.showMedia);
        this.el.find('.has-media').on('mouseleave', this.hideMedia);
        this.el.on('click', '.toggle-card', this.toggleCard);
    };


    this.toggleCard = function(e) {
        if(card.el.hasClass('expanded-card')){
            card.el.removeClass('small medium large expanded expanded-card').addClass(card.size);
        } else {
            card.el.removeClass('small medium large expanded').addClass('large expanded-card')
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

    this.loadGifs = function(){
        if(card.loaded)
            return;
        card.loaded = true;
        _.each(card.el.find('.plus-minus-media'), function(el){
            var img = $(el).find('img');
            img.attr('src', img.data('src') );
        })
    }

    this.filter = function(obj){
        if(obj.filter === 'all' || card.data.position_group.toLowerCase() === obj.filter){
            card.el.removeClass('unfiltered');
        } else {
            card.el.addClass('unfiltered');
        }
        card.el.addClass('sort');
        setTimeout(function(){
            card.el.removeClass('sort');
        },500)
    };

    this.sort = function(){

    }

    this.update = function(new_player){
        this.data = new_player;
        this.loaded = false;
        $(this.el).css('max-height', $(this.el).outerHeight());
        $(this.el).addClass('rebuilding');
        $(this.el).addClass('rebuilding');
        setTimeout(function(){
            $(card.el).find('.info-column').empty();
            $(card.el).find('.info-column').append(card.infoTemplate(card.data));
            $(card.el).removeClass('rebuilding');
            $(card.el).removeAttr('style');
        }, 500);
    }

    this.init();

    return card;
}
