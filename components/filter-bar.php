<div id="filter-bar-wrapper">
    <div id="filter-bar">
        <div class="filter-logo background-theme">
            <a href="http://theringer.com" target="_blank">
                <img src="img/logo-square.png" alt="Go To The Ringer" />
            </a>
        </div>
        <div class="small filter <?php echo ($sort_list_id === 'all') ? 'active_filter' : '' ?>" data-sort-id="all">
            <div class="filter-wrapper">
                <span>All Seasons</span>
            </div>
        </div>
        <div class="large filter <?php echo ($sort_list_id === '1') ? 'active_filter' : '' ?>" data-sort-id="1">
            <div class="filter-wrapper">
                <span>1</span>
            </div>
        </div>
        <div class="large filter <?php echo ($sort_list_id === '2') ? 'active_filter' : '' ?>" data-sort-id="2">
            <div class="filter-wrapper">
                <span>2</span>
            </div>
        </div>
        <div class="large filter <?php echo ($sort_list_id === '3') ? 'active_filter' : '' ?>" data-sort-id="3">
            <div class="filter-wrapper">
                <span>3</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '4') ? 'active_filter' : '' ?>" data-sort-id="4">
            <div class="filter-wrapper">
                <span>4</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '5') ? 'active_filter' : '' ?>" data-sort-id="5">
            <div class="filter-wrapper">
                <span>5</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '6') ? 'active_filter' : '' ?>" data-sort-id="6">
            <div class="filter-wrapper">
                <span>6</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '7') ? 'active_filter' : '' ?>" data-sort-id="7">
            <div class="filter-wrapper">
                <span>7</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '8') ? 'active_filter' : '' ?>" data-sort-id="8">
            <div class="filter-wrapper">
                <span>8</span>
            </div>
        </div>
    </div>
    <div id="page-share">
        <a class="share non-mobile" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https://thrones.theringer.com"><img src="img/facebook.svg" alt="Facebook Logo" /></a>
        <a class="share non-mobile" target="_blank" href="https://twitter.com/intent/tweet?url=<?php echo $twitter_url; ?>&text=The%20Ringer%27s%20Definitive%20%27Game%20of%20Thrones%27%20Episode%20Rankings"><img src="img/twitter.svg" alt="Twitter Logo" /></a>
    </div>
</div>
