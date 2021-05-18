export default class SortableTable {
    element = null;
    constructor(headerConfig = [], {data = []} = {})   {   //constructor(headerConfig = [], {data = []} = {})   //constructor (headerConfig = [], data = []) 

            this.data = data;
            this.headerConfig = headerConfig;
            this.render();
    }

    getHeader(data) {
        const header = `
            <div class="sortable-table__header sortable-table__row" data-id="title" data-sortable="true" data-order="asc">
            `;
        let result = data.reduce((res, current) => res +  
            `<div class="sortable-table__cell" data-id=${current.id} data-sortable=${current.sortable} data-order=${current.sortType}>
               <span>${current.title}</span>
            </div>
            `, header );
        return  result + `</div>`;
    }

     getBody(data) {
        const header = `
            <div data-element="body" class="sortable-table__body">
            `;
        let result = data.reduce((res, current) => 
            res + ` 
            <a href="${current.id}" class="sortable-table__row">
                <div class="sortable-table__cell">
                    <img class="sortable-table-image" alt="${current.description}" src="${current.images[0].url}">
                </div>
                <div class="sortable-table__cell">${current.title}</div>

                <div class="sortable-table__cell">${current.quantity}</div>
                <div class="sortable-table__cell">${current.price}</div>
                <div class="sortable-table__cell">${current.sales}</div>
            </a>
            `, header );
        return result + `</div>`;
    }

    get template () {
        return  `
            <div data-element="productsContainer" class="products-list__container">
              <div class="sortable-table">
                 ${this.getHeader(this.headerConfig)}
                 ${this.getBody(this.data)}
                

                <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

                <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                  <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                  </div>
                </div>

              </div>
            </div>
        `
    }

     getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        return [...elements].reduce((accum,subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
        }, {});
    }

    render() {
        this.element = document.createElement('div'); // (*)
        this.element.innerHTML = this.template;
        
        this.element = this.element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
   }

   sortNambers(value, arr, param = 'asc') {
        let direction;
        if(param === 'asc')
            direction = 1;
        else if(param === 'desc')
            direction = -1;
        else
            throw new Error('Error sortNambers!');

        const arrCopy = [...arr];

        arrCopy.sort( (a, b) => {     
            return direction * (a[value] - b[value] );  
        });
    
        return [...arrCopy];
  }

   sortStrings (value, arr,  param = 'asc') {
        let direction;
        if(param === 'asc')
            direction = 1;
        else if(param === 'desc')
            direction = -1;
        else
            throw new Error('Error sortStrings!');

        const arrCopy = [...arr];

        arrCopy.sort( (a, b) => {     
            return direction * a[value].normalize().localeCompare(b[value].normalize(),  ['ru', 'en'], {caseFirst:'upper'}  );  
        });
    
        return [...arrCopy];
    }

   sort(field, order) {
   
        const type = this.headerConfig.find(item => item.id === field).sortType;
        let result ;
        if(type === 'number') {
            result =  this.getBody( this.sortNambers(field, this.data, order));
        } else if (type === 'string'){
            result =  this.getBody(this.sortStrings(field, this.data, order));
        }
        this.subElements.body.innerHTML =  ` <div data-element="body" class="sortable-table__body"> ${result} </div>`; 
   }

   remove () {
       this.element.remove();
   }

   // NOTE: удаляем обработчики событий, если они есть
   destroy() {
     this.remove();
     this.element = null;
     this.subElements = {};
     this.data = null;
     this.headerConfig = null;
   }
}

