import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
     element = null;
    subElements = {};
    chartHeight = 50;

    constructor ({
        data = [],
        label = '',
        value = 0,
        link = '',
        formatHeading = (str) => { return str }
        } = {})  {

            this.data = data;
            this.label = label;
            this.value = value;
            this.link = link;
            this.formatHeading = formatHeading;
            this.value = this.formatHeading(this.value);  //fn=()=>{}
            this.render();
    }

    //formatHeading(dat) { return `USD ${dat}`; }

     getColumnBody(data) {
        
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;

        return data.map(item => {
             const percent = (item / maxValue * 100).toFixed(0);
             return ` <div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div> `;
        }).join('');
    }

    getColumnProps(data) {
        
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;
        return data.map(item => {
            return {
              percent: (item / maxValue * 100).toFixed(0) + '%',
              value: String(Math.floor(item * scale))
            };
        });
    }

    get template () {//                ${this.value}
        return  `
        <div class="column-chart column-chart_loading" style="--chart-height: 50">
            <div class="column-chart__title">
            ${this.label} ${this.getLink()}
            </div>
            <div class="column-chart__container">

                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart"> 
                ${this.getColumnBody(this.data)}
                </div>
            </div>
        </div>
        `;
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        return [...elements].reduce((accum,subElement) => {
            accum[subElement.dataset.element] = subElement;
            return accum;
        }, {});
    }

    getLink() {
        return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : '';
    }

    render() {
        this.element = document.createElement('div'); // (*)
        this.element.innerHTML = this.template;
        
        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
        this.element = this.element.firstElementChild;

        this.showLoading();
        this.subElements = this.getSubElements(this.element);

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

   async getData() {

        const response = await fetchJson('https://jsonplaceholder.typicode.com/todos/1');
        console.log(json); 
   }

   changeValue() {
        this.value = this.data.reduce((sum, current) => sum + current, 0);
        const elem = this.element.querySelector('.column-chart__header');
        elem.innerHTML = `<div data-element="header" class="column-chart__header">${this.value}</div>`;
   }

   async  update(start,end) {
        
        this.data = [];
        this.changeValue();
        
        //скелетон
        this.showLoading();

        const json = await  fetchJson('https://course-js.javascript.ru/api/dashboard/customers?from=2021-04-23T17:12:31.973Z&to=2021-05-18T17:12:31.973Z', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            authority: 'course-js.javascript.ru',
            'sec-fech-mode': 'cors',
           // mode: 'no-cors', // no-cors, *cors, same-origin, 'cors'
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //credentials: 'same-origin', // include, *same-origin, omit
            //credentials: 'include',
            headers: {
              //'Content-Type': 'application/json', ///'ContentType': 'text/html; charset=utf-8',   //'application/json' // 'Content-Type': 'application/x-www-form-urlencoded',
              'accept': `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': `ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7`,
              'cache-control': 'no-cache'
            },
            
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'strict-origin-when-cross-origin'  // no-referrer, *client
        });
        //console.log(json);
       
        const arr = [...Object.values(json)];
        if (Array.isArray(arr)) {
            this.data = arr;
        } else { 
            throw new Error ("error in data transmission");
        }    

        this.changeValue();
        this.showLoading();

        this.subElements.body.innerHTML = this.getColumnBody(this.data);
        
            
 }  

  initEventListeners () {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
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
    this.subElements = {};
  }


}
