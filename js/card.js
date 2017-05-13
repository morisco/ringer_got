function Card(id, data){
    var card = this;

    this.data = data;
    this.id = id;
    this.el = $('.card-item[data-id="'+this.id+'"]');
    this.size = 'medium';
    this.sort = GLOBALS.current_sort;

    this.infoTemplateSource = $("#info-template").html();
    this.infoTemplate = Handlebars.compile(this.infoTemplateSource);

    this.init = function(){
        this.initEvents();
    };

    this.initEvents = function(){
        events.subscribe('filter.update', this.filter);
        events.subscribe('sort.update', this.sortChange);
        events.subscribe('size.update', this.size);
        this.el.on('mouseenter', this.loadGifs);
        this.el.on('mouseenter', this.showColor);
        this.el.on('mouseleave', this.hideColor);
        this.el.find('.has-media').on('mouseenter', this.showMedia);
        this.el.find('.has-media').on('tap', this.showMedia);
        this.el.find('.has-media').on('mouseleave', this.hideMedia);
        this.el.on('click', '.toggle-card', this.toggleCard);
    };


    this.toggleCard = function(e) {
        card.el.toggleClass('expanded-card');
        if(card.el.hasClass('expanded-card')){
            card.hideColor();
        }
    }

    this.showColor = function(){
        if(!card.el.hasClass('expanded-card') && ($('body').hasClass('small') || $('body').hasClass('medium'))){
            card.el.find('.info-column').attr('style', 'color:' + (GLOBALS.theme_colors[card.sort] + '!important;'));
            card.el.find('.info-column .stat-wrap').attr('style', 'border-color:' + (GLOBALS.theme_colors[card.sort] + '!important;'));
        }
    }

    this.hideColor = function(){
        card.el.find('.info-column').removeAttr('style');
        card.el.find('.info-column .stat-wrap').removeAttr('style');
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
        
    };

    this.sortChange = function(obj){
        card.sort = obj.sort;
    };

    this.size = function(obj){
        card.size = obj.size;
    };

    this.update = function(new_player){
        this.data = new_player;
        this.loaded = false;
        var delay = $('body').hasClass('mobile') ? 2000 : 1500;
        setTimeout(function(){
            $(card.el).find('.info-column').html(card.infoTemplate(card.data));
        }, delay);
    }

    this.init();

    return card;
}
