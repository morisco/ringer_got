<section id="filter-bar-wrapper">
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
                <span>Season 1</span>
                <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @KevinOConnorNBA’s ranking of the top 60 NBA draft prospects from @ringer’s 2017 NBA Draft Guide'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=kevin'); ?>"></a>
            </div>
        </div>
        <div class="large filter <?php echo ($sort_list_id === '2') ? 'active_filter' : '' ?>" data-sort-id="2">
            <div class="filter-wrapper">
                <span>Season 2</span>
                <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @dannychau’s ranking of the top 60 NBA draft prospects from @ringer’s 2017 NBA Draft Guide'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=danny'); ?>"></a>
            </div>
        </div>
        <div class="large filter <?php echo ($sort_list_id === '3') ? 'active_filter' : '' ?>" data-sort-id="3">
            <div class="filter-wrapper">
                <span>Season 3</span>
                <a target="_blank" href="https://twitter.com/intent/tweet?text=<?php echo urlencode('Check out @JonathanTjarks’s ranking of the top 60 NBA draft prospects from @ringer’s 2017 NBA Draft Guide'); ?>&url=<?php echo urlencode('http://nbadraft.theringer.com/?list=jonathan'); ?>"></a>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '4') ? 'active_filter' : '' ?>" data-sort-id="4">
            <div class="filter-wrapper">
                <span>Season 4</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '5') ? 'active_filter' : '' ?>" data-sort-id="5">
            <div class="filter-wrapper">
                <span>Season 5</span>
            </div>
        </div>
        <div class="small filter <?php echo ($sort_list_id === '6') ? 'active_filter' : '' ?>" data-sort-id="6">
            <div class="filter-wrapper">
                <span>Season 6</span>
            </div>
        </div>
    </div>
</section>
