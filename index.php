<?php
    require_once 'MobileDetect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    require 'Handlebars/Autoloader.php';
    Handlebars\Autoloader::register();

    use Handlebars\Handlebars;

    $engine = new Handlebars(array(
        'loader' => new \Handlebars\Loader\FilesystemLoader(__DIR__.'/dist/templates/'),
        'partials_loader' => new \Handlebars\Loader\FilesystemLoader(
            __DIR__ . '/dist/templates/',
            array(
                'prefix' => '_'
            )
        )
    ));

    $data_string = file_get_contents("./data/data.json");
    $data = json_decode($data_string);
    $player_data = $data->players;

    $articles = $data->more_coverage;

    if($detect->isMobile() && !$detect->isTablet()){
        $article_count = 5;
    } else{
        $article_count = 10;
    }

    $sort_colors = array(
        'ringer'    => '#005bcc',
        'danny'     => '#ff5e00',
        'az'     => '#7ebe43',
        'jonathan' => '#ff0047',
        'kevin'        => '#0095ff'
    );

    $sort_list_name = array(
        'ringer'    => "Mock Draft",
        'kevin'     => "Kevin Lincoln",
        'danny'     => "Danny Chau",
        'jonathan' => "Jonathan Tjarks",
        'a_z'       => "Sort A-Z"
    );

    $sort_list_options = array('ringer', 'kevin', 'danny', 'jonathan', 'a_z');

    if($_GET['list'] && in_array($_GET['list'], $sort_list_options)){
        $sort_list_id = $_GET['list'];
    } else{
        $sort_list_id = 'ringer';
    }

    $sort_dropdown_name = isset($sort_list_name[$sort_list_id]) ? $sort_list_name[$sort_list_id] : $sort_list_name['ringer'];

    $sort_list = $data->$sort_list_id;
    $sorted_players = [];
    foreach($sort_list as $sort) {
        foreach($player_data as $key => $player) {
            if ($sort->filter_id === $player->filter_id) {
                $player->id = count($sorted_players) + 1;
                $player->rank = sprintf("%02d", count($sorted_players) + 1);
                $sorted_players[] = $player;
                break;
            }
        }
    }

    $template_render = '';
    $player_id = isset($_GET['player']) ? $_GET['player'] : false;
    $count = $article_count;
    $coverage_count = 0;
    foreach($sorted_players as $player){
        $player->plus       = json_decode($player->plus);
        $player->cls_1       = '#000000';
        $player->percent     = '40';
        $player->color      = $sort_colors[$sort_list_id];
        $player->minus      = json_decode($player->minus);
        $player->stats      = json_decode($player->stats);
        $player->coverage   = json_decode($player->coverage);
        $player->meta       = json_decode($player->meta);
        $player->meta       = json_decode($player->meta);
        $player->shot_chart = json_decode($player->shot_chart);
        $player->size_class = 'medium';
        $player->position_group = strtolower($player->position_group);

        if($player_id && $player->filter_id === $player_id){
            $featured_player = $player;
        }
        $template_render .= $engine->render(
            'card',
            $player
        );

        $count--;
        if($count == 0 && $player->rank !== '60'){
            if($detect->isMobile() && !$detect->isTablet()){
                $display_count = 1;
            } else {
                $display_count = 3;
            }

            $count = $article_count;
            $more_coverage = (object) array();
            $more_coverage->articles = array_slice($articles, ($display_count * $coverage_count), $display_count);
            $template_render .= $engine->render(
                'coverage',
                $more_coverage
            );
            $coverage_count++;
        }
    }

    $footer_coverage = (object) array();
    $footer_coverage->articles = array_slice($articles, -4, 4);
    $footer_coverage_render = $engine->render(
        'coverage',
        $footer_coverage
    );

    $fb_meta = array();
    $fb_meta['url'] = "http://nbadraft.theringer.com/";
    $fb_meta['image'] = "https://fastfood.theringer.com/img/fast-food-facebook-1.jpg";
    $fb_meta['description'] = "Check out The Ringer’s 2017 NBA Draft Guide, a comprehensive look at the top 60 prospects.";
    $fb_meta['title'] = "The Ringer’s 2017 NBA Draft Guide";

    if(isset($featured_player)){
        $fb_meta['url'] = "http://nbadraft.theringer.com/?player=" . $featured_player->filter_id;
        $fb_meta['title'] = "Everything you need to know about " . $featured_player->name . " from The Ringer’s 2017 NBA Draft Guide";
        $fb_meta['description'] = "Check out " . $featured_player->name . " in The Ringer's 2017 NBA Draft Guide";
        $fb_meta['image'] = "http://mikemorisco.com/ringer/nba/img/players/d_bacon.png";
    }

    $bodyClass = $sort_list_id;
    if($detect->isTablet()){
        $bodyClass .= ' tablet';
    }
    if ($detect->isMobile()) {
        $bodyClass .= ' mobile';
    }
?>
<!doctype html>
    <!--[if IEMobile 7 ]> <html dir="ltr" lang="en-US"class="no-js iem7"> <![endif]-->
    <!--[if lt IE 7 ]> <html dir="ltr" lang="en-US" class="no-js ie6 oldie"> <![endif]-->
    <!--[if IE 7 ]>    <html dir="ltr" lang="en-US" class="no-js ie7 oldie"> <![endif]-->
    <!--[if IE 8 ]>    <html dir="ltr" lang="en-US" class="no-js ie8 oldie"> <![endif]-->
    <!--[if IE 9 ]> <html class="ie9"> <![endif]-->
    <!--[if (gte IE 9)|(gt IEMobile 7)|!(IEMobile)|!(IE)]><!--><html dir="ltr" lang="en-US" class="no-js"><!--<![endif]-->    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>The Ringer’s 2017 NBA Draft Guide</title>

        <meta property="og:url" content="<?php echo $fb_meta['url']; ?>" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="<?php echo $fb_meta['title']; ?>" />
        <meta property="og:description" content="<?php echo $fb_meta['description']; ?>" />
        <meta property="og:image" content="<?php echo $fb_meta['image']; ?>" />

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link rel="stylesheet" href="dist/css/all.css">

        <script src="js/vendor/modernizr-2.8.3.min.js"></script>

        <link rel="icon" href="https://cdn-images-1.medium.com/fit/c/128/128/1*w1O1RbAfBRNSxkSC48L1PQ.png" class="js-favicon">
        <link rel="apple-touch-icon" sizes="152x152" href="https://cdn-images-1.medium.com/fit/c/152/152/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="120x120" href="https://cdn-images-1.medium.com/fit/c/120/120/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://cdn-images-1.medium.com/fit/c/76/76/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://cdn-images-1.medium.com/fit/c/60/60/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <style type="text/css">.stroke{clip-path:url(#SVGID_2_);fill:none;stroke:<?php echo $sort_colors[$sort_list_id]; ?>;stroke-width:2;}.arrow{clip-path:url(#SVGID_4_);fill:<?php echo $sort_colors[$sort_list_id]; ?>;}</style>
    </head>
    <body class="<?php echo $bodyClass; ?> medium">
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <header class="background-theme">
            <nav>
                <a href="http://theringer.com" class="logo"><img src="img/logo.png" alt="The Ringer Logo" /></a>
                <ul class="main-nav">
                    <li><a target="_blank" href="https://bit.ly/ringerhome">HOME</a></li>
                    <li><a target="_blank" href="https://bit.ly/ringernba">NBA</a></li>
                    <li><a target="_blank" href="https://bit.ly/ringerncaabasketball">NCAA</a></li>
                    <li><a target="_blank" href="https://theringer.com/nba-draft">NBA DRAFT</a></li>
                    <li><a target="_blank" href="https://bit.ly/ringernbaplayoffs">NBA PLAYOFFS</a></li>
                </ul>
            </nav>
            <div class="heading-wrapper">
                <h1>
                    <span class="block">THE RINGER&rsquo;S <span class="white">2017</span></span>
                    <span class="big">NBA DRAFT GUIDE</span>
                 </h1>
                <div class="byline">Scouting reports by <a href="https://theringer.com/@kevin.oconnor">kevin o'connor</a></div>
            </div>
            <div class="heading-image">
                <img src="img/header-background.png" class="non-mobile" />
                <img src="img/header-background.png" class="is-tablet" />
                <img src="img/header-background-mobile.png" class="is-mobile" />
            </div>
        </header>
        <section id="intro">
            <div class="intro-wrapper">
                <div>
                    <strong>Welcome to <i>The Ringer</i>’s 2017 NBA Draft Guide,</strong> a comprehensive look at our top 60 prospects as rated by our three draftniks, Kevin O’Connor, Jonathan Tjarks, and Danny Chau. This is the place to learn exactly why NBA teams covet Markelle Fultz, where various NCAA standouts will land in the draft, and the “Ringer&rsquo;s 1 Reason” that makes each player NBA-worthy. Study up on the prospects’ strengths, weaknesses, stats, and comparisons, and be the guru of your draft party on June 22.
                    <div class="intro-actions">
                        <a href="https://bit.ly/ringernbadraft" class="ringer-draft-coverage color-theme">MORE RINGER NBA DRAFT COVERAGE</a>
                        <div class="social">
                            <a target="_blank" href="http://facebook.com" class="facebook"></a>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @ringer’s 2017 NBA Draft Guide, a comprehensive look at the top 60 prospects'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/'); ?>" class="twitter"></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div id="content">
            <nav id="mobile-nav">
                <div class="toggle-zone">
                </div>
                <div class="toggle-close"></div>
                <div class="toggle"></div>
                <div class="current-sort" >
                    <?php echo $sort_dropdown_name; ?>
                </div>
                <div class="nav-contents">
                    <div class="current-sort color-theme">
                        Ringer NBA Draft 2017
                    </div>
                    <ul class="sort">
                        <li class="<?php echo ($sort_list_id === 'ringer') ? 'active color-theme' : '' ?>"data-sort-id="ringer">Mock Draft</li>
                        <li class="<?php echo ($sort_list_id === 'kevin') ? 'active color-theme' : '' ?>"data-sort-id="kevin">Kevin O&rsquo;Connor</li>
                        <li class="<?php echo ($sort_list_id === 'danny') ? 'active color-theme' : '' ?>"data-sort-id="danny">Danny Chau</li>
                        <li class="<?php echo ($sort_list_id === 'jonathan') ? 'active color-theme' : '' ?>"data-sort-id="jonathan">Jonathan Tjarks</li>
                        <li class="<?php echo ($sort_list_id === 'az') ? 'active color-theme' : '' ?>"data-sort-id="az">Sort A-Z</li>
                    </ul>
                    <div class="nav-actions">
                        <div class="nav-switcher">
                            <div class="color-theme label">
                                View
                            </div>
                            <div>
                                <ul class="size-toggle">
                                    <li data-size="small"></li>
                                    <li class="active background-theme" data-size="medium"></li>
                                    <li data-size="large"></li>
                                </ul>
                                <a href="javascript:void(0);" data-size="small">Condensed</a>
                                <a href="javascript:void(0);" class="active color-theme" data-size="medium">Default</a>
                                <a href="javascript:void(0);" data-size="large">Expanded</a>
                            </div>
                        </div>
                        <div class="nav-filter">
                            <div class="color-theme label">
                                Position
                            </div>
                            <a href="javascript:void(0);" class="active color-theme" data-filter="all">All</a>
                            <a href="javascript:void(0);" data-filter="forward">Forwards</a>
                            <a href="javascript:void(0);" data-filter="guard">Guards</a>
                            <a href="javascript:void(0);" data-filter="big">Bigs</a>
                        </div>
                    </div>
                </div>
            </nav>
            <section id="filter-bar-wrapper">
                <div id="filter-bar">
                    <div class="small filter <?php echo ($sort_list_id === 'ringer') ? 'active_filter' : '' ?>" data-sort-id="ringer">
                        <div class="filter-wrapper">
                            <span>Mock Draft</span>
                        </div>
                    </div>
                    <div class="large filter <?php echo ($sort_list_id === 'kevin') ? 'active_filter' : '' ?>" data-sort-id="kevin">
                        <div class="filter-wrapper">
                            <span>Kevin O&rsquo;Connor</span>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @ringer’s 2017 NBA Draft Guide, a comprehensive look at the top 60 prospects'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=kevin'); ?>"></a>
                        </div>
                    </div>
                    <div class="large filter <?php echo ($sort_list_id === 'danny') ? 'active_filter' : '' ?>" data-sort-id="danny">
                        <div class="filter-wrapper">
                            <span>Danny Chau</span>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @ringer’s 2017 NBA Draft Guide, a comprehensive look at the top 60 prospects'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=danny'); ?>"></a>
                        </div>
                    </div>
                    <div class="large filter <?php echo ($sort_list_id === 'jonathan') ? 'active_filter' : '' ?>" data-sort-id="jonathan">
                        <div class="filter-wrapper">
                            <span>Jonathan Tjarks</span>
                            <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @ringer’s 2017 NBA Draft Guide, a comprehensive look at the top 60 prospects'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=jonathan'); ?>"></a>
                        </div>
                    </div>
                    <div class="small filter <?php echo ($sort_list_id === 'az') ? 'active_filter' : '' ?>" data-sort-id="az">
                        <div class="filter-wrapper">
                            <span>Sort A-Z</span>
                        </div>
                    </div>
                </div>
            </section>
            <div id="main-content">
                <div id="filters">
                    <div class="switcher">
                        <ul class="size-indicator">
                            <li></li>
                            <li></li>
                            <li></li>
                        </ul>
                        <ul class="size-toggle">
                            <li data-size="small"></li>
                            <li class="active background-theme" data-size="medium"></li>
                            <li data-size="large"></li>
                        </ul>
                    </div>
                    <a href="javascript:void(0);" data-filter="all" class="active color-theme"><span>all positions</span></a>
                    <a href="javascript:void(0);" data-filter="guard"><span>guards</span></a>
                    <a href="javascript:void(0);" data-filter="forward"><span>forwards</span></a>
                    <a href="javascript:void(0);" data-filter="big"><span>bigs</span></a>
                </div>
                <section>
                    <ul id="item-list" class="grid">
                        <?php echo $template_render; ?>
                    </ul>
                </section>
            </div>
        </div>
        <div id="coverage-footer">
            <?php echo $footer_coverage_render; ?>
        </div>

        <footer class="background-theme">
            <div class="footer-wrapper">
                <div class="disclaimer">
                    <div>Measurement data and player statistics via DraftExpress and Sports-Reference.</div>
                    <div>© 2017 <a href="https://theringer.com" target="_blank">The Ringer</a>. All Rights Reserved.
                </div>
            </div>
        </footer>

        <script id="player-card-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./dist/templates/card.handlebars"); ?>
        </script>

        <script id="coverage-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./dist/templates/coverage.handlebars"); ?>
        </script>

        <script id="info-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./dist/templates/info.handlebars"); ?>
        </script>

        <script id="related-coverage-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./dist/templates/related-coverage.handlebars"); ?>
        </script>

        <script type="text/javascript">
            window.GLOBALS = {}
            GLOBALS.isTablet = "<?php echo $detect->isTablet(); ?>";
            GLOBALS.data = <?php echo json_encode($data, JSON_FORCE_OBJECT); ?>;
            GLOBALS.player = "<?php echo $player_id; ?>";
            GLOBALS.more_coverage_articles = <?php echo json_encode($articles_json); ?>;
            GLOBALS.list = {
                ringer      : GLOBALS.data['ringer'],
                kevin       : GLOBALS.data['kevin'],
                danny       : GLOBALS.data['danny'],
                jonathan   : GLOBALS.data['jonathan'],
                az          : GLOBALS.data['a_z']
            };
            GLOBALS.theme_colors = <?php echo json_encode($sort_colors); ?>;
            GLOBALS.current_sort = "<?php echo $sort_list_id; ?>";
        </script>
        <script src="dist/vendor/vendor.js"></script>
        <script src="dist/js/all.js"></script>

        <script>
          (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
          (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
          m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
          })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

          ga('create', 'UA-98869396-1', 'auto');
          ga('send', 'pageview');
        </script>

    </body>
</html>
