/*
  Chain-menu evidence reviewed 2026-10-26.
  These templates expand into location-linked dish records only for county catalog
  restaurants whose names match the named brand. Availability can vary by franchise.
*/
(function () {
  "use strict";

  const reviewed = "2026-10-26";
  const subwayGuide = "https://media.subway.com/dam/urn:aaid:aem:f20a4541-8c88-496b-940d-4aa8318cae26/original/as/us-nutrition-en.pdf";
  const dunkinGuide = "https://www.dunkindonuts.com/content/dam/dd/pdf/nutrition.pdf";
  const fiveGuysGuide = "https://www.fiveguys.com/wp-content/uploads/2025/07/five-guys-us-nutrition-allergen-guide-english-1-final.pdf";
  const chickFilAGuide = "https://www.chick-fil-a.com/Nutrition-Allergens";
  const firstWatchGuide = "https://firstwatch.com/nutrition-and-allergens";
  const paneraGuide = "https://www.panerabread.com/content/dam/panerabread/documents/c8-26-nutrition-guide.pdf";
  const sweetgreenGuide = "https://www.sweetgreen.com/nutrition";
  const cavaGuide = "https://assets.ctfassets.net/kugm9fp9ib18/7KrOGNUFZjBddOWezWLWwm/a20b10d71b9b0496f96b8e38bd8e0211/CAVA-REC-GID-0326-AllergReg.pdf";
  const qdobaGuide = "https://assets.ctfassets.net/0tc4847zqy12/bQFJBCmsAk4ww4qzdfAOm/10ad09aaf097d3e9fb10fc4c62af52c3/Nutrition_9.1.26.pdf";
  const honeygrowNutrition = "https://nutrition.honeygrow.com/";
  const potbellyMenu = "https://www.potbelly.com/menu?potbellyStoreId=198";
  const californiaTortillaNutrition = "https://californiatortilla.com/nutritional-calculator/";

  const rules = [
    {
      brand: "subway",
      matches: name => /^Subway\b/i.test(name),
      cuisine: "Sandwiches & salads",
      menuUrl: "https://www.subway.com/en-us/menunutrition/nutrition",
      dishes: [
        {id:"veggie-delite",name:'6" Veggie Delite (Fresh Fit build)',description:"Official Fresh Fit values include multigrain bread and the standard fresh vegetables.",sodium:360,satFat:1,calories:220,sourceType:"official",sourceUrl:subwayGuide,sourceLabel:"Subway U.S. nutrition guide — October 2026",modification:"Order the Fresh Fit build on multigrain with vegetables; skip cheese and sauce so the published build remains applicable.",tags:["Plant-based","Whole grains","Vegetable-forward"]},
        {id:"grilled-chicken",name:'6" Grilled Chicken (Fresh Fit build)',description:"Official Fresh Fit values include multigrain bread, grilled chicken, and the standard fresh vegetables.",sodium:570,satFat:1,calories:300,sourceType:"official",sourceUrl:subwayGuide,sourceLabel:"Subway U.S. nutrition guide — October 2026",modification:"Order the Fresh Fit build on multigrain; skip cheese and sauce. Use red-wine vinegar if available rather than a salty dressing.",tags:["Chicken","Whole grains","Vegetable-forward"]},
        {id:"rotisserie-chicken",name:'6" Rotisserie-Style Chicken (Fresh Fit build)',description:"Official Fresh Fit values include multigrain bread, rotisserie-style chicken, and the standard fresh vegetables.",sodium:750,satFat:2,calories:310,sourceType:"official",sourceUrl:subwayGuide,sourceLabel:"Subway U.S. nutrition guide — October 2026",modification:"Order the Fresh Fit build on multigrain with no cheese or sauce; add vegetables freely within the standard build.",tags:["Chicken","Whole grains","Vegetable-forward"]},
        {id:"veggie-salad",name:"Veggie Delite salad (no dressing)",description:"Published salad values exclude dressing. The guide lists vegetables and standard toppings for this salad.",sodium:290,satFat:4,calories:140,sourceType:"official",sourceUrl:subwayGuide,sourceLabel:"Subway U.S. nutrition guide — October 2026",modification:"Order without dressing; use red-wine vinegar if available and avoid cheese or salty add-ons not included in the published build.",tags:["Vegetable-forward","Salad","Plant-forward"]}
      ]
    },
    {
      brand: "starbucks",
      matches: name => /^Starbucks Coffee\b/i.test(name),
      cuisine: "Coffee & café",
      menuUrl: "https://www.starbucks.com/menu",
      dishes: [
        {id:"mush-oats",name:"MUSH Chocolate Peanut Butter Protein Overnight Oats",description:"Packaged overnight oats with oats, cocoa, peanuts, oatmilk, dates, and sea salt; values are for one published serving.",sodium:280,satFat:2,calories:290,sourceType:"official",sourceUrl:"https://www.starbucks.com/menu/product/39314/single/nutrition",sourceLabel:"Official Starbucks nutrition page",modification:"Order the packaged serving as listed; confirm availability at this café.",tags:["Whole grains","Plant-based","Breakfast"]},
        {id:"turkey-bacon",name:"Turkey Bacon, Cheddar & Egg White Sandwich",description:"Egg whites, turkey bacon, and reduced-fat cheddar on a wheat English muffin; values are for the standard serving.",sodium:600,satFat:3.5,calories:260,sourceType:"official",sourceUrl:"https://www.starbucks.com/menu/product/368/single/nutrition",sourceLabel:"Official Starbucks nutrition page",modification:"Order the standard sandwich and avoid adding salted snacks; availability varies by café.",tags:["Breakfast","Protein","Whole grain"]},
        {id:"spinach-wrap",name:"Spinach, Feta & Egg White Wrap",description:"Egg whites, spinach, feta, and tomato spread in a whole-wheat wrap; values are for the standard serving.",sodium:840,satFat:3.5,calories:290,sourceType:"official",sourceUrl:"https://www.starbucks.com/menu/product/371/single/nutrition",sourceLabel:"Official Starbucks nutrition page",modification:"Order as listed and pair with an unsweetened drink; confirm local availability.",tags:["Breakfast","Vegetable-forward","Whole grain"]}
      ]
    },
    {
      brand: "dunkin",
      matches: name => /^Dunkin Donuts(?:\/Baskin Robbins)?\b/i.test(name),
      cuisine: "Coffee & breakfast",
      menuUrl: "https://www.dunkindonuts.com/en/menu/nutrition",
      dishes: [
        {id:"avocado-toast",name:"Avocado Toast",description:"Dunkin's published serving of avocado toast; values are for one piece without bacon.",sodium:530,satFat:1.5,calories:240,sourceType:"official",sourceUrl:dunkinGuide,sourceLabel:"Dunkin' nutrition guide — May 2026",modification:"Order the standard avocado toast without bacon or extra spread; confirm participation at this location.",tags:["Plant-based","Fiber","Breakfast"]},
        {id:"multigrain-bagel",name:"Multigrain Bagel (no spread)",description:"Published values for one multigrain bagel; cream cheese, butter, and other spreads are not included.",sodium:550,satFat:1,calories:380,sourceType:"official",sourceUrl:dunkinGuide,sourceLabel:"Dunkin' nutrition guide — May 2026",modification:"Order toasted with no butter or cream cheese; add fruit from elsewhere if you need a fuller meal.",tags:["Whole grains","Fiber","Breakfast"]},
        {id:"cinnamon-raisin-bagel",name:"Cinnamon Raisin Bagel (no spread)",description:"Published values for one cinnamon-raisin bagel; spreads are not included.",sodium:510,satFat:0,calories:320,sourceType:"official",sourceUrl:dunkinGuide,sourceLabel:"Dunkin' nutrition guide — May 2026",modification:"Order toasted with no butter or cream cheese; choose an unsweetened drink.",tags:["Breakfast","Low saturated fat"]}
      ]
    },
    {
      brand: "five-guys",
      matches: name => /^Five Guys\b/i.test(name),
      cuisine: "Burgers",
      menuUrl: "https://www.fiveguys.com/menu/",
      dishes: [
        {id:"lettuce-patty",name:"Single hamburger patty in a lettuce wrap or bowl",description:"Approximate component values use the official single hamburger-patty row. Lettuce and any added toppings are not included in the numeric total.",sodium:50,satFat:8,calories:302,sourceType:"calculated",sourceUrl:fiveGuysGuide,sourceLabel:"Five Guys U.S. nutrition and allergen guide",modification:"Ask for one patty in a lettuce wrap or bowl with no cheese, bacon, mayo, ketchup, pickles, relish, or added salt. Fresh vegetables change the shown total slightly.",tags:["Customizable","Protein","Lettuce wrap"]}
      ]
    },
    {
      brand: "chick-fil-a",
      matches: name => /^Chick-Fil-A\b/i.test(name),
      cuisine: "Chicken",
      menuUrl: "https://www.chick-fil-a.com/menu",
      dishes: [
        {id:"grilled-sandwich",name:"Grilled Chicken Sandwich",description:"Marinated grilled chicken breast on a multigrain bun with lettuce and tomato; values are for the standard sandwich.",sodium:765,satFat:2.5,calories:390,sourceType:"official",sourceUrl:"https://www.chick-fil-a.com/menu/entrees/grilled-chicken-sandwich",sourceLabel:"Official Chick-fil-A nutrition page",modification:"Order without dipping sauce and choose fruit instead of fries; side nutrition is not included here.",tags:["Chicken","Whole grain","Fast food"]},
        {id:"nuggets-kale",name:"8-count Grilled Nuggets + Kale Crunch Side",description:"Approximate total sums the official 8-count grilled nuggets and standard Kale Crunch Side values.",sodium:690,satFat:2,calories:300,sourceType:"calculated",sourceUrl:chickFilAGuide,sourceLabel:"Official Chick-fil-A nutrition guide components",modification:"Skip dipping sauce. The Kale Crunch Side already includes vinaigrette and salted almonds in its published values.",tags:["Chicken","Vegetable-forward","Component total"]}
      ]
    },
    {
      brand: "first-watch",
      matches: name => /^First Watch Restaurant\b/i.test(name),
      cuisine: "Breakfast & brunch",
      menuUrl: "https://firstwatch.com/menu/",
      dishes: [
        {id:"tri-athlete",name:"Tri-Athlete",description:"Nutrition values are for First Watch's published standard Tri-Athlete serving.",sodium:840,satFat:0,calories:450,sourceType:"official",sourceUrl:firstWatchGuide,sourceLabel:"Official First Watch nutrition table",modification:"Order the standard plate and avoid adding table salt or salty breakfast meats.",tags:["Breakfast","Low saturated fat","Protein"]},
        {id:"power-wrap",name:"Power Wrap",description:"Nutrition values are for First Watch's published standard Power Wrap serving.",sodium:950,satFat:3,calories:500,sourceType:"official",sourceUrl:firstWatchGuide,sourceLabel:"Official First Watch nutrition table",modification:"Order the standard wrap without extra sauces or salty sides.",tags:["Breakfast","Protein","Wrap"]},
        {id:"half-market-veggie",name:"Half Market Veggie Sandwich",description:"Published values cover the half-sandwich row in the Two For You section; any paired soup, salad, or side is separate.",sodium:490,satFat:4,calories:320,sourceType:"official",sourceUrl:firstWatchGuide,sourceLabel:"Official First Watch nutrition table",modification:"Pair with the fresh fruit cup rather than potatoes or soup; the fruit's nutrition is not included in the shown total.",tags:["Vegetarian","Half portion","Vegetable-forward"]}
      ]
    },
    {
      brand: "panera",
      matches: name => /^Panera Bread\b/i.test(name),
      cuisine: "Café & bakery",
      menuUrl: "https://www.panerabread.com/en-us/menu.html",
      dishes: [
        {id:"cranberry-walnut-chicken",name:"Cranberry Walnut Chicken Salad Sandwich — whole",description:"Current published values are for the whole sandwich on country rustic sourdough.",sodium:970,satFat:3.5,calories:690,sourceType:"official",sourceUrl:paneraGuide,sourceLabel:"Panera U.S. nutrition guide — September 2026",modification:"Order the standard whole sandwich and choose the apple side rather than chips, bread, or soup. The side is not included in the displayed total.",tags:["Substantial meal","Chicken","Whole sandwich"]},
        {id:"harvest-medley-salad",name:"Harvest Medley Salad — whole",description:"Current published values are for the whole meatless Harvest Medley Salad with pecans.",sodium:870,satFat:8,calories:750,sourceType:"official",sourceUrl:paneraGuide,sourceLabel:"Panera U.S. nutrition guide — September 2026",modification:"Order the standard salad and avoid adding soup, bread, chips, or extra dressing. Confirm that this seasonal item is available.",tags:["Substantial meal","Vegetable-forward","Vegetarian"]},
        {id:"farmhouse-crunch-half",name:"Farmhouse Crunch Salad — half",description:"Current published values are for the half-size Farmhouse Crunch Salad.",sodium:600,satFat:7,calories:400,sourceType:"official",sourceUrl:paneraGuide,sourceLabel:"Panera U.S. nutrition guide — September 2026",modification:"Keep the half portion and choose an apple side if you want more volume; the apple is not included in the displayed total.",tags:["Vegetable-forward","Half portion","Lower sodium"]}
      ]
    },
    {
      brand: "sweetgreen",
      matches: name => /^Sweetgreen$/i.test(name),
      cuisine: "Salads & bowls",
      menuUrl: sweetgreenGuide,
      dishes: [
        {id:"omega-glow",name:"Omega Glow",description:"Current composed bowl with restaurant-published nutrition per serving as prepared; values may vary by location.",sodium:970,satFat:8,calories:710,sourceType:"official",sourceUrl:sweetgreenGuide,sourceLabel:"Official sweetgreen nutrition guide",modification:"Order the published standard bowl. Ask whether dressing can be served on the side, but do not assume the displayed nutrition applies after changes.",tags:["Substantial meal","Fish","Whole grains"]}
      ]
    },
    {
      brand: "cava",
      matches: name => /^(?:Cava|Cava Mezze Grill(?: - Bethesda)?)$/i.test(name),
      cuisine: "Mediterranean bowls",
      menuUrl: "https://cava.com/menu",
      dishes: [
        {id:"lentil-greens-steak",name:"Black lentils, SuperGreens & grilled steak bowl",description:"Approximate total sums one published serving each of black lentils, SuperGreens, and grilled steak. No dips, toppings, or dressing are included.",sodium:835,satFat:4,calories:475,sourceType:"calculated",sourceUrl:cavaGuide,sourceLabel:"CAVA nutrition and allergen guide — March 2026",modification:"Build the bowl with black lentils, SuperGreens, and grilled steak only. Skip dips, feta, pickles, sauces, dressing, and other toppings unless you recalculate them.",tags:["Substantial meal","High fiber","Vegetable-forward","Customizable"]}
      ]
    },
    {
      brand: "honeygrow",
      matches: name => /^Honeygrow$/i.test(name),
      cuisine: "Stir-fry & salads",
      menuUrl: honeygrowNutrition,
      dishes: [
        {id:"red-coconut-curry",name:"Red Coconut Curry",description:"The current honeygrow nutrition site publishes 640 calories for this menu item. Complete sodium and saturated-fat values were not captured, so this is not treated as a verified DASH fit.",sodium:null,satFat:null,calories:640,sourceType:"unknown",sourceUrl:honeygrowNutrition,sourceLabel:"Official honeygrow nutrition site",modification:"Ask whether the curry sauce can be light or served on the side. Any modification changes the published calorie value, and sodium and saturated fat remain unknown.",tags:["Substantial meal","Stir-fry","Nutrition incomplete"]},
        {id:"sweet-soy-five-spice",name:"Sweet Soy Five Spice",description:"The official honeygrow menu publishes 590 calories for this turkey-meatball stir-fry. Complete sodium and saturated-fat values were not captured, so this is not treated as a verified DASH fit.",sodium:null,satFat:null,calories:590,sourceType:"unknown",sourceUrl:"https://www.honeygrow.com/menu/",sourceLabel:"Official honeygrow menu",modification:"Request less sweet-soy sauce or sauce on the side if the kitchen allows it. The resulting nutrition is unknown.",tags:["Substantial meal","Turkey","Nutrition incomplete"]},
        {id:"fall-harvest",name:"Fall Harvest",description:"The official honeygrow menu publishes 510 calories for this seasonal item. Complete sodium and saturated-fat values were not captured, and seasonal availability can change.",sodium:null,satFat:null,calories:510,sourceType:"unknown",sourceUrl:"https://www.honeygrow.com/menu/",sourceLabel:"Official honeygrow menu",modification:"Confirm the current build and ask for dressing or sauce on the side. Do not assume the displayed calorie value applies after changes.",tags:["Substantial meal","Seasonal","Nutrition incomplete"]}
      ]
    },
    {
      brand: "qdoba",
      matches: name => /^Qdoba Mexican (?:Eats|Grill)$/i.test(name),
      cuisine: "Mexican-inspired",
      menuUrl: "https://www.qdoba.com/nutrition-allergens",
      dishes: [
        {id:"custom-brown-rice-black-bean-guac",name:"Brown rice, black bean & guacamole bowl",description:"Approximate total sums official portions of seasoned brown rice, black beans, hand-crafted guacamole, romaine lettuce, and pico de gallo. Actual scoops vary.",sodium:990,satFat:2,calories:500,sourceType:"calculated",sourceUrl:qdobaGuide,sourceLabel:"QDOBA Nutrition Facts — September 2026",modification:"Build only with seasoned brown rice, black beans, guacamole, romaine, and pico. Skip tortilla, cheese, queso, sour cream, dressing, chips, and extra salsa unless you recalculate them.",tags:["Substantial meal","Plant-based","Component total","Customizable"]},
        {id:"keto-bowl-chicken",name:"Keto Bowl — Chicken",description:"Current published nutrition for QDOBA's standard chicken Keto Bowl serving.",sodium:990,satFat:9,calories:400,sourceType:"official",sourceUrl:qdobaGuide,sourceLabel:"QDOBA Nutrition Facts — September 2026",modification:"Order the published standard bowl without extras; confirm it is offered at this location.",tags:["Chicken","Bowl","Published nutrition"]},
        {id:"citrus-lime-chicken-salad",name:"Citrus Lime Chicken Salad",description:"Current published nutrition for the standard salad. It exceeds the app's default 1,000 mg sodium filter but appears when that ceiling is relaxed.",sodium:1210,satFat:4.5,calories:540,sourceType:"official",sourceUrl:qdobaGuide,sourceLabel:"QDOBA Nutrition Facts — September 2026",modification:"Order without extra toppings or sides. Ask whether dressing can be served on the side, but do not assume the displayed nutrition applies after changes.",tags:["Substantial meal","Chicken","Salad"]},
        {id:"fajita-vegan-bowl",name:"Fajita Vegan Bowl",description:"Current published nutrition for QDOBA's standard Fajita Vegan Bowl. It exceeds the app's default 1,000 mg sodium filter.",sodium:1380,satFat:2.5,calories:530,sourceType:"official",sourceUrl:qdobaGuide,sourceLabel:"QDOBA Nutrition Facts — September 2026",modification:"Order without extras. If you remove ingredients, treat the resulting nutrition as unknown unless you recalculate from the component table.",tags:["Substantial meal","Plant-based","Bowl"]}
      ]
    },
    {
      brand: "potbelly",
      matches: name => /^Potbelly Sandwich Shop$/i.test(name),
      cuisine: "Sandwiches & salads",
      menuUrl: potbellyMenu,
      dishes: [
        {id:"skinny-turkey-swiss",name:"Skinny Turkey Breast & Swiss",description:"This item is listed on Potbelly's current official menu, but complete current sodium, saturated-fat, and calorie values were not captured.",sodium:null,satFat:null,calories:null,sourceType:"unknown",sourceUrl:potbellyMenu,sourceLabel:"Official Potbelly menu",modification:"Ask whether cheese and condiments can be omitted, load up on fresh vegetables, and avoid soup or chips. Nutrition after changes remains unknown.",tags:["Turkey","Sandwich","Nutrition incomplete"]},
        {id:"skinny-grilled-chicken",name:"Skinny Grilled Chicken & Cheddar",description:"This item is listed on Potbelly's current official menu, but complete current nutrition was not captured.",sodium:null,satFat:null,calories:null,sourceType:"unknown",sourceUrl:potbellyMenu,sourceLabel:"Official Potbelly menu",modification:"Request no cheddar or mayo, add fresh vegetables, and skip salty sides. Nutrition after changes remains unknown.",tags:["Chicken","Sandwich","Nutrition incomplete"]},
        {id:"powerhouse-salad",name:"Powerhouse Salad",description:"Potbelly's official menu lists a salad with grilled chicken, avocado, hummus, egg, cucumber, tomato, and non-fat vinaigrette. Complete nutrition was not captured.",sodium:null,satFat:null,calories:null,sourceType:"unknown",sourceUrl:"https://www.potbelly.com/menu/salads/individual-salads",sourceLabel:"Official Potbelly salad menu",modification:"Ask for vinaigrette and hummus on the side and no extra salt. Complete nutrition remains unknown.",tags:["Chicken","Salad","Vegetable-forward","Nutrition incomplete"]}
      ]
    },
    {
      brand: "california-tortilla",
      matches: name => /^California Tortilla-/i.test(name),
      cuisine: "Mexican-inspired",
      menuUrl: californiaTortillaNutrition,
      dishes: [
        {id:"build-your-own-bowl",name:"Build Your Own bowl",description:"California Tortilla's official calculator supports a customizable bowl, but no fixed build has one complete nutrition total. Values depend on every selected component.",sodium:null,satFat:null,calories:null,sourceType:"unknown",sourceUrl:californiaTortillaNutrition,sourceLabel:"Official California Tortilla nutrition calculator",modification:"Choose a bowl with beans, vegetables, and a simply prepared protein; keep rice modest and skip queso, cheese, sour cream, chips, and salty sauces. Verify the final build in the official calculator.",tags:["Customizable","Bowl","Nutrition incomplete"]},
        {id:"honey-lime-burrito",name:"Honey Lime Burrito",description:"The Honey Lime Burrito appears in California Tortilla's current official calculator, but a complete selected nutrition total was not captured.",sodium:null,satFat:null,calories:null,sourceType:"unknown",sourceUrl:californiaTortillaNutrition,sourceLabel:"Official California Tortilla nutrition calculator",modification:"Ask whether sauce, cheese, and sour cream can be omitted or served on the side. Complete nutrition after changes remains unknown.",tags:["Burrito","Menu verified","Nutrition incomplete"]}
      ]
    },
    {
      brand: "wendys",
      matches: name => /^Wendy's\b/i.test(name),
      cuisine: "Burgers & fast food",
      menuUrl: "https://order.wendys.com/us/en/national/menu",
      dishes: [
        {id:"chili-cheese-potato",name:"Chili & Cheese Baked Potato",description:"Baked potato with Wendy's chili, cheese sauce, and shredded cheddar; values are for the published standard serving.",sodium:830,satFat:7,calories:490,sourceType:"official",sourceUrl:"https://order.wendys.com/us/en/national/menu/fries-sides/chili-cheese-baked-potato",sourceLabel:"Official Wendy's U.S. nutrition page",modification:"Order as the standard item and skip additional salty sides or sauces. Availability may vary.",tags:["Fiber","Potato","Fast food"]},
        {id:"honey-butter-biscuit",name:"Honey Butter Biscuit",description:"Buttermilk biscuit with maple honey butter; it fits the active sodium and saturated-fat ceilings but is not vegetable-forward.",sodium:740,satFat:8,calories:330,sourceType:"official",sourceUrl:"https://order.wendys.com/us/en/national/menu/biscuits/honey-butter-biscuit",sourceLabel:"Official Wendy's U.S. nutrition page",modification:"Treat as a small breakfast item rather than a full balanced meal; pair with fruit and avoid salty add-ons.",tags:["Breakfast","Small portion"]}
      ]
    }
  ];

  const generated = [];
  const reviewedRestaurants = [];
  const catalog = Array.isArray(window.RESTAURANT_CATALOG) ? window.RESTAURANT_CATALOG : [];

  catalog.forEach(restaurant => {
    const rule = rules.find(candidate => candidate.matches(restaurant.name));
    if (!rule) return;
    reviewedRestaurants.push({id:restaurant.id,brand:rule.brand,cuisine:rule.cuisine,menuUrl:rule.menuUrl});
    rule.dishes.forEach(dish => generated.push({
      ...dish,
      id:`menu-${restaurant.id}-${dish.id}`,
      restaurantId:restaurant.id,
      verified:reviewed,
      locationApplicability:"Shared U.S. chain menu; confirm availability at this location"
    }));
  });

  window.MENU_DISHES = generated;
  window.MENU_REVIEWED_RESTAURANTS = reviewedRestaurants;
})();
