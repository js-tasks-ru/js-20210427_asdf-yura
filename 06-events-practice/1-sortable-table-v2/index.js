export default class SortableTable {

  element = null;
//класс пропорти ( стрелочные функции как обработчики событий) располагать над конструктором
  handler = (event) => {

        let field = event.target.parentElement.dataset.id;
        if(event.target.parentElement.dataset.sortable === 'false') { return; }
        if(event.target.parentElement.dataset.order === '')
            event.target.parentElement.dataset.order = 'asc'
        else if (event.target.parentElement.dataset.order === 'asc') {
            event.target.parentElement.dataset.order = 'desc'
        } else if (event.target.parentElement.dataset.order === 'desc')  {
             event.target.parentElement.dataset.order = 'asc';
        }
        let order = event.target.parentElement.dataset.order;
        this.sort(field, order);
  }

    constructor(headersConfig, {
        data = [], sorted = {}
    } = {}) {

        this.data = data;
        this.headersConfig = Array.from(headersConfig);
        this.sorted = sorted;
        this.isSortLocally = true;
        this.render();

        //this.handler = this.handler.bind(this);
        this.addEventListeners();
       
  }

  addEventListeners() {
        this.element.addEventListener('click', this.handler);
       // this.element.removeEventListener('click', this.handler);
  }

  getTabHeader() {
        return ` <div data-element="header" class="sortable-table__header sortable-table__row"> 
        ${this.headersConfig.map(item => this.getHeaderRow(item.id, item.title, item.sortable)).join('') }
        </div>`;
  }

  getHeaderRow(id, title, sortable) {
        return `
            <div class="sortable-table__cell" data-id="${id}"  data-sortable="${sortable}">
            <span>${title}</span>
            <span data-element="arrow" class="sortable-table__sort-arrow">
              <span class="sort-arrow"></span>
            </span>
          </div>
          `;
  }

  getTableBody () {
        return `
        <div data-element="body" class="sortable-table__body">
            ${this.getTableRows(this.data)}
        </div>
        `;
  }

  getTableRows(data) {
        return data.map(item => {
            return `
                <a href="/products/${item.id}" class="sortable-table__row">
                    ${this.getTableRow(item)}
                </a> `;
        }).join('');
  }

  getTableRow(item) {
        const cells = this.headersConfig.map(({id, template} ) => {
            return { 
                id,
                template
            };
        });
        return cells.map( ( { id, template}) => {
            return template
                ? template (item[id])
                : ` <div class="sortable-table__cell">${item[id]}</div> `;
        } ).join('');
  }

  getTable() {
        return `
        <div class="sortable-table">
            ${this.getTabHeader()}
            ${this.getTableBody()}
        </div>
          `;
  }

  render() {
        const wrapper = document.createElement('div'); // (*)
        wrapper.innerHTML = this.getTable();

        const element = wrapper.firstElementChild;
        this.element = element;
        
        this.subElements = this.getSubElements(element);

        this.sort(this.sorted.id, this.sorted.order);
  }

  sort(field, order) {

        if (this.isSortLocally) {
        this.sortOnClient(field, order);
        } else {
        this.sortOnServer(field, order);
        }
 }

 sortOnClient(field, order) {
        const sortedData = this.sortData(field, order);
        const allColumns = this.element.querySelectorAll(`.sortable-table__cell[data-id]`);
        const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`)
       
        allColumns.forEach(column => {
            column.dataset.order = '';
        });

        currentColumn.dataset.order = order;
        this.subElements.body.innerHTML =  this.getTableRows(sortedData);
 }
 sortData(field, order) {
        const arr = [...this.data];
        const column = this.headersConfig.find(item => item.id === field);
        const { sortType } = column;
        const directions = {
            asc: 1,
            desc: -1
        };
        const direction = directions[order];
        return arr.sort( (a,b) => {
            switch(sortType) {
                case 'namber':
                    return direction * (a[field] - b[field]);
                case 'string':
                    return direction * (a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst:'upper'}) ); 
                default:
                    return direction * (a[field] - b[field]);
            }
        });
 }

// getSubElements(element) {
//        const elements = element.querySelectorAll('[data-element]');
//        return [...elements].reduce((accum,subElement) => {
//            accum[subElement.dataset.element] = subElement;
//            return accum;
//        }, {});
//    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');

        for(const subElement of elements) {
            const name = subElement.dataset.element;
            result[name] = subElement;
        }
        return result;
    }


//    getListeners(element) {
//        const elements = element.querySelectorAll('[data-id]');
//        for(const subElement of elements) {
//            const name = subElement.dataset.id;   //item.sortable   //data-sortable
//            subElement.addEventListener('click', this.sort(name, this.sorted.order));
////            if(subElement.dataset.sortable === 'true') { subElement.addEventListener('click', this.sort(name, this.sorted.order));
////                subElement.addEventListener('click', //this.sort(name, this.sorted.order));
////                function(event) { // (1)
////                    this.sort(name, this.sorted.order);
////                })
////             }
//       }
//    }


//    elem.dispatchEvent(new CustomEvent("hello", {
//    detail: { name: "Вася" }


//    onClick(event) {
//      let field = event.target.dataset.id;
//     // if(!field.)
//        field =  event.target.closest('div');  //('div');
//     if (!field) return; 
//     field = event.target.dataset.id;
//     sort(field, 'asc');

//     
//    };

    remove () {
        if(this.element) {
            this.element.remove();
        }
   }

   // NOTE: удаляем обработчики событий, если они есть
   destroy() {
     this.remove();
     this.element.removeEventListener('click', this.handler);
     this.element = null;
     this.subElements = {};
   }
}

