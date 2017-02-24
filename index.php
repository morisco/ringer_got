<!doctype html>
<html class="no-js" lang="">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/grid.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.8.3.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 8]>
            <p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <header>
            <div class="heading-wrapper">
                <img src="img/header-top-50.png" alt="The Top 50" class="top-50" />
                <img src="img/header-image-text.png" alt="Fast Food Items in America" class="header-text" />
            </div>
        </header>
        <div id="filters">
                <a href="javascript:void(0);" data-filter="All" class="active">All</a>
                <a href="javascript:void(0);" data-filter="Fries">Fries</a>
                <a href="javascript:void(0);" data-filter="Burger">Burgers</a>
                <a href="javascript:void(0);" data-filter="Chicken">Chicken</a>
                <a href="javascript:void(0);" data-filter="Chicken Sandwich">Chicken Sandwich</a>
                <a href="javascript:void(0);" data-filter="Taco">Tacos</a>
                <a href="javascript:void(0);" data-filter="Dessert">Dessert</a>
                <a href="javascript:void(0);" data-filter="Misc">Misc</a>
            </div>
        <section>
            <ul id="item-list" class="grid"></ul>
        </section>

        <script id="food-card-template" type="text/x-handlebars-template">
            <li class="food-item col-xs-12 col-md-6 col-lg-4">
                <div class="wrapper">
                    <div class="heading">
                        <h3>
                            <span class="index">{{displayOrder}}</span>
                            <span class="title">{{title}}</span> 
                            <span class="brand">{{brand}}</span>
                        </h3>
                        <div class="image-wrapper">
                            <img src="{{img}}" alt="{{title}} - Illustration" />
                        </div>
                    </div>
                    <div class="body">
                        <div class="image-wrapper">
                            
                        </div>
                        <div class="content">
                            {{desc}} <span class="writer">- {{writer}}</span>
                            <div class="stats">
                                <div class="stat">
                                    <span class="title">Calories.........................................................................................................................................................</span>
                                    <span class="value">750</span>
                                </div>
                                <div class="stat">
                                    <span class="title">Price............................................................................................................................................................</span>
                                    <span class="value">$3.50</span>
                                </div>
                                <div class="stat">
                                    <span class="title">First Debuted....................................................................................................................................................</span>
                                    <span class="value">1977</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </script>

        <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.12.0.min.js"><\/script>')</script>
        <script src="js/vendor/handlebars.js"></script>
        <script src="js/vendor/underscore.js"></script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>
    </body>
</html>
