function Card(e,t){var i=this;return this.data=t,this.id=e,this.el=$('.card-item[data-id="'+this.data.filter_id+'"]'),this.size="medium",this.sort=GLOBALS.current_sort,this.infoTemplateSource=$("#info-template").html(),this.infoTemplate=Handlebars.compile(this.infoTemplateSource),this.coverageTemplateSource=$("#related-coverage-template").html(),this.coverageTemplate=Handlebars.compile(this.coverageTemplateSource),this.init=function(){this.initEvents(),i.data.coverage=$.map(i.data.coverage,function(e,t){return[e]})},this.initEvents=function(){this.el.on("click.whole",this.toggleWholeCard),this.el.on("mouseenter",this.showColor),this.el.on("mouseleave",this.hideColor),this.el.on("click",".toggle-card",this.toggleCard),events.subscribe("filter.update",this.filter),events.subscribe("sort.update",this.sortChange),events.subscribe("size.update",this.size),events.subscribe("card.expanded",this.openPlayer)},this.openPlayer=function(e){e.id===i.data.filter_id&&(i.el.off("click.whole"),i.el.off("click.gifs"),i.toggleCard())},this.expandedLoadGifs=function(){"large"!==i.size||i.loaded||i.loadGifs()},this.toggleCard=function(e){i.el.toggleClass("expanded-card"),i.el.hasClass("expanded-card")?(i.el.off("click.whole"),i.el.off("click.gifs"),i.hideColor()):i.el.on("click.whole",i.toggleWholeCard)},this.toggleWholeCard=function(){"large"===i.size||i.el.hasClass("expanded-card")||(i.el.off("click.whole"),i.el.addClass("expanded-card"),i.hideColor())},this.showColor=function(){i.el.hasClass("expanded-card")||!$("body").hasClass("small")&&!$("body").hasClass("medium")||(i.el.find(".info-column").attr("style","color:"+GLOBALS.theme_colors[i.sort]+";"),i.el.find(".info-column .player-description, .info-column span.title, .info-column .stat-wrap").attr("style","border-color:"+GLOBALS.theme_colors[i.sort]+"!important;"),i.el.find(".rank-column .rank").attr("style","color:"+GLOBALS.theme_colors[i.sort]+"!important; background-color:transparent !important;"),i.el.find(".rank-column").attr("style","background-color:transparent !important; background-image:url(img/dots.png); border-right:1px solid #ccc;"))},this.hideColor=function(){i.el.find(".info-column").removeAttr("style"),i.el.find(".info-column .stat-wrap").removeAttr("style"),i.el.find(".info-column .player-description").removeAttr("style"),i.el.find(".info-column span.title").removeAttr("style"),i.el.find(".rank-column .rank").removeAttr("style"),i.el.find(".rank-column").removeAttr("style")},this.showMedia=function(){if(!($(window).width()<768)){var e=$(this).data("media");$('.plus-minus-media[data-id="'+e+'"]').css("background-image");$(this).addClass("color-theme"),$(".player-stat-image").addClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').addClass("visible"),$('.plus-minus-media[data-id="'+e+'"] img').attr("src",e)}},this.hideMedia=function(){var e=$(this).data("media");$(this).removeClass("color-theme"),$(".player-stat-image").removeClass("media-shown"),$('.plus-minus-media[data-id="'+e+'"]').removeClass("visible")},this.loadGifs=function(){i.loaded||$(window).width()<=767||(i.loaded=!0,_.each(i.el.find(".plus-minus-media"),function(e){var t=$(e).find("img");t.attr("src",t.data("src"))}))},this.sortChange=function(e){i.sort=e.sort},this.size=function(e){i.size=e.size},this.update=function(e){this.data=e,this.loaded=!1;var t=$("body").hasClass("mobile")?1e3:500;classes="",setTimeout(function(){i.el.hasClass("expanded-card")?(classes="card-item col-xs-12 expanded-card "+i.data.filter_id+" "+i.data.position_group,i.el.attr("class",classes)):(classes="card-item col-xs-12 "+i.data.filter_id+" "+i.data.position_group,i.el.attr("class",classes)),i.el.find(".rank-column img").attr("src","img/players/"+i.data.filter_id+".png").attr("alt",i.data.name)},500),setTimeout(function(){$(i.el).find(".info-column").html(i.infoTemplate(i.data)),$(i.el).find(".ringer-coverage").html(i.coverageTemplate(i.data))},t)},this.init(),i}function CardList(){var e=this;return this.$el=$("#item-list"),this.sort_id=GLOBALS.current_sort,this.initial_episode=GLOBALS.episode||!1,this.filterOffsetPos=$("#filter-bar").offset().top-$("header nav").height(),this.filterResetPos=this.filterOffsetPos+$("#filter-bar").height()+38,this.size="medium",this.init=function(){this.windowResize(),this.initEvents(),this.initial_episode&&e.openCard()},this.initEvents=function(){$("header").on("click",".fixed-nav a:not(.active_filter)",this.sort),$("#filter-bar").on("click",".filter:not(.active_filter)",this.sort),$(window).on("orientationchange",this.orientationChange),$(".mobile header:not(.open)").on("click"," .fixed-nav",this.toggleNav),$(".mobile header").on("click"," .close-nav",this.toggleNav),$(window).on("resize",this.windowResize),e.initial_episode||$(window).on("scroll",e.scrollWatch)},this.toggleNav=function(){$("header").toggleClass("open")},this.orientationChange=function(){setTimeout(function(){e.filterOffsetPos=$("#filter-bar").offset().top-$("header nav").height()},500)},this.windowResize=function(){var t=$(window).width();clearTimeout(e.sizeTimeout),e.sizeTimeout=setTimeout(function(){t=$(window).width(),e.filterOffsetPos=$("#filter-bar").offset().top-$("header nav").height()},250),t<1100&&t>767?($("body").removeClass("mobile"),$("body").addClass("tablet no-transition")):t<768?($("body").removeClass("tablet"),$("body").addClass("mobile no-transition")):($(".image-column img").each(function(){$(this).attr("src",$(this).data("src"))}),$("body").addClass("no-transition"),$("body").removeClass("tablet mobile")),setTimeout(function(){$("body").removeClass("no-transition")},100)},this.openCard=function(){var t=!1,i=$(".card-item.episode-"+this.initial_episode),o=i.offset().top,s=$(window).width()<768?50:100;$("body").addClass("filter-fixed"),$("body,html").animate({scrollTop:o-s},function(){clearTimeout(t),t=setTimeout(function(){$(window).on("scroll.scrollWatch",e.scrollWatch)},100)})},this.scrollWatch=function(){$(window).scrollTop()>e.filterOffsetPos?$("body").addClass("filter-fixed"):$("body").removeClass("filter-fixed")},this.sort=function(t){if(t.preventDefault(),t.stopPropagation(),e.sort_id!=$(t.currentTarget).data("sort-id")){e.$el.addClass("filtered"),$(".active_filter").removeClass("active_filter"),$("header").removeClass("open"),$('header .fixed-nav a[data-sort-id="'+$(t.currentTarget).data("sort-id")+'"]').addClass("active_filter"),$('header .fixed-nav a[data-sort-id="'+$(t.currentTarget).data("sort-id")+'"]').parent().addClass("active_filter"),$('.filter[data-sort-id="'+$(t.currentTarget).data("sort-id")+'"]').addClass("active_filter"),$(t.currentTarget).addClass("active_filter"),e.sort_id=$(t.currentTarget).data("sort-id"),e.$el.removeClass("season-1 season-2 season-3 season-4 season-5 season-6 all"),"all"===e.sort_id?e.$el.removeClass("filtered"):e.$el.addClass("season-"+e.sort_id),$(window).scrollTop()>e.filterOffsetPos&&($(window).width()<767?$("html,body").scrollTop(e.filterResetPos):$("body,html").animate({scrollTop:e.filterResetPos}))}},this.init(),e}function Mobile(e){var t=this;return t.list=e,t.filterOffsetPos=$("#content").offset().top,t.size="medium",t.init=function(){t.initEvents()},t.initEvents=function(){$("#mobile-nav").on("click",".toggle-zone",t.toggleMobileNav),$("#mobile-nav").on("click",".toggle-close",t.toggleMobileNav),$("#mobile-nav").on("click",".sort li",t.mobileSort),$("#mobile-nav").on("click",".nav-filter a",t.mobileFilter),$("#mobile-nav .nav-switcher").on("click","a",t.mobileChangeSize),$(window).on("orientationchange",t.orientationChange)},this.toggleMobileNav=function(){window.clearTimeout(t.navTimeout),$(window).scrollTop()<t.filterOffsetPos&&!$("#mobile-nav").hasClass("open")&&$("body,html").scrollTop(t.filterOffsetPos+1),$("#mobile-nav").toggleClass("open")},this.mobileChangeSize=function(e){e.preventDefault();$(this).data("size");$("#mobile-nav").removeClass("open"),t.old_size=t.size,t.size=$(this).data("size"),events.publish("size.update",{size:t.size}),transitionClass=t.old_size+"-to-"+t.size,$(".size-indicator").attr("class","size-indicator").addClass(t.size),$("#mobile-nav .size-toggle .active").removeClass("active background-theme"),$('#mobile-nav .size-toggle li[data-size="'+t.size+'"]').addClass("active background-theme"),$("#mobile-nav .nav-switcher a").removeClass("active color-theme"),$(e.target).addClass("active color-theme"),setTimeout(function(){$("body").removeClass("small medium large").addClass(t.size+" "+transitionClass)},100)},t.mobileSort=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){$("#mobile-nav .current-sort").text($(e.currentTarget).find("span").text()),$("#mobile-nav .sort li").removeClass("active_filter color-theme"),$(e.currentTarget).addClass("active_filter color-theme"),t.list.sort(e)},100)},t.mobileFilter=function(e){e.preventDefault(),$("#mobile-nav").removeClass("open"),setTimeout(function(){t.list.filter(e)},100)},t.init(),t}var events=function(){var e={},t=e.hasOwnProperty;return{subscribe:function(i,o){t.call(e,i)||(e[i]=[]);var s=e[i].push(o)-1;return{remove:function(){delete e[i][s]}}},publish:function(i,o){t.call(e,i)&&e[i].forEach(function(e){e(void 0!=o?o:{})})}}}();$(window).load(function(){new CardList}),function(){for(var e,t=function(){},i=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeline","timelineEnd","timeStamp","trace","warn"],o=i.length,s=window.console=window.console||{};o--;)e=i[o],s[e]||(s[e]=t)}();