/*
  Restaurants missing from the county-derived catalog, verified against current
  official area or restaurant directories on 2026-11-08. These are discovery
  records only: their menus and nutrition have not yet been reviewed.
*/
(function () {
  "use strict";

  const reviewed = "2026-11-08";
  const bethesdaDirectory = "https://www.bethesda.org/dining-guide/";
  const rockvilleDirectory = "https://rockvilleredi.org/explore-rockville-global-bites-2026-restaurants/";
  const rioDirectory = "https://www.riolakefront.com/dining-food/";

  const makeRestaurant = ([id, name, cuisine, city, address, sourceUrl, menuUrl]) => ({
    id: `area-${id}`,
    name,
    cuisine,
    cities: [city],
    service: [],
    address,
    sourceUrl,
    menuUrl: menuUrl || sourceUrl,
    verified: reviewed,
    menuReviewStatus: "pending",
    catalogStatus: "Official area directory verified; menu and nutrition not yet reviewed",
    evidenceBasis: "Official area dining directory"
  });

  const bethesda = [
    ["bethesda-agora", "Agora Bethesda", "Mediterranean", "Bethesda", "1 Bethesda Metro Center, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-aji-nippon", "Aji-Nippon", "Japanese", "Bethesda", "6937 Arlington Rd, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-ap-pizza", "AP Pizza Shop", "Pizza", "Bethesda", "4747 Bethesda Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-aventino", "Aventino Cucina", "Italian", "Bethesda", "4747 Bethesda Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-bacchus", "Bacchus of Lebanon", "Lebanese", "Bethesda", "7945 Norfolk Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-bts", "BT's Bethesda", "American", "Bethesda", "4866 Cordell Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-beths", "Beth's Cafe & Bar", "American", "Bethesda", "4948 Fairmont Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-corella", "Corella Café", "American café", "Bethesda", "4646 Montgomery Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-fialova", "Fialova", "American", "Bethesda", "8120 Wisconsin Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-hip-flask", "Hip Flask Rooftop Bar", "American", "Bethesda", "7707 Woodmont Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-on-st-elmo", "On St. Elmo", "American", "Bethesda", "4915 St. Elmo Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-persimmon", "Persimmon", "American", "Bethesda", "7003 Wisconsin Ave, Bethesda, MD 20815", bethesdaDirectory],
    ["bethesda-seventh-state", "Seventh State", "American", "Bethesda", "7707 Woodmont Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-vim-victor", "Vim & Victor", "American café", "Bethesda", "6828 Wisconsin Ave, Bethesda, MD 20815", bethesdaDirectory],
    ["bethesda-hinata", "Hinata Sushi Carryout", "Japanese & sushi", "Bethesda", "4947 St. Elmo Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-maki-bar", "Maki Bar", "Japanese & sushi", "Bethesda", "6831 Wisconsin Ave, Suite 300, Bethesda, MD 20815", bethesdaDirectory],
    ["bethesda-takumi", "Takumi Sushi", "Japanese & sushi", "Bethesda", "4929 Bethesda Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-berries-bowls", "Berries & Bowls", "Bowls & smoothies", "Bethesda", "4961 Elm St, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-bradley-food", "Bradley Food & Beverage", "Deli", "Bethesda", "6904 Arlington Rd, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-brown-bag", "Brown Bag Deli", "Deli", "Bethesda", "1 Bethesda Metro Center, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-cornucopia", "Cornucopia", "Deli", "Bethesda", "8102 Norfolk Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-lilit", "Lilit Cafe", "Café & sandwiches", "Bethesda", "7921 Old Georgetown Rd, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-simona", "Simona Cafe", "Café & sandwiches", "Bethesda", "4520 East-West Hwy, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-vace", "Vace Italian Delicatessen", "Italian deli", "Bethesda", "4705 Miller Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-kabob-zone", "Kabob Zone", "Mediterranean", "Bethesda", "4924 Del Ray Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-tasty-grills", "Tasty Grills & Catering", "Mediterranean", "Bethesda", "7816 Old Georgetown Rd, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-zaatar", "Za'Atar Shawarma & Pizza", "Mediterranean", "Bethesda", "8021 Wisconsin Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-uncle-julios", "Uncle Julio's Bethesda", "Mexican", "Bethesda", "4870 Bethesda Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-tia-queta", "Tia Queta", "Mexican", "Bethesda", "4839 Del Ray Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-pisco-nazca", "Pisco y Nazca", "Peruvian", "Bethesda", "2 Bethesda Metro Center, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-mussel-bar", "Mussel Bar & Grille", "French & Belgian", "Bethesda", "4903 Cordell Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-curry-kitchen", "Bethesda Curry Kitchen", "Indian", "Bethesda", "4860 Cordell Ave, Bethesda, MD 20814", bethesdaDirectory],
    ["bethesda-foong-lin", "House of Foong Lin", "Chinese", "Bethesda", "4613 Willow Ln, Bethesda, MD 20815", bethesdaDirectory],
    ["bethesda-q-peter-chang", "Q by Peter Chang", "Chinese", "Bethesda", "4500 East-West Hwy, Suite 100, Bethesda, MD 20814", bethesdaDirectory]
  ];

  const rockville = [
    ["rockville-akagi", "Akagi Sushi & Hibachi", "Japanese & sushi", "Rockville", "5751 Fishers Ln, Rockville, MD 20852", rockvilleDirectory, "https://www.akagirockville.com/"],
    ["rockville-amai-crepe", "Amai Crepe", "Crêpes & café", "Rockville", "199 E Montgomery Ave, Rockville, MD 20850", rockvilleDirectory],
    ["rockville-anitas", "Anita's Restaurant", "Latin American", "Rockville", "1488 Rockville Pike, Rockville, MD 20852", rockvilleDirectory],
    ["rockville-arepateca", "Arepateca", "Venezuelan", "Rockville", "5751 Fishers Ln, Rockville, MD 20852", rockvilleDirectory],
    ["rockville-ba-le", "Ba Le Sandwiches", "Vietnamese", "Rockville", "765 Rockville Pike, Suite F/G, Rockville, MD 20852", rockvilleDirectory, "https://www.balesandwich.com/location/rockville"],
    ["rockville-corner-bites", "Corner Bites", "Café & sandwiches", "Rockville", "316 N Washington St, Rockville, MD 20850", rockvilleDirectory, "https://gocornerbites.com/"],
    ["rockville-darband", "Darband Kabob", "Persian", "Rockville", "765 Rockville Pike, Rockville, MD 20852", rockvilleDirectory, "https://darbandkabob.com/"],
    ["rockville-desi-cravings", "Desi Cravings", "Indian", "Rockville", "200 N Washington St, Rockville, MD 20850", rockvilleDirectory, "https://www.desicravingz.com/"],
    ["rockville-ding-cafe", "Ding Cafe Rockville", "Asian café", "Rockville", "785 Rockville Pike, Rockville, MD 20852", rockvilleDirectory, "https://ding.cafe/"],
    ["rockville-dolan", "Dolan Uyghur Cuisine", "Uyghur", "Rockville", "20-A Maryland Ave, Rockville, MD 20850", rockvilleDirectory, "https://www.dolanuyghur.com/"],
    ["rockville-don-chicken", "DON Chicken", "Korean fried chicken", "Rockville", "404 King Farm Blvd, Rockville, MD 20850", rockvilleDirectory, "https://donchickenmd.com/"],
    ["rockville-dosa-heaven", "Dosa Heaven", "South Indian", "Rockville", "260 N Washington St, Rockville, MD 20850", rockvilleDirectory, "https://www.dosaheaven.com/"],
    ["rockville-double-lucky-star", "Double Lucky Star Hong Kong BBQ", "Chinese", "Rockville", "15108 Frederick Rd, Rockville, MD 20850", rockvilleDirectory, "https://www.doubleluckystar.com/"],
    ["rockville-east-dumpling", "East Dumpling House", "Chinese", "Rockville", "12 N Washington St, Suite 7G, Rockville, MD 20850", rockvilleDirectory, "https://www.eastdumplingmd.com/"],
    ["rockville-first-street", "First Street Tavern", "American", "Rockville", "820 Baltimore Rd, Rockville, MD 20851", rockvilleDirectory],
    ["rockville-fork-kitchen", "Fork & Kitchen", "International", "Rockville", "150 Gibbs St, Rockville, MD 20850", rockvilleDirectory, "https://www.forkandkitchen.com/"],
    ["rockville-gimme-more-thai", "Gimme More Thai", "Thai", "Rockville", "13 Dawson Ave, Rockville, MD 20850", rockvilleDirectory, "https://www.gimmemorethaimd.com/"],
    ["rockville-glenwoods", "Glenwood's", "American", "Rockville", "2000 Tower Oaks Blvd, Rockville, MD 20852", rockvilleDirectory, "https://glenwoodsdining.com/rockville/"],
    ["rockville-grill-kabob", "Grill Kabob", "Mediterranean", "Rockville", "1409 Research Blvd, Suite B3, Rockville, MD 20850", rockvilleDirectory, "https://www.grillkabobofrockvillemd.com/"],
    ["rockville-kabuto", "Kabuto Hibachi & Sushi", "Japanese", "Rockville", "220 E Middle Ln, Rockville, MD 20850", rockvilleDirectory, "https://gokabuto.com/"],
    ["rockville-kc-filipino", "KC Filipino Restaurant", "Filipino", "Rockville", "15108 Frederick Rd, Suite A, Rockville, MD 20850", rockvilleDirectory],
    ["rockville-kumbia", "Kumbia", "Latin American", "Rockville", "100 B Gibbs St, Rockville, MD 20850", rockvilleDirectory, "http://www.kumbiarestaurant.com/"],
    ["rockville-kung-fu-12", "Kung Fu 12 Szechuan", "Chinese", "Rockville", "14921 Shady Grove Rd, Rockville, MD 20850", rockvilleDirectory, "https://www.kungfu12.com/"],
    ["rockville-la-baguette-antojitos", "La Baguette Antojitos", "Latin American bakery", "Rockville", "275 N Washington St, Rockville, MD 20850", rockvilleDirectory, "https://labaguette-antojitos.com/"],
    ["rockville-la-canela", "La Canela", "Peruvian", "Rockville", "141 Gibbs St, Suite D, Rockville, MD 20850", rockvilleDirectory, "http://www.lacanelaperu.com/"],
  ];

  const gaithersburg = [
    ["gaithersburg-charley-chesapeake", "Charley Chesapeake Chophouse & Bar", "American & seafood", "Gaithersburg", "9811 Washingtonian Blvd, Suite L9, Gaithersburg, MD 20878", "https://www.riolakefront.com/directory/"],
    ["gaithersburg-dave-busters", "Dave & Buster's Gaithersburg", "American", "Gaithersburg", "9811 Washingtonian Blvd, Gaithersburg, MD 20878", rioDirectory],
    ["gaithersburg-the-bench", "The Bench at Gaithersburg Marriott", "American", "Gaithersburg", "9751 Washingtonian Blvd, Gaithersburg, MD 20878", rioDirectory],
    ["gaithersburg-tous-les-jours", "TOUS les JOURS Gaithersburg", "Bakery & café", "Gaithersburg", "1 Grand Corner Ave, Gaithersburg, MD 20878", rioDirectory],
    ["gaithersburg-burgerfi", "BurgerFi Rio Lakefront", "Burgers", "Gaithersburg", "5 Grand Corner Ave, Gaithersburg, MD 20878", "https://www.riolakefront.com/directory/"],
    ["gaithersburg-lanzhou", "Lanzhou Hand Pulled Noodle", "Chinese noodles", "Gaithersburg", "3 Grand Corner Ave, Gaithersburg, MD 20878", "https://www.riolakefront.com/directory/"],
    ["gaithersburg-masons-lobster", "Mason's Famous Lobster Rolls", "Seafood", "Gaithersburg", "201 Boardwalk Pl, Gaithersburg, MD 20878", "https://www.riolakefront.com/directory/"],
    ["gaithersburg-sixty-vines", "Sixty Vines Gaithersburg", "Wine bar & American", "Gaithersburg", "212 Ellington Blvd, Suite B190, Gaithersburg, MD 20878", "https://www.sixtyvines.com/locations/gaithersburg-md"],
    ["gaithersburg-ruths-chris", "Ruth's Chris Steak House", "Steakhouse", "Gaithersburg", "106 Crown Park Ave, Gaithersburg, MD 20878", "https://www.ruthschris.com/happy-hour/md/gaithersburg-restaurant/7353"]
  ];

  window.AREA_RESTAURANTS = [...bethesda, ...rockville, ...gaithersburg].map(makeRestaurant);
})();
