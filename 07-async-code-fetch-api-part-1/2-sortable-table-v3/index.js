import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  loading = false;
  isSortLocaly = false;
  step = 20;
  start =1;
  end = this.start + this.step;

  onWindowScroll = async (event) => {
    const { bottom } = this.element.getBoundingClientRect();
    const {id,order} = this.sorted;
    if(bottom < document.documentElement.clientHeight && !this.laoding && !this.isSortLocaly) {
        this.start = this.end;
        this.end = this.start + this.step;
        this.laoding = true;
        const data = await this.loadData(id, order, this.start, this.end);
        this.laoding = false;
    }
 } 

   handler = async (event) => {
        const column = event.target.closest('[data-sortable="true"]');
        //const ord = this.sorted.order;
        const togleOrder = (order) => {
            const orders = {
                asc: 'desc',
                desc: 'asc'
            };
            return orders[order];
        }

        if (column)  {
            const {id, order} = column.dataset;

            if (this.isSortLocaly) {
                this.sortLocaly(id, togleOrder(order));
            } else {
                this.data = await this.sortOnServer(id, togleOrder(order), this.labal, '2020-03-06', '2020-03-06');  
            }
           
             const arrow = column.querySelector('.sortable-table__sort-arrow');
             column.dataset.order = togleOrder(order);
            if (!arrow) {
                column.append(this.subElements.arrow);
            }
            this.renderRows(this.data) ;
        }
   };


  constructor( headersConfig = [], {
        data = [], 
        sorted = {
            id: headersConfig.find(item => item.sortable).id,
            order: 'asc',
        }, 
        isSortLocaly = false,
        step = 10,
        start = 1,
        end = start + step,
        label= 'bestsellers', //'customers',  // 
        url='',
   } = {}) {

        this.headersConfig = headersConfig;
        this.data = data;
        this.label = label;
        this.sorted = sorted;
        this.start = start;
        this.step = step;
        this.end = end;
        this.url = new URL(`${url}/${label}`, BACKEND_URL);
        this.render();
        this.addEventListeners();
  }

 addEventListeners() {
        this.subElements.header.addEventListener('pointerdown', this.handler);//'click'
       // this.subElements.header.removeEventListener('pointerdown', this.handler);
       document.addEventListener('scroll', this.onWindowScroll);
 }

 async loadData(id, order, start = this.start, end = this.end) {
    
    this.url.searchParams.set('from', '2021-04-25');  //, 
    this.url.searchParams.set('to', '2021-05-25');
    this.url.searchParams.set('_sort', this.sorted.id);
    this.url.searchParams.set('_order', this.sorted.order);
    this.url.searchParams.set('_start', this.start);
    this.url.searchParams.set('_end', this.end);

    this.element.classList.add('sortable-table_loading');

    const data = await fetchJson(this.url);
    const arr = Array.from(data);
    for(let item of arr) {
        this.data.push(item);
    }

 //   this.subElements = this.getSubElements(this.element);
    this.renderRows(this.data) ;
    this.element.classList.remove('sortable-table_loading');

    return data;
 }
  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow ({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow (id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>`;
  }

  getTableRows (data=[]) {
    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item)}
      </div>`
    ).join('');
  }

  getTableRow (item) {
    const cells = this.headersConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody()}
      </div>`;
  }

 
  async render() {
    const {id, order} = this.sorted;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();
    const element = wrapper.firstElementChild;
    this.element = element;
    this.subElements = this.getSubElements(element);
    
    
    this.data = await this.update(); 
    this.renderRows(this.data) ;
    this.addEventListeners();
  }

  
  sortLocaly(id, order) {
    const sortData = this.sortData(id, order);
    this.subElements.body.innerHTML = this.getTableBody();
  }
  
  sortData(id, order) {
        
    if (this.data.length === 0) {
        return [];
    }

    const arr = [...this.data];
    const column = this.headersConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const directions = {
      asc: 1,
      desc: - 1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], ['ru', 'en']);
      case 'custom':
        return direction * customSorting(a, b);
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
          const name = subElement.dataset.element;
          result[name] = subElement;
    }

    return result;
  }

   async getData() {

        const response = await fetchJson('https://jsonplaceholder.typicode.com/todos/1');
        console.log(json); 
   }

   showLoading() {
        if (this.data.length) {
            this.element.classList.remove('column-chart_loading');
        } else {
            if (!this.element.classList.contains('column-chart_loading')) {
                this.element.classList.add('column-chart_loading');
            }
        }
   }

   changeValue() {
        this.value = this.data.reduce((sum, current) => sum + current, 0);
        
        const elem = this.element.querySelector('.column-chart__header');
        if (elem ) { 
            elem.innerHTML = `<div data-element="header" class="column-chart__header">${this.value}</div>`;
        }
   }

   async sortOnServer (id, order, label, dateStart, dateEnd ) {

        if (!this.element.classList.contains('column-chart_loading')) {
                this.element.classList.add('column-chart_loading');
        }
   
        const data = await this.update(`${this.BACKEND_URL}/${this.url}/${this.label}`, id, order, dateStart, dateEnd);

         this.element.classList.remove('column-chart_loading');

         this.renderRows(data) ;

        // this.subElements = this.getSubElements(element);

        return this.data;
  }


  async  update(dateStart, dateEnd) {
        
        this.url.searchParams.set('from', '2021-04-25');  //, 
        this.url.searchParams.set('to', '2021-05-25');
        this.url.searchParams.set('_sort', this.sorted.id);
        this.url.searchParams.set('_order', this.sorted.order);
        this.url.searchParams.set('_start', this.start);
        this.url.searchParams.set('_end', this.end);

        console.log(this.url);
        const data = await  fetchJson(this.url);
        console.log(data);
       
        const arr = [...Object.values(data)];
        if (Array.isArray(arr)) {
            this.data = arr;
        } else { 
            throw new Error ("error in data transmission");
        }    
        return arr;
  }

  addRows(data) {
  //      this.data = data;
         this.subElements.body.innerHTML = this.getTableRows(data);
  }

  renderRows(data) {
    if(data.length) {
        this.element.classList.remove('sortable-table_empty');
        this.addRows(data); 
    } else {
        this.element.classList.add('sortable-table_empty');
    }
  }

  remove () {
    if (this.element) {
        this.element.remove();
    }
  }

  // NOTE: удаляем обработчики событий, если они есть
  destroy() {
    this.remove();
    this.element = null;
    document.removeEventListener('scroll', this.onWindowScroll);
    this.subElements = {};
  }
}