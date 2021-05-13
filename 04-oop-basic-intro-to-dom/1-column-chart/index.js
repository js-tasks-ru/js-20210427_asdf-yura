export default class ColumnChart {

    constructor(obj) {
        this.element;
        this.chartHeight = 50;
        if (obj) {
            this.data = obj.data;
            this.label = obj.label;
            this.value = obj.value;
            this.link = obj.link;
            if (obj.formatHeading) {
                this.value = this.formatHeading(this.value);
             }
        }
        this.render();
        this.initEventListeners();
    }

    formatHeading(dat) { return `USD ${dat}`; }

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

    render() {
        this.element = document.createElement('div'); // (*)

        let stringSource;
        if (!this.data || this.data.length === 0) {
            stringSource += ` 
            <div class="column-chart column-chart_loading" style="--chart-height: 50">
            `;
        } else { 
            stringSource += `
            <div class="column-chart" style="--chart-height: 50"> 
            ` 
        };
        stringSource += `
        <div class="column-chart__title">
        ${this.label}
        `;
        if (this.link) {
            stringSource += `
            <a href="${this.link}" class="column-chart__link">View all</a>
            </div> `;
        } else { stringSource += `</div>`; }
          

        stringSource += `
        <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.value}</div>
        <div data-element="body" class="column-chart__chart"> 
        `;

        if (this.data && Array.isArray(this.data)) {
            const proportion = Array.from(this.getColumnProps(this.data))   
            if (this.data && this.data.length > 0 ) {
                for (let i = 0; i < this.data.length; i++) {
                    stringSource +=`<div style="--value: ${proportion[i].value}" data-tooltip="${proportion[i].percent}"></div> `;
                }
            }
        }
            
        stringSource +=  `
                </div>
            </div>
        </div> `; 

        this.element.innerHTML = stringSource;
        // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
        // который мы создали на строке (*)
       this.element = this.element.firstElementChild;
        
   }


  initEventListeners () {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
  }


  remove () {
    this.element.remove();
  }


  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }

  update(data) {
         this.data = data;
         try {
             const div = document.querySelector(`.dashboard__chart_${this.label}`);
             div.firstElementChild.remove(); 
             this.render();
             div.append(this.element);
         } catch {}
  }
}



