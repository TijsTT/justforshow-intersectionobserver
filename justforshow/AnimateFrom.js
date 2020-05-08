/* 
    Aditional attributes for AnimateFrom:
    -   data-jfs-from-repeat
*/
class AnimateFrom extends ScrollObject {
    constructor(entry) {
        super(entry);

        this.type = 'animateFrom';
        this.classes = this.element.getAttribute(this.selector) ? this.element.getAttribute(this.selector).split(' ') : [];
        this.repeat = (typeof this.element.getAttribute('data-jfs-from-repeat') === "string");
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

    _addFromClassesToElement() {
        // Adding these classes would trigger the transition, so we first disable that and enable it again after the classes are added
        this.element.style.transition = "none";
        this.element.classList.add(...this.classes);
        // nasty trick to update CSS properties instantly to prevent transition-none properties from still being active
        void this.element.offsetHeight;
        this.element.style.removeProperty('transition');
    }

    _removeFromClassesBeforePrint() {
        window.addEventListener('beforeprint', () => {
            this.element.classList.remove(...this.classes);
        });
    }
}