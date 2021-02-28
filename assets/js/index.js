// https://learn.jquery.com/using-jquery-core/document-ready/
// The ready() method is used to make a function available after the Page is loaded
$(document).ready(function () {
    // This method is located in the assets/js/recipes-main.js script
    // And is used to get data from the API and render 10 random recipes in the carousel div (list)
    renderRandomRecipesCarousel();
});