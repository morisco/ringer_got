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
            card.el.find('.rank-column').attr('style', 'background-color:transparent !important; background-image:url(img/dots.png); border-right:1px solid #ccc;');
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
        $('.plus-minus-media[data-id="'+showMedia+'"] img').attr('src', showMedia);
    }

    this.hideMedia = function() {
        var hideMedia = $(this).data('media');
        $(this).removeClass('color-theme');
        $('.player-stat-image').removeClass('media-shown');
        $('.plus-minus-media[data-id="'+hideMedia+'"]').removeClass('visible');
    }

    this.loadGifs = function(){
        if(card.loaded || $(window).width() <= 767){
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

$(window).load(function () {
    var masterList = new CardList();
    // var mobile = new Mobile(masterList);
});

$(document).on('ready', function() {
  function initializeGA() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
      if(typeof ga !== 'undefined'){
        ga('create', 'UA-102272660-1', 'auto');
        ga('send', 'pageview');
      }
  }
  $('#cookie-pref').on('click', function() {
    window.localStorage.removeItem('thrones-gdpr-consent', 1);

    $('#consent').show();
    $('#give-consent').off('click').on('click', function() {
      $('#consent').hide();
    });

  })
  if((isEULocale() || isInEUTimezone()) && !window.localStorage.getItem('thrones-gdpr-consent')){
    $('#consent').show();
    $('#give-consent').on('click', function() {
      window.localStorage.setItem('thrones-gdpr-consent', 1);
      $('#consent').hide();
      initializeGA();
    })
  } else {
    initializeGA();
    $('#consent').hide();
  }
});

function CardList() {
    var cardlist = this;

    this.$el = $('#item-list');
    this.sort_id = GLOBALS.current_sort;

    this.initial_episode = GLOBALS.episode || false;

    this.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
    this.filterResetPos = this.filterOffsetPos + $('#filter-bar').height() + 38;

    this.size = 'medium';

    this.init = function() {
        this.windowResize();
        this.initEvents();
        if(this.initial_episode){
            cardlist.openCard();
        }
    }

    this.initEvents = function() {
        $('header').on('click', '.fixed-nav a:not(.active_filter)', this.sort);
        $('#filter-bar').on('click', '.filter:not(.active_filter)', this.sort);
        $(window).on( "orientationchange", this.orientationChange );

        $('.mobile header:not(.open)').on('click', ' .fixed-nav', this.toggleNav);
        $('.mobile header').on('click', ' .close-nav', this.toggleNav);

        $(window).on('resize', this.windowResize);
        if(!cardlist.initial_episode){
            $(window).on('scroll', cardlist.scrollWatch);
            cardlist.scrollWatch();
        }
    }

    this.toggleNav = function(){
        $('header').toggleClass('open');
    };

    this.orientationChange = function(){
        setTimeout(function(){
            cardlist.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
        }, 500);
    };

    this.windowResize = function(){
        var windowWidth = $(window).width();
        clearTimeout(cardlist.sizeTimeout);
        cardlist.sizeTimeout = setTimeout(function(){
            windowWidth = $(window).width();
            cardlist.filterOffsetPos = $('#filter-bar').offset().top - $('header nav').height();
        },250);
        // $('.card-item:not(.large)').removeClass('small medium').addClass(cardlist.size);
        if(windowWidth < 1100 && windowWidth > 767 ){
            $('body').removeClass('mobile');
            $('body').addClass('tablet no-transition');
        } else if(windowWidth < 768){
            $('body').removeClass('tablet');
            $('body').addClass('mobile no-transition');
        } else {
            $('.image-column img').each(function(){
                $(this).attr('src', $(this).data('src'));
            });
            $('body').addClass('no-transition');
            $('body').removeClass('tablet mobile');
        }
        setTimeout(function(){
            $('body').removeClass('no-transition');
        },100);
    };

    this.openCard = function() {
        var timeout = false,
            openCard = $('.card-item.episode-' + this.initial_episode),
            openScrollPos = openCard.offset().top,
            scrollOffset = $(window).width() < 768 ? 50 : 100;

            $('body').addClass('filter-fixed');
            $('body,html').animate({scrollTop: openScrollPos - scrollOffset}, function(){
                clearTimeout(timeout);
                timeout = setTimeout(function(){
                    $(window).on('scroll.scrollWatch', cardlist.scrollWatch);
                },100);
            });

    }

    this.scrollWatch = function() {
        var scrollPos = $(window).scrollTop();
        if(scrollPos > cardlist.filterOffsetPos){
            $('body').addClass('filter-fixed');
        } else {
            $('body').removeClass('filter-fixed');
        }
    }

    this.sort = function(e){
        e.preventDefault();
        e.stopPropagation();
        if(cardlist.sort_id  == $(e.currentTarget).data('sort-id')){
            return;
        }

        var player,
            coverage_count = 5;
        cardlist.$el.addClass('filtered');
        $('.active_filter').removeClass('active_filter');
        $('header').removeClass('open');
        $('header .fixed-nav a[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').addClass('active_filter');
        $('header .fixed-nav a[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').parent().addClass('active_filter');
        $('.filter[data-sort-id="' + $(e.currentTarget).data('sort-id') + '"]').addClass('active_filter');
        $(e.currentTarget).addClass('active_filter');
        cardlist.sort_id = $(e.currentTarget).data('sort-id');
        cardlist.$el.removeClass('season-1 season-2 season-3 season-4 season-5 season-6 season-7 season-8 all');
        
        if(cardlist.sort_id === 'all'){
            cardlist.$el.removeClass('filtered');
        } else {
            cardlist.$el.addClass('season-' + cardlist.sort_id);
        }
        if($(window).scrollTop() > cardlist.filterOffsetPos){
            if($(window).width() < 767){
                $('html,body').scrollTop(cardlist.filterResetPos);
            } else {
                $('body,html').animate({scrollTop:cardlist.filterResetPos});
            }
        }
    }

    this.init();

    return cardlist;
}

function Mobile(list) {
    var mobile = this;
        mobile.list = list;
        mobile.filterOffsetPos = $('#content').offset().top;
        mobile.size = 'medium';


    mobile.init = function(){
        mobile.initEvents();
    }

    mobile.initEvents = function(){
        $('#mobile-nav').on('click', '.toggle-zone', mobile.toggleMobileNav);
        $('#mobile-nav').on('click', '.toggle-close', mobile.toggleMobileNav);
        $('#mobile-nav').on('click', '.sort li', mobile.mobileSort);
        $('#mobile-nav').on('click', '.nav-filter a', mobile.mobileFilter);
        $('#mobile-nav .nav-switcher').on('click', 'a', mobile.mobileChangeSize);
        $(window).on( "orientationchange", mobile.orientationChange );
    }

    this.toggleMobileNav = function(){
        window.clearTimeout(mobile.navTimeout);
        if($(window).scrollTop() < mobile.filterOffsetPos && !$('#mobile-nav').hasClass('open')){
            $('body,html').scrollTop((mobile.filterOffsetPos + 1));
        }

        $('#mobile-nav').toggleClass('open');

    };

    this.mobileChangeSize = function(e){
        e.preventDefault();
        var newSize = $(this).data('size');
        $('#mobile-nav').removeClass('open');
        mobile.old_size = mobile.size;
        mobile.size = $(this).data('size');
        events.publish('size.update', {size: mobile.size});
        transitionClass = mobile.old_size + '-to-' + mobile.size;

        $('.size-indicator').attr('class', 'size-indicator').addClass(mobile.size);
        $('#mobile-nav .size-toggle .active').removeClass('active background-theme');
        $('#mobile-nav .size-toggle li[data-size="'+mobile.size+'"]').addClass('active background-theme');
        $('#mobile-nav .nav-switcher a').removeClass('active color-theme');
        $(e.target).addClass('active color-theme');

        setTimeout(function(){
            $('body').removeClass('small medium large').addClass(mobile.size + ' ' + transitionClass);
        },100);
    }

    mobile.mobileSort = function(e){
        e.preventDefault();
        $('#mobile-nav').removeClass('open');
        setTimeout(function(){
            $('#mobile-nav .current-sort').text($(e.currentTarget).find('span').text());
            $('#mobile-nav .sort li').removeClass('active_filter color-theme');
            $(e.currentTarget).addClass('active_filter color-theme');
            mobile.list.sort(e);
        },100);
    }

    mobile.mobileFilter = function(e){
        e.preventDefault();
        $('#mobile-nav').removeClass('open');
        setTimeout(function(){
            mobile.list.filter(e);
        },100);
    }

    mobile.init();

    return mobile;
};

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

var events = (function(){
  var topics = {};
  var hOP = topics.hasOwnProperty;

  return {
    subscribe: function(topic, listener) {
      // Create the topic's object if not yet created
      if(!hOP.call(topics, topic)) topics[topic] = [];

      // Add the listener to queue
      var index = topics[topic].push(listener) -1;

      // Provide handle back for removal of topic
      return {
        remove: function() {
          delete topics[topic][index];
        }
      };
    },
    publish: function(topic, info) {
      // If the topic doesn't exist, or there's no listeners in queue, just leave
      if(!hOP.call(topics, topic)) return;

      // Cycle through topics queue, fire!
      topics[topic].forEach(function(item) {
      		item(info != undefined ? info : {});
      });
    }
  };
})();
