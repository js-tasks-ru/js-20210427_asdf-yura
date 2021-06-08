//import fetchJson from "../../../utils/fetch-json.js";
import SortableList from "./sortable-list/index.js";
import fetchJson from "./fetch-json.js";
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class Categories {
  element;
  subElements = {};
  data = [];
  
  
  constructor( {
    url = '',  //api/rest/categories?_sort=weight&_refs=subcategory
    refs = '',
    sort = '',
    isSortLocally = false
      } = {}) {

    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.sort = 'weight';
    this.refs = 'subcategory';

    this.render();

  }

  async render() {

        this.data = await this.loadData(this.sort, this.refs);

        const wrapper = document.createElement('div');

        wrapper.innerHTML = this.getTemplate();

        

        const element = wrapper.firstElementChild;

        this.element = element;
        
    //    this.initComponents(this.data);

        this.subElements = this.getSubElements(element);

        let elem = document.getElementById('root');
        if(elem) {
            elem.append(this.element);
        }
  }

  getTemplate() {
     return ` <div clas="categoryContainer"
              <div class="category category_open">
                   <div class="content__top-panel">
                     <h2 class="page_title">Категории товаров</h2>
                      ${this.getTable(this.data)}
                     </div>
                   </div>
                </div>`;
  }


  async loadData(sort, refs) {
    this.url.searchParams.set('_sort', sort);
    this.url.searchParams.set('_refs', refs);

    const data = await fetchJson(this.url); // n кол-во времени
    return data;
  }

  
   getTable(data) {
       let result = ``;
       for (let item of Object.values(data)) {
          result += `
            <div class="category category_open" data-id="${item.id}">
              <header class="category__header">${item.title}</header>
               ${this.getSubcategories(item.subcategories)}
            <div>`;
       }
       return result;
   }


  getSubcategories(data) {
    let result =  `
        <div class="category__body">
        <div class="subcategory-list" >
        <ul class="sortable-list">`;
        for(let value of Object.values(data)) {
            result += `
             ${this.getCategory(value)} `;
        }
        return result + `</ul> 
               </div>
        </div> `;
  }

   getCategory(data) {
        return `
             <li class="categories__sortable-list-item" data-id="${data.id}">
                 <strong>${data.title}</strong> <b>${data.count}</b>
             </li>
             `;
  }

  ///**************************************************************************

//  getSubcategories(data) {
//    let result =  `
//        <div class="category__body">
//        <div class="subcategory-list" >
//        <ul class="sortable-list" data-id="${data.id}">
//                    </ul> 
//               </div>
//        </div> `;
//  }
//    

//      initComponents(data) {
//         for(let value of Object.values(data)) {
//             const subcat = value.subcategories;
//            const sortableList = new SortableList({
//                subcat     ///['subcategory']
//            });
//            const elem = this.element.querySelector(`data-id="${subcat.id}"`);
//            elem.append(sortableList.element);
//         }
//    }





  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);

    document.addEventListener('scroll', this.onWindowScroll);
  }

  sortLocally(id, order) {
    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getTableBody(sortedData);
  }

  async sortOnServer(id, order, start, end) {
    const data = await this.loadData(id, order, start, end);

    this.renderRows(data);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    
  }
}