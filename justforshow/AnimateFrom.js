/* 
    Aditional attributes for AnimateFrom:
    -   data-jfs-from-repeat
*/
class AnimateFrom extends ScrollObject {
    constructor(entry) {
        super(entry);

        this.type = 'animateFrom';
        this.repeatSelector = 'data-jfs-from-repeat';
        this.classes = this.element.getAttribute(this.selector).split(' ');
        this.repeat = (typeof this.element.getAttribute(this.repeatSelector) === "string");
        this.intersected = false;
    
        this._init();
    }

    _init() {
        // because we are animating from specified classes, we need to add them now and remove them on intersection
        this._addFromClassesToElement();
        // this is for that one guy that actually tries to print a webpage (just why?)
        this._removeFromClassesBeforePrint();
        // atm part of the ScrollObject api
        this.moveToCurrentScrollPosition(); 
    }

    onEnterBottom() {
        // return if object intersected before, unless repeat is true
        if(this.intersected) return;

        this.element.classList.remove(...this.classes);
        this.intersected = true;
    }

    onLeaveBottom() {
        if(this.repeat) {
            this.element.classList.add(...this.classes);
            this.intersected = false;
        }
    }
     
    _addTransitionResetStyleToHead() {
        let head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style'),
            css = '.transition-none { transition: none !important; }'

        style.type = 'text/css';
        style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
        head.appendChild(style);
    }

    _addFromClassesToElement() {
        this._addTransitionResetStyleToHead();

        this.element.classList.add('transition-none');
        this.element.classList.add(...this.classes);
        // nasty trick to update CSS properties instantly to prevent transition-none properties from still being active
        void this.element.offsetHeight;
        this.element.classList.remove('transition-none');
    }

    _removeFromClassesBeforePrint() {
        window.addEventListener('beforeprint', () => {
            this.element.classList.remove(...this.classes);
        });
    }
}