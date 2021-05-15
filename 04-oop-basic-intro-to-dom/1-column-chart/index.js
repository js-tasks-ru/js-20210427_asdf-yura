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

   update(data = []) {
        if (Array.isArray(data)) {
            this.data = data;
            //this.element.innerHTML = this.template;
            // this.element = this.element.firstElementChild;
            this.showLoading();
            //this.subElements = this.getSubElements(this.element);
            this.subElements.body.innerHTML = this.getColumnBody(data);
        }
   }

       

  initEventListeners () {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }


  remove () {
    this.element.remove();
  }

  // NOTE: удаляем обработчики событий, если они есть
  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  
}



