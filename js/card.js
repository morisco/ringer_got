function Card(id, data){
    var card = this;

    this.data = data;
    this.id = id;
    this.el = $('.card-item[data-id="'+this.data.filter_id+'"]');
    this.size = 'medium';
    this.sort = GLOBALS.current_sort;

    this.infoTemplateSource = $("#info-template").html();
    this.infoTemplate = Handlebars.compile(this.infoTemplateSource);


    this.coverageTemplateSource = $("#related-coverage-template").html();
    this.coverageTemplate = Handlebars.compile(this.coverageTemplateSource);

    this.init = function(){
        this.initEvents();
        card.data.coverage = $.map(card.data.coverage, function(value, index) {
            return [value];
        });

    };

    this.initEvents = function(){
        this.el.on('click.whole', this.toggleWholeCard);
        // this.el.on('click.gifs', this.loadGifs);
        this.el.on('mouseenter', this.showColor);
        // this.el.on('mouseenter', this.expandedLoadGifs);
        this.el.on('mouseleave', this.hideColor);
        // this.el.on('mouseenter', '.has-media',  this.showMedia);
        // this.el.on('tap', '.has-media', this.showMedia);
        // this.el.on('mouseleave', '.has-media', this.hideMedia);
        this.el.on('click', '.toggle-card', this.toggleCard);
        events.subscribe('filter.update', this.filter);
        events.subscribe('sort.update', this.sortChange);
        events.subscribe('size.update', this.size);
        events.subscribe('card.expanded', this.openPlayer);
    };

    this.openPlayer = function(obj){
        if(obj.id === card.data.filter_id){
            card.el.off('click.whole');
            card.el.off('click.gifs');
            card.toggleCard();
        }
    }

    this.expandedLoadGifs = function() {
        if(card.size === 'large' && !card.loaded){
            card.loadGifs();
        }
    }

    this.toggleCard = function(e) {
        card.el.toggleClass('expanded-card');
        if(card.el.hasClass('expanded-card')){
            card.el.off('click.whole');
            card.el.off('click.gifs');
            card.hideColor();
        } else {
            card.el.on('click.whole', card.toggleWholeCard);
        }
    }

    this.toggleWholeCard = function(){
        if(card.size !== 'large' && !card.el.hasClass('expanded-card')){
            card.el.off('click.whole');
            card.el.addClass('expanded-card');
            card.hideColor();
        }
    }

    this.showColor = function(){
        if(!card.el.hasClass('expanded-card') && ($('body').hasClass('small') || $('body').hasClass('medium'))){
            card.el.find('.info-column').attr('style', 'color:' + (GLOBALS.theme_colors[card.sort] + ';'));
            card.el.find('.info-column .player-description, .info-column span.title, .info-column .stat-wrap').attr('style', 'border-color:' + (GLOBALS.theme_colors[card.sort] + '!important;'));
            card.el.find('.rank-column .rank').attr('style', 'color:' + (GLOBALS.theme_colors[card.sort] + '!important; background-color:transparent !important;'));
            card.el.find('.rank-column').attr('style', 'background-color:transparent !important; background-image:url(img/dots.png); background-size:20%; border-right:1px solid #ccc;');
        }
    }

    this.hideColor = function(){
        card.el.find('.info-column').removeAttr('style');
        card.el.find('.info-column .stat-wrap').removeAttr('style');
        card.el.find('.info-column .player-description').removeAttr('style');
        card.el.find('.info-column span.title').removeAttr('style');
        card.el.find('.rank-column .rank').removeAttr('style');
        card.el.find('.rank-column').removeAttr('style');
    }

    this.showMedia = function() {
        if($(window).width() < 768){
            return;
        }
        var showMedia   = $(this).data('media'),
            mediaBG     = $('.plus-minus-media[data-id="'+showMedia+'"]').css('background-image');
        $(this).addClass('color-theme');
        $('.player-stat-image').addClass('media-shown');
        $('.plus-minus-media[data-id="'+showMedia+'"]').addClass('visible');
        // $('.plus-minus-media[data-id="'+showMedia+'"] img').attr('src', '');
        // $('.plus-minus-media[data-id="'+showMedia+'"] img').attr('src', showMedia);
    }

    this.hideMedia = function() {
        var hideMedia = $(this).data('media');
        $(this).removeClass('color-theme');
        $('.player-stat-image').removeClass('media-shown');
        $('.plus-minus-media[data-id="'+hideMedia+'"]').removeClass('visible');
    }

    this.loadGifs = function(){
        if(card.loaded || $(window).width() <= 1023){
            return;
        }
        card.loaded = true;
        _.each(card.el.find('.plus-minus-media'), function(el){
            var img = $(el).find('img');
            img.attr('src', img.data('src') );
        })
    }

    this.sortChange = function(obj){
        card.sort = obj.sort;
    };

    this.size = function(obj){
        card.size = obj.size;
    };

    this.update = function(new_player){
        this.data = new_player;
        this.loaded = false;
        var delay = $('body').hasClass('mobile') ? 1000 : 500;
            classes = '';
        setTimeout(function(){
            console.log(card.el.hasClass('expanded-card'));
            if(card.el.hasClass('expanded-card')){
                classes = 'card-item col-xs-12 expanded-card ' + card.data.filter_id + ' ' + card.data.position_group;
                card.el.attr('class', classes);
            } else {
                classes = 'card-item col-xs-12 ' + card.data.filter_id + ' ' + card.data.position_group;
                card.el.attr('class', classes);
            }
            card.el.find('.rank-column img').attr('src', 'img/players/' + card.data.filter_id + '.png').attr('alt', card.data.name);
        }, 500)
        setTimeout(function(){
            $(card.el).find('.info-column').html(card.infoTemplate(card.data));
            $(card.el).find('.ringer-coverage').html(card.coverageTemplate(card.data));
        }, delay);
    }

    this.init();

    return card;
}
