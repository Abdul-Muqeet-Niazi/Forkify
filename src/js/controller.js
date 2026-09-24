import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// Importing programmatic elements like images etc
// import icons from '../img/icons.svg';

// Polyfilling everything
import 'core-js/stable';
// Polyfilling async/await
import 'regenerator-runtime/runtime';

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

// Control the recipe
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    // Guard clause
    if (!id) return;

    // Render the spinner
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // Update bookmarks view
    bookmarkView.update(model.state.bookmarks);

    // Load the recipe
    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);
    // Also we can do this but honestly I it like better like this upper nice render method
    // const recipeView = new recipeView(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Render the spinner before fetching the results
    resultsView.renderSpinner();

    // Get search query
    const query = searchView.getQuery();
    // Guard Clause
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);

    // Render the results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError(err);
  }
};

const controlPagination = function (gotoPage) {
  // Render NEW results
  resultsView.render(model.getSearchResultsPage(gotoPage));

  // Render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  // Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarkView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe, errorMessage) {
  try {
    // Loading the spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Rendering the personal recipe
    recipeView.render(model.state.recipe);

    // Render this recipe as bookmark
    bookmarkView.render(model.state.bookmarks);

    // Update the recipe URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Shows the success message
    addRecipeView.renderError();

    // Hide the modal panel after 2.5 seconds
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

// Publisher-Subscriber Pattern
// Subscriber
const init = function () {
  recipeView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmarks(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView._addHandlerUpload(controlAddRecipe);
};
init();
