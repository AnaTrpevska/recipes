const api_base_url = 'https://api.spoonacular.com/';
const api_recipes_endpoint = 'recipes/complexSearch';
const api_random_recipes_endpoint = 'recipes/random';
const api_recipe_endpoint = 'recipes/:id/information';

//const api_key = 'd7fe858c1bee4da19349f54fd4e31f27';
const api_key = '4344087b944e43ab8e36b153db5498ee';

function buildAPIUrl(endpoint, parameters = {}) {
    const search_params = new URLSearchParams(parameters);
    search_params.append('apiKey', api_key);
    return api_base_url + endpoint + '?' + search_params.toString();
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function paramsToObject(entries) {
    const result = {};
    for(const [key, value] of entries) {
        result[key] = value;
    }
    return result;
}

/************************* functionality *************************/

function renderRandomRecipesCarousel() {
    let random_recipes_carousel_indicators = $("#random-recipes-carousel-indicators");
    let random_recipes_list = $("#random-recipes-list");
    random_recipes_carousel_indicators.innerHTML = '';
    random_recipes_list.innerHTML = '';

    $.ajax({
        url: buildAPIUrl(api_random_recipes_endpoint, {'number': 10}),
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            data.recipes.forEach(function (item, index) {
                let slide = $('<li></li>');
                slide.attr('data-target', '#random-recipes-carousel');
                slide.attr('data-slide-to', index.toString());
                if (index === 0) {
                    slide.attr('class', "active");
                }
                slide.appendTo(random_recipes_carousel_indicators);

                $.get("items/random-recipe-list-item.html", function (data) {
                    data = data.replace("{{random-recipe-list-item-image}}", item.image);
                    data = data.replace("{{random-recipe-list-item-title}}", item.title);
                    data = data.replace("{{random-recipe-list-item-id}}", item.id);
                    data = data.replace("{{random-recipe-list-item-active}}", (index === 0 ? "active" : ""));
                    random_recipes_list.append(data);
                });
            });
        }
    });
}

function renderRecipesList(parameters = {}) {
    document.getElementById("page-title").innerText = capitalizeFirstLetter(parameters['type'] ? parameters['type'] : parameters['query']);
    let recipes_list = $("#recipes-list");
    recipes_list.innerHTML = '';
    parameters['number'] = 30;

    $.ajax({
        url: buildAPIUrl(api_recipes_endpoint, parameters),
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(`${data}`);
            data.results.forEach(function (item) {
                $.get("items/recipe-list-item.html", function (data) {
                    data = data.replace("{{recipe-list-item-image}}", item.image);
                    data = data.replace("{{recipe-list-item-title}}", item.title);
                    data = data.replace("{{recipe-list-item-id}}", item.id);
                    recipes_list.append(data);
                });
            });
        }
    });
}

function renderRecipeById(id) {
    $.ajax({
        url: buildAPIUrl(api_recipe_endpoint.replace(':id', id)),
        type: 'GET',
        async: false,
        dataType: 'json',
        success: function (data) {
            console.log(`${data}`);
            document.getElementById("recipe-title").innerText = data.title;
            document.getElementById("recipe-image").setAttribute('src', data.image);
            document.getElementById("recipe-title-2").innerText = data.title;
            document.getElementById("recipe-summary-2").innerHTML = data.summary;
            document.getElementById("recipe-ready-in-minutes").innerText = 'Ready in ' + data.readyInMinutes + ' minutes.';

            let dish_types = document.getElementById("recipe-dish-types");
            data.dishTypes.forEach(function (item) {
                let dish_type = $('<a></a> ').addClass('badge badge-secondary mr-1').attr('href', 'recipes-list.html?type=' + item);
                dish_type.text('#' + item);
                dish_type.appendTo(dish_types);
            });

            let ingredients = document.getElementById("recipe-ingredients");
            data.extendedIngredients.forEach(function (item) {
                let ingredient = $('<li></li> ');
                let amount = Math.round(item.measures.metric.amount);
                let unit = item.measures.metric.unitLong;
                ingredient.text(capitalizeFirstLetter(item.name) + ' (' +  amount + ' ' + unit + ')');
                ingredient.appendTo(ingredients);
            });
        }
    });
}

function searchRecipe() {
    let search_query = $("#search-query").val();
    if (search_query) {
        window.location.href = "recipes-list.html?query=" + search_query;
    }
}