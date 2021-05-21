class Tooltip {
    
    static activeToolTip = null;
    element = null;

    handlerMove = (event) => {
        this.moveAt(event.pageX, event.pageY);
        if(!event.target.dataset.tooltip) {
            this.remove();
        }
    }

     handlerOut = (event) => {
        this.remove();
        document.body.removeEventListener('mousemove', this.handlerMove);
    }

    handlerOver = (event) => {
        this.render();
        let field = event.target.dataset.tooltip;  
        this.show(event.target.dataset.tooltip);
        document.body.addEventListener('mousemove', this.handlerMove);
        this.element.style.left = event.clientX + 10;
        this.element.style.top = event.clientY - 10;
    }

    constructor() {
       // this.render();
    }
       
     addEventListeners() {
        document.body.addEventListener('pointerover', this.handlerOver);  //pointerout
        document.body.addEventListener('pointerout', this.handlerOut);  
     }

     initialize() {
        this.addEventListeners();
     }
   
     render() {
          const hint = document.createElement('div'); // (*)
          hint.innerHTML = `<div>    </div>`;
          const element = hint;  //hint.firstElementChild;
          this.element = hint;  //element;
          this.element.ondragstart = function() {
              return false;
          };
          this.element.classList.add('tooltip');
          document.body.append(this.element);
    }

    show(text) {
          if(Tooltip.activeToolTip != null) {
                Tooltip.activeToolTip.remove();
          }
          this.element.innerText = text;
          document.body.append(this.element);
          Tooltip.activeToolTip = this.element;
    }

    remove() {
       if(this.element) {
          this.element.remove();
          this.element = null;
       }
    }
    moveAt (pageX, pageY) {
       this.element.style.left = pageX + 10 + 'px';
       this.element.style.top = pageY - 10 + 'px';
   }

   // NOTE: удаляем обработчики событий, если они есть
   destroy() {
      document.body.removeEventListener('pointerover', this.handlerOut);
      document.body.removeEventListener('pointerout', this.handlerOut);
      document.removeEventListener('mousemove', this.handlerMove);
      this.remove();
      this.element = null;
      this.subElements = {};
   }
}

export default Tooltip;
