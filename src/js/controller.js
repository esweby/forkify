import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';

import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import {MODAL_CLOSE_SEC} from './config.js'

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);
    
    if (!id) return;
    recipeView.renderSpinner();

    // 0) Results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    
    // 1) Load Recipe
    await model.loadRecipe(id); // Gives access to state.recipe
    // 2) Rendering recipe
    recipeView.render(model.state.recipe);
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {

    recipeView.renderError();
  }
}

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();
    // 1) Get Search Query
    const query = searchView.getQuery();
    if(!query) return;

    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage(1));

    // 4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
}

const controlPagination = function(goToPage) {
  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) render new pagination buttons
  paginationView.render(model.state.search);
}

const controlServings = function(newServing) {
  // update the recipe servings
  model.updateServings(newServing);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
}

const controlAddBookmark = function() { 
  // 1 Add or remove bookmark
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  } 
  // 2 Update recipe view
  recipeView.update(model.state.recipe);

  // 3 Render bookmarks
  bookmarksView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    // Show loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe view
    await model.uploadRecipe(newRecipe);
    
    // Render recipe
    recipeView.render(model.state.recipe);

    // Success Message
    addRecipeView.renderMessage();

    // Render bookmarks
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function() {addRecipeView.toggleWindow()}, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
  
}

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  
}
init();