﻿var allAds =
[
   { path: "Ads/applebees_001.jpg", link: "http://www.applebees.com" },
   { path: "Ads/barnes_and_noble_001.png", link: "http://www.barnesandnoble.com/" },
   { path: "Ads/best_buy_001.jpg", link: "http://www.bestbuy.com" },
   { path: "Ads/best_buy_002.gif", link: "http://www.bestbuy.com" },
   { path: "Ads/burger_king_001.jpg", link: "http://www.burgerking.com" },
   { path: "Ads/burger_king_002.jpg", link: "http://www.burgerking.com" },
   { path: "Ads/chipotle_001.jpg", link: "http://www.chipotle.com" },
   { path: "Ads/dicks_001.gif", link: "http://www.dickssportinggoods.com/" },
   { path: "Ads/dicks_002.gif", link: "http://www.dickssportinggoods.com/" },
   { path: "Ads/discount_tire_001.jpg", link: "http://www.discounttire.com" },
   { path: "Ads/dominos_001.png", link: "http://www.dominos.com" },
   { path: "Ads/footlocker_001.gif", link: "http://www.footlocker.com" },
   { path: "Ads/gamestop_001.jpg", link: "http://www.gamestop.com" },
   { path: "Ads/godfathers_pizza_001.png", link: "http://www.godfatherspizza.com" },
   { path: "Ads/home_depot_001.jpg", link: "http://www.homedepot.com" },
   { path: "Ads/jc_penney_001.gif", link: "http://www.jcpenny.com" },
   { path: "Ads/jc_penney_002.jpg", link: "http://www.jcpenny.com" },
   { path: "Ads/kmart_001.jpg", link: "http://www.kmart.com" },
   { path: "Ads/kohls_001.jpg", link: "http://www.kohls.com" },
   { path: "Ads/kohls_002.jpg", link: "http://www.kohls.com" },
   { path: "Ads/macys_001.gif", link: "http://www.macys.com" },
   { path: "Ads/macys_002.gif", link: "http://www.macys.com" },
   { path: "Ads/mcdonalds_001.jpg", link: "http://www.mcdonalds.com" },
   { path: "Ads/meijer_001.jpg", link: "http://www.meijer.com" },
   { path: "Ads/office_depot_001.jpg", link: "http://www.officedepot.com" },
   { path: "Ads/papa_johns_001.png", link: "http://www.papajohns.com" },
   { path: "Ads/papa_johns_002.png", link: "http://www.papajohns.com" },
   { path: "Ads/sears_001.gif", link: "http://www.sears.com" },
   { path: "Ads/sears_002.gif", link: "http://www.sears.com" },
   { path: "Ads/sharper_image_001.gif", link: "http://www.sharperimage.com" },
   { path: "Ads/Sprint_001.gif", link: "http://www.sprint.com" },
   { path: "Ads/starbucks_001.gif", link: "http://www.starbucks.com" },
   { path: "Ads/target_001.gif", link: "http://www.target.com" },
   { path: "Ads/target_002.gif", link: "http://www.target.com" },
   { path: "Ads/toysrus_001.jpg", link: "http://www.toysrus.com" },
   { path: "Ads/walmart_001.gif", link: "http://www.walmart.com" }
];

function getAd() {
   return allAds[Math.floor( Math.random() * allAds.length )];
}