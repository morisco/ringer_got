<?php
    require_once 'MobileDetect/Mobile_Detect.php';
    $detect = new Mobile_Detect;

    require 'Handlebars/Autoloader.php';
    Handlebars\Autoloader::register();

    use Handlebars\Handlebars;

    $engine = new Handlebars(array(
        'loader' => new \Handlebars\Loader\FilesystemLoader(__DIR__.'/templates/'),
        'partials_loader' => new \Handlebars\Loader\FilesystemLoader(
            __DIR__ . '/templates/',
            array(
                'prefix' => '_'
            )
        )
    ));

    $data_string = file_get_contents("./data/data.json");
    $data = json_decode($data_string);
    $player_data = $data->players;

    $articles_string = file_get_contents("./data/articles.json");
    $articles_json = json_decode($articles_string);
    $articles = $articles_json->articles;

    $sort_list_name = array(
        'ringer' => "Mock Draft",
        'kevin' => "Kevin Lincoln",
        'danny' => "Danny Chau",
        'johnathan' => "Johnathan Tjarks",
        'a_z' => "Sort A-Z"
    );

    $sort_list_options = array('ringer', 'kevin', 'danny', 'johnathan', 'a_z');

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
    $count = 5;
    $coverage_count = 0;
    foreach($sorted_players as $player){
        $player->plus       = json_decode($player->plus);
        $player->cls_1       = '#000000';
        $player->percent     = '40';
        $player->minus      = json_decode($player->minus);
        $player->stats      = json_decode($player->stats);
        $player->coverage   = json_decode($player->coverage);
        $player->meta       = json_decode($player->meta);
        $player->size_class = $detect->isTablet() ? 'medium' : 'small';
        if($player_id && $player->id === $player_id){
            $featured_player = $player;
        }
        $template_render .= $engine->render(
            'card',
            $player
        );

        $count--;

        if($count == 0 && $player->rank !== '50'){
            $count = 5;
            $more_coverage = (object) array();
            $more_coverage->articles = array_slice($articles, (3 * $coverage_count), 3);
            $template_render .= $engine->render(
                'coverage',
                $more_coverage
            );
            $coverage_count++;
        }
    }

    $footer_coverage = (object) array();
    $footer_coverage->articles = array_slice($articles, 0, 4);
    $footer_coverage_render = $engine->render(
        'coverage',
        $footer_coverage
    );


    $fb_meta = array();
    $fb_meta['url'] = "http://nbadraft.theringer.com/";
    $fb_meta['image'] = "https://fastfood.theringer.com/img/fast-food-facebook-1.jpg";
    $fb_meta['description'] = "The Ringer presents a definitive list of the top-50 fast food items in America.";
    $fb_meta['title'] = "2017 NBA DRAFT GUIDE - THE RINGER";

    if(isset($featured_player)){
        $fb_meta['url'] = "http://mikemorisco.com/ringer/nba?player=" . $featured_player->id;
        $fb_meta['title'] = "Check out " . $featured_player->name . " in The Ringer's 2017 NBA Draft Guide";
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
        <title>2017 NBA DRAFT GUIDE - THE RINGER</title>

        <meta property="og:url" content="<?php echo $fb_meta['url']; ?>" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="<?php echo $fb_meta['title']; ?>" />
        <meta property="og:description" content="<?php echo $fb_meta['description']; ?>" />
        <meta property="og:image" content="<?php echo $fb_meta['image']; ?>" />

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/grid.css">
        <link rel="stylesheet" href="css/fonts.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/themes.css">
        <link rel="stylesheet" href="css/header.css">
        <link rel="stylesheet" href="css/intro.css">
        <link rel="stylesheet" href="css/filter-bar.css">
        <link rel="stylesheet" href="css/filters.css">
        <link rel="stylesheet" href="css/item-list.css">
        <link rel="stylesheet" href="css/coverage.css">
        <link rel="stylesheet" href="css/footer.css">
        <link rel="stylesheet" href="css/transitions.css">
        <link rel="stylesheet" href="css/mobile.css">
        <link rel="stylesheet" href="css/tablet.css">

        <script src="js/vendor/modernizr-2.8.3.min.js"></script>

        <link rel="icon" href="https://cdn-images-1.medium.com/fit/c/128/128/1*w1O1RbAfBRNSxkSC48L1PQ.png" class="js-favicon">
        <link rel="apple-touch-icon" sizes="152x152" href="https://cdn-images-1.medium.com/fit/c/152/152/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="120x120" href="https://cdn-images-1.medium.com/fit/c/120/120/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://cdn-images-1.medium.com/fit/c/76/76/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://cdn-images-1.medium.com/fit/c/60/60/1*w1O1RbAfBRNSxkSC48L1PQ.png">
    </head>
    <body class="<?php echo $bodyClass; ?>">
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <header class="background-theme">
            <nav>
                <a href="http://theringer.com" class="logo"><img src="img/logo.png" alt="The Ringer Logo" /></a>
                <ul class="main-nav">
                    <li><a href="http://theringer.com">HOME</a></li>
                    <li><a href="http://theringer.com">NBA</a></li>
                    <li><a href="http://theringer.com">NCAA</a></li>
                    <li><a href="http://theringer.com">NBA DRAFT</a></li>
                    <li><a href="http://theringer.com">ANOTHER</a></li>
                </ul>
            </nav>
            <div class="heading-wrapper">
                <h1><span class="block">THE RINGER&rsquo;S <span class="white">2017</span></span> NBA DRAFT GUIDE</h1>
            </div>
        </header>
        <section id="intro">
            <div class="intro-wrapper">
                <div>
                    <strong>Welcome to The Ringer’s 2017 NBA Draft Guide,</strong> a comprehensive look at our top-60 prospects as rated by our three draftniks, Kevin O’Connor, Jonathan Tjarks, and Danny Chau. Up your knowledge on a player’s strengths, weaknesses, stats, and comparisons — be the guru of your draft party on June 22.
                    <div class="intro-actions">
                        <a href="http://theringer.com" class="ringer-draft-coverage color-theme">MORE RINGER NBA DRAFT COVERAGE</a>
                        <div class="social">
                            <a href="http:facebook.com" class="facebook"></a>
                            <a href="http:twitter.com" class="twitter"></a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <div id="content">
            <nav id="mobile-nav">
                <div class="toggle-zone">
                </div>
                <div class="toggle"></div>
                <div class="current-sort" >
                    <?php echo $sort_dropdown_name; ?>
                </div>
                <div class="nav-contents">
                    <div class="current-sort color-theme">
                        Ringer NBA Draft 2017
                    </div>
                    <ul class="sort">
                        <li class="<?php echo ($sort_list_id === 'ringer') ? 'active color-theme' : '' ?>"data-filter-id="ringer">Mock Draft</li>
                        <li class="<?php echo ($sort_list_id === 'kevin') ? 'active color-theme' : '' ?>"data-filter-id="kevin">Kevin Lincoln</li>
                        <li class="<?php echo ($sort_list_id === 'danny') ? 'active color-theme' : '' ?>"data-filter-id="danny">Danny Chau</li>
                        <li class="<?php echo ($sort_list_id === 'johnathan') ? 'active color-theme' : '' ?>"data-filter-id="johnathan">Johnathan Tjarks</li>
                        <li class="<?php echo ($sort_list_id === 'az') ? 'active color-theme' : '' ?>"data-filter-id="az">Sort A-Z</li>
                    </ul>
                    <div class="nav-actions">
                        <div class="nav-switcher">
                            <div class="color-theme label">
                                View
                            </div>
                            <div>
                                <ul class="size-toggle">
                                    <li class="active background-theme" data-size="small"></li>
                                    <li data-size="medium"></li>
                                    <li data-size="large"></li>
                                </ul>
                                <a href="#" class="active color-theme" data-size="small">Default</a>
                                <a href="#" data-size="medium">Condensed</a>
                                <a href="#" data-size="large">Expanded</a>
                            </div>
                        </div>
                        <div class="nav-filter">
                            <div class="color-theme label">
                                Position
                            </div>
                            <a href="#" class="active color-theme" data-filter="all">All</a>
                            <a href="#" data-filter="forward">Forwards</a>
                            <a href="#" data-filter="guard">Guards</a>
                            <a href="#" data-filter="big">Bigs</a>
                        </div>
                    </div>
                </div>
            </nav>
            <section id="filter-bar-wrapper">
                <div id="filter-bar">
                    <a href="#" class="small <?php echo ($sort_list_id === 'ringer') ? 'active_filter' : '' ?>" data-filter-id="ringer"><span>Ringer Picks</span></a>
                    <a href="#" class="large <?php echo ($sort_list_id === 'kevin') ? 'active_filter' : '' ?>" data-filter-id="kevin"><span>Kevin O&rsquo;Connor</span></a>
                    <a href="#" class="large <?php echo ($sort_list_id === 'danny') ? 'active_filter' : '' ?>" data-filter-id="danny"><span>Danny Chau</span></a>
                    <a href="#" class="large <?php echo ($sort_list_id === 'johnathan') ? 'active_filter' : '' ?>" data-filter-id="johnathan"><span>Johnathan Tjarks</span></a>
                    <a href="#" class="small <?php echo ($sort_list_id === 'az') ? 'active_filter' : '' ?>" data-filter-id="az"><span>Sort A-Z</span></a>
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
                            <li class="active background-theme" data-size="small"></li>
                            <li data-size="medium"></li>
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
                    Whatever disclaimer copyright or footer copy goes here in this spot.
                </div>
            </div>
        </footer>

        <script id="player-card-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./templates/card.handlebars"); ?>
        </script>

        <script id="coverage-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./templates/coverage.handlebars"); ?>
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
                johnathan   : GLOBALS.data['johnathan'],
                az          : GLOBALS.data['a_z']
            };
            GLOBALS.theme_colors = {
                'ringer': '#43be6d',
                'kevin': '#ffff00',
                'danny': '#00adef',
                'johnathan': '#c800ff',
                'az': '#0043cc'
            };
        </script>
        <script src="js/vendor/jquery-1.12.0.min.js"></script>
        <script>window.jQuery || document.write('<script src="https://code.jquery.com/jquery-1.12.0.min.js"><\/script>')</script>
        <script src="js/vendor/handlebars.js"></script>
        <script src="js/vendor/underscore.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-92628558-1', 'auto');
            ga('send', 'pageview');
        </script>

    </body>
</html>
