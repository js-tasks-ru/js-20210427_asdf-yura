
export default class NotificationMessage {
    static owner = null;
    element = null;

    constructor (message = '', {
        
        duration = 0,
        type = 'success',
        } = {})  {
            this.duration = duration;
            this.type = type;
            this.message = message;
    }

    get template () {
        return  `
        <div class="notification success" style="--value:${this.duration*0.001}s">
          <div class="timer"></div>
            <div class="inner-wrapper">
              <div class="notification-header">${this.type}</div>
              <div class="notification-body">
                ${this.message}
              </div>
            </div>
          </div>
          `
    }

    selectType() {
        if (this.type === 'error') {
            this.element.classList.remove('success');
            this.element.classList.add('error');
        } 
   }

    show() {
        if(NotificationMessage.owner != null)
            this.deleteNotification()
        this.element = document.createElement('div'); // (*)
        
        this.element.innerHTML = this.template;
        this.element = this.element.firstElementChild;
        this.selectType();

        document.body.append(this.element);
        NotificationMessage.owner = this;
        setTimeout(() => this.deleteNotification(), this.duration);
    }

    destroy() {
        if(this.element != null)  {
            this.element.remove();
            this.element = null;
        }
    }
    remove () {
        if(this.element != null)  {
            this.element.remove();
            this.element = null;
        }
    }

    deleteNotification () {
        if(NotificationMessage.owner.element != null)  {
            NotificationMessage.owner.element.remove();
            NotificationMessage.owner.element = null;
            NotificationMessage.owner = null;
        }
   }

}

