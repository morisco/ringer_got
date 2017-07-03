<nav id="mobile-nav">
                <div class="toggle-zone">
                </div>
                <div class="toggle-close"></div>
                <div class="filter-logo background-theme">
                    <a href="http://theringer.com" target="_blank">
                        <img src="img/logo-square.png" alt="Go To The Ringer" />
                    </a>
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
                        <li class="<?php echo ($sort_list_id === 'ringer') ? 'active_filter color-theme' : '' ?>"data-sort-id="ringer">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13.03"><title>newarrow</title><rect class="arrow-fill" y="5.75" width="15" height="1.5"/><rect class="arrow-fill" x="22.59" y="12.58" width="1.5" height="8.15" transform="translate(-16.69 8.13) rotate(-45)"/><rect class="arrow-fill" x="19.26" y="22.11" width="8.15" height="1.5" transform="translate(-21.08 9.95) rotate(-45)"/></svg>
                            <span>Mock Draft</span>
                        </li>
                        <li class="<?php echo ($sort_list_id === 'kevin') ? 'active color-theme' : '' ?>"data-sort-id="kevin">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13.03"><title>newarrow</title><rect class="arrow-fill" y="5.75" width="15" height="1.5"/><rect class="arrow-fill" x="22.59" y="12.58" width="1.5" height="8.15" transform="translate(-16.69 8.13) rotate(-45)"/><rect class="arrow-fill" x="19.26" y="22.11" width="8.15" height="1.5" transform="translate(-21.08 9.95) rotate(-45)"/></svg>
                            <span>Kevin O&rsquo;Connor&rsquo;s Big Board</span>
                        </li>
                        <li class="<?php echo ($sort_list_id === 'danny') ? 'active color-theme' : '' ?>"data-sort-id="danny">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13.03"><title>newarrow</title><rect class="arrow-fill" y="5.75" width="15" height="1.5"/><rect class="arrow-fill" x="22.59" y="12.58" width="1.5" height="8.15" transform="translate(-16.69 8.13) rotate(-45)"/><rect class="arrow-fill" x="19.26" y="22.11" width="8.15" height="1.5" transform="translate(-21.08 9.95) rotate(-45)"/></svg>
                            <span>Danny Chau&rsquo;s Big Board</span>
                        </li>
                        <li class="<?php echo ($sort_list_id === 'jonathan') ? 'active color-theme' : '' ?>"data-sort-id="jonathan">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13.03"><title>newarrow</title><rect class="arrow-fill" y="5.75" width="15" height="1.5"/><rect class="arrow-fill" x="22.59" y="12.58" width="1.5" height="8.15" transform="translate(-16.69 8.13) rotate(-45)"/><rect class="arrow-fill" x="19.26" y="22.11" width="8.15" height="1.5" transform="translate(-21.08 9.95) rotate(-45)"/></svg>
                            <span>Jonathan Tjarks&rsquo; Big Board</span>
                        </li>
                        <li class="<?php echo ($sort_list_id === 'az') ? 'active color-theme' : '' ?>"data-sort-id="az">
                            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 13.03"><title>newarrow</title><rect class="arrow-fill" y="5.75" width="15" height="1.5"/><rect class="arrow-fill" x="22.59" y="12.58" width="1.5" height="8.15" transform="translate(-16.69 8.13) rotate(-45)"/><rect class="arrow-fill" x="19.26" y="22.11" width="8.15" height="1.5" transform="translate(-21.08 9.95) rotate(-45)"/></svg>
                            <span>Sort A-Z</span>
                        </li>
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
