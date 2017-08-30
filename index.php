<?php

    require_once './vendor/autoload.php';

    use Aws\S3\S3Client;
    $ACCESS_KEY = "AKIAIQTPROH6BA7PQY5A";
    $SECRET_KEY =  "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";
    $clientS3 = S3Client::factory(array(
        'key'    => $ACCESS_KEY,
        'secret' => $SECRET_KEY
    ));

    $http = new \Guzzle\Http\Client;

    $result = $clientS3->getObjectUrl('cms-ringer', '/staging/got.json');

    $response = $http->get($result)->send();
    $data = $response->json();



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

    $episode_data = $data['contents'];

    // $articles = $data->more_coverage;

    if($detect->isMobile() && !$detect->isTablet()){
        $article_count = 5;
        $article_header_count = 4;
    } else{
        $article_count = 5;
        $article_header_count = 0;
    }

    $sort_colors = array(
        'ringer'    => '#005bcc',
        'danny'     => '#ff5e00',
        'az'     => '#7ebe43',
        'jonathan' => '#ff0047',
        'kevin'        => '#0095ff'
    );

    $sort_list_name = array(
        'all'   => "All Seasons",
        '1'     => "Season 1",
        '2'     => "Season 2",
        '3'     => "Season 3",
        '4'     => "Season 4",
        '5'     => "Season 5",
        '6'     => "Season 6",
        '7'     => "Season 7"
    );

    $sort_list_options = array('1', '2', '3', '4', '5', '6', '7');

    if(isset($_GET['list']) && in_array($_GET['list'], $sort_list_options)){
        $sort_list_id = $_GET['list'];
    } else{
        $sort_list_id = 'all';
    }

    $sort_dropdown_name = isset($sort_list_name[$sort_list_id]) ? $sort_list_name[$sort_list_id] : $sort_list_name['all'];

    // $sort_list = $data->$sort_list_id;
    $sorted_episodes = [];
    foreach($episode_data as $key => $episode) {

        if ($episode['season'] === $sort_list_id || $sort_list_id === 'all') {
            $episode['id'] = count($sorted_episodes) + 1;
            $episode['rank'] = count($sorted_episodes) + 1;
            $sorted_episodes[] = $episode;
        }
    }

    $template_render = '';
    $episode_id = isset($_GET['episode']) ? $_GET['episode'] : false;
    $count = $article_count;
    $coverage_count = 0;
    $season_count = array(
        'season_1' => 0,
        'season_2' => 0,
        'season_3' => 0,
        'season_4' => 0,
        'season_5' => 0,
        'season_6' => 0,
        'season_7' => 0
    );
    foreach($sorted_episodes as $key => $episode){
        $season_count['season_' . $episode['season']]++;
        $episode['season_ranking'] = $season_count['season_' . $episode['season']];
        $episode['mobile'] = $detect->isMobile();
        $episode['encoded_title'] = urlencode($episode['title']);

        if($episode_id && $episode['episode_number'] == $episode_id){
            $featured_episode = $episode;
        }

        $template_render .= $engine->render(
            'card',
            $episode
        );

        $count--;

        if($count == 0 && ($episode['rank'] !== count($sorted_episodes)) ){
            if($detect->isMobile() && !$detect->isTablet()){
                $display_count = 1;
            } else {
                $display_count = 2;
            }
            $count = $article_count;
            $more_coverage = (object) array();
            // $more_coverage->articles = array_slice($articles, ($article_header_count + ($display_count * $coverage_count)), $display_count);
            // $template_render .= $engine->render(
            //     'coverage',
            //     $more_coverage
            // );
            $coverage_count++;
        }
    }
    $header_coverage = (object) array();
    // $header_coverage->articles = array_slice($articles, 0, 4);
    $header_coverage_render = $engine->render(
        'coverage',
        $header_coverage
    );

    // $footer_coverage = (object) array();
    // $footer_coverage->articles = array_slice($articles, -4, 4);
    // $footer_coverage_render = $engine->render(
    //     'coverage',
    //     $footer_coverage
    // );

    $fb_meta = array();
    $fb_meta['url'] = "http://thrones.theringer.com/";
    $fb_meta['image'] = "http://thrones.theringer.com/img/ringer-got-share.jpg";
    $fb_meta['description'] = "From no. 1 to no. 67, we ranked all of the show’s episodes through the Season 7. The eighth season can't come soon enough.";
    $fb_meta['title'] = "The Ringer’s Definitive 'Game of Thrones’ Episode Rankings ";

    if(isset($featured_episode)){
        $fb_meta['url'] = "http://thrones.theringer.com/?episode=" . $featured_episode->episode_number;
        $fb_meta['title'] = "The Ringer’s Definitive 'Game of Thrones’ Episode Rankings ";
        $fb_meta['description'] = "Why " . $featured_episode->title . " falls at no. " . $featured_episode->rank . " on @ringer’s ‘Game of Thrones’ episode rankings";;
        $fb_meta['image'] = "http://thrones.theringer.com/img/episodes/episode-" . $featured_episode->episode_number . ".jpg";
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
        <title>The Ringer&rsquo;s Definitive &lsquo;Game of Thrones&rsquo; Episode Rankings<</title>

        <meta property="og:url" content="<?php echo $fb_meta['url']; ?>" />
        <meta property="og:type"   content="website" />
        <meta property="og:title" content="<?php echo $fb_meta['title']; ?>" />
        <meta property="og:description" content="<?php echo $fb_meta['description']; ?>" />
        <meta property="og:image" content="<?php echo $fb_meta['image']; ?>" />

        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <link rel="stylesheet" href="dist/css/all.css?t=<?php echo time(); ?>">

        <script src="dist/vendor/vendor.js"></script>

        <link rel="icon" href="https://cdn-images-1.medium.com/fit/c/128/128/1*w1O1RbAfBRNSxkSC48L1PQ.png" class="js-favicon">
        <link rel="apple-touch-icon" sizes="152x152" href="https://cdn-images-1.medium.com/fit/c/152/152/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="120x120" href="https://cdn-images-1.medium.com/fit/c/120/120/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="76x76" href="https://cdn-images-1.medium.com/fit/c/76/76/1*w1O1RbAfBRNSxkSC48L1PQ.png">
        <link rel="apple-touch-icon" sizes="60x60" href="https://cdn-images-1.medium.com/fit/c/60/60/1*w1O1RbAfBRNSxkSC48L1PQ.png">
    </head>
    <body class="<?php echo $bodyClass; ?> medium">
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <?php include 'components/header.php'; ?>
        <?php include 'components/intro.php';  ?>
        <div id="coverage-header"><?php echo $header_coverage_render; ?></div>
        <div class="divider is-mobile-block"></div>
        <div id="content">
            <?php // include 'components/mobile/nav.php'; ?>
            <?php include 'components/filter-bar.php'; ?>
            <div id="main-content">
                <?php // include 'components/filter-side.php'; ?>
                <div>
                    <ul id="item-list" class="grid">
                        <?php echo $template_render; ?>
                    </ul>
                </div>
            </div>
            <div class="credits">
                <div><i>Disclosure: HBO is an initial investor in</i> The Ringer.</div>
            </div>
        </div>

        <script type="text/javascript">
            window.GLOBALS = {}
            GLOBALS.isTablet = "<?php echo $detect->isTablet(); ?>";
            GLOBALS.data = <?php echo json_encode($data, JSON_FORCE_OBJECT); ?>;
            GLOBALS.episode = "<?php echo $episode_id; ?>";
            GLOBALS.theme_colors = <?php echo json_encode($sort_colors); ?>;
            GLOBALS.current_sort = "<?php echo $sort_list_id; ?>";

            $(document).ready(function(){
                if(!$('body').hasClass('mobile')){
                    $('.image-column img').each(function(){
                        $(this).attr('src', $(this).data('src'));
                    });
                }
            });
        </script>
        <script src="dist/js/all.js"></script>

        <script>
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

            ga('create', 'UA-102272660-1', 'auto');
            ga('send', 'pageview');
        </script>
    </body>
</html>
