$(document).ready(function () {
    const url_params = new URLSearchParams(window.location.search);
    renderRecipesList(paramsToObject(url_params))
});