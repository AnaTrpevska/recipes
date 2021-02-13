$(document).ready(function () {
    const url_params = new URLSearchParams(window.location.search);
    const id = url_params.get('id');
    renderRecipeById(id);
});