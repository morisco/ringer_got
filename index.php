<?php
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

    $sort_list_id = isset($_GET['list']) && $_GET['list'] ? $_GET['list'] : 'ringer';
    $sort_list = $data->$sort_list_id;
    $sorted_players = [];
    foreach($sort_list as $sort) {
        foreach($player_data as $key => $player) {
            if ($sort->filter_id === $player->filter_id) {
                $player->rank = sprintf("%02d", count($sorted_players) + 1);
                $sorted_players[] = $player;
                break;
            }
        }
    }

    $template_render = '';
    $player_id = isset($_GET['player']) ? $_GET['player'] : false;
    foreach($sorted_players as $player){
        $player->plus = json_decode($player->plus);
        $player->minus = json_decode($player->minus);
        $player->stats = json_decode($player->stats);
        $player->coverage = json_decode($player->coverage);
        if($player_id && $player->id === $player_id){
            $featured_player = $player;
        }
        $template_render .= $engine->render(
            'card',
            $player
        );
    }

    $fb_meta = array();
    $fb_meta['url'] = "http://nbadraft.theringer.com/";
    $fb_meta['image'] = "https://fastfood.theringer.com/img/fast-food-facebook-1.jpg";
    $fb_meta['description'] = "The Ringer presents a definitive list of the top-50 fast food items in America.";
    $fb_meta['title'] = "2017 NBA DRAFT GUIDE - THE RINGER";

    if(isset($featured_player)){
        $fb_meta['url'] = "http://nbadraft.theringer.com?player=" . $featured_player->id;
        $fb_meta['title'] = "Check out " . $featured_player->name . " in The Ringer's 2017 NBA Draft Guide";
        $fb_meta['description'] = "Check out " . $featured_player->name . " in The Ringer's 2017 NBA Draft Guide";
        $fb_meta['image'] = "https://fastfood.theringer.com/img/fast-food-facebook-1.jpg";
    }
?>
<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>2017 NBA DRAFT GUIDE - THE RINGER</title>

        <meta property="og:url" content="<?php echo $fb_meta['url']; ?>" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="<?php echo $fb_meta['title']; ?>" />
        <meta property="og:description" content="<?php echo $fb_meta['description']; ?>" />
        <meta property="og:image" content="<?php echo $fb_meta['image']; ?>" />

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/grid.css">
        <link rel="stylesheet" href="css/fonts.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.8.3.min.js"></script>

        <link rel="icon" href="https://cdn-images-1.medium.com/fit/c/128/128/1*w1O1RbAfBRNSxkSC48L1PQ.png" class="js-favicon">
        <link rel="apple-touch-icon" sizes="152x152" href="https://cdn-images-1.medium.com/fit/c/152/152/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="120x120" href="https://cdn-images-1.medium.com/fit/c/120/120/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://cdn-images-1.medium.com/fit/c/76/76/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://cdn-images-1.medium.com/fit/c/60/60/1*w1O1RbAfBRNSxkSC48L1PQ.png">
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <header>
            <div class="heading-wrapper">
                <h1><span class="block">THE RINGER&rsquo;S <span class="white">2017</span></span> NBA DRAFT GUIDE</h1>
            </div>
        </header>
        <section id="intro">
            <div class="intro-wrapper">
                <div>
                    <strong>Athletic forward who can fill a  3-and-D role, with playmaking upside.</strong> Athletic forward who can fill a  3-and-D role, with playmaking upside. Athletic forward who can fill a  3-and-D role, with playmaking upside. Athletic forward who can fill a  3-and-D role, with playmaking upside.
                    <div class="social">
                        <a href="http:facebook.com" class="facebook"></a>
                        <a href="http:twitter.com" class="twitter"></a>
                    </div>
                </div>
            </div>
        </section>
        <div id="content">
            <section id="filter-bar-wrapper">
                <div id="filter-bar">
                    <a href="#" class="small" data-filter-id="ringer"><span>Ringer Picks</span></a>
                    <a href="#" class="large" data-filter-id="kevin"><span>Kevin O&rsquo;Connor</span></a>
                    <a href="#" class="large" data-filter-id="danny"><span>Danny Chau</span></a>
                    <a href="#" class="large" data-filter-id="johnathan"><span>Johnathan Tjarks</span></a>
                    <a href="#" class="small" data-filter-id="a_z"><span>Sort A-Z</span></a>
                </div>
            </section>
            <div id="filters">
                <div class="switcher">
                    <ul class="size-indicator">
                        <li></li>
                        <li></li>
                        <li></li>
                    </ul>
                    <ul class="size-toggle">
                        <li class="active" data-size="small"></li>
                        <li data-size="medium"></li>
                        <li data-size="large"></li>
                    </ul>
                </div>
                <a href="javascript:void(0);" data-filter="All" class="active"><span>all positions</span></a>
                <a href="javascript:void(0);" data-filter="Guards"><span>guards</span></a>
                <a href="javascript:void(0);" data-filter="Forwards"><span>forwards</span></a>
                <a href="javascript:void(0);" data-filter="Bigs"><span>bigs</span></a>
            </div>
            <section>
                <ul id="item-list" class="grid">
                    <?php echo $template_render; ?>
                </ul>
            </section>
        </div>
        <script id="player-card-template" type="text/x-handlebars-template">
            <?php echo file_get_contents("./templates/card.handlebars"); ?>
        </script>

        <script type="text/javascript">
            window.GLOBALS = {}
            GLOBALS.data = <?php echo json_encode($data, JSON_FORCE_OBJECT); ?>;
            GLOBALS.player = "<?php echo $player_id; ?>";
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
