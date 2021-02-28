import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
   _parentElement = document.querySelector('.pagination');

   addHandlerClick(handler) {
      this._parentElement.addEventListener('click', function(e) {
         const btn = e.target.closest('.btn--inline');
         if(!btn) return;
         const goToPage = +btn.dataset.goto;
         handler(goToPage);
      });
   }

   _generateMarkup() {
      const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
      const curPage = this._data.page;

      // Page 1 and there are other pages
      if(curPage === 1 && numPages > 1) {
         return  this._generateMarkupBtn( false, true, curPage );;
      }
      // Page 1 and no other pages

      // Last page
      if(curPage === numPages && numPages > 1) {
         return  this._generateMarkupBtn( true, false, curPage );
      }

      // Other page with forward and back
      if(curPage < numPages && curPage > 1) {
         return this._generateMarkupBtn( true, true, curPage );
      }

      return;
   }

   _generateMarkupBtn( btnBack = false, btnForward = false, curPage) {
      let markup = '';
      if(btnBack) markup += `<button data-goto="${curPage - 1}" class="btn--inline pagination__btn--prev">
                                 <svg class="search__icon">
                                    <use href="${icons}#icon-arrow-left"></use>
                                 </svg>
                                 <span>Page ${curPage - 1}</span>
                              </button>`;
      if(btnForward) markup += `<button data-goto="${curPage + 1}" class="btn--inline pagination__btn--next">
                                    <span>Page ${curPage + 1}</span>
                                       <svg class="search__icon">
                                    <use href="${icons}#icon-arrow-right"></use>
                                    </svg>
                                 </button>`;
      return markup;
   }
}

export default new PaginationView();
