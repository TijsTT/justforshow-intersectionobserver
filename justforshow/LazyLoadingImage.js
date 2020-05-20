class LazyLoadingImage extends ScrollObject {
    constructor(element, selector) {
        super(element, selector);

        this.classes = this.element.getAttribute('data-jfs-lazyload-from') ? this.element.getAttribute('data-jfs-lazyload-from').split(' ') : [];
        this.intersected = false;

        this._setPlaceholderClasses();
        this.moveToCurrentScrollPosition();
    }

    onEnterBottom() {
        if(this.intersected) return;
        
        this.element.src = this.element.getAttribute(this.selector);

        this.element.addEventListener('load', () => {
            // console.log('Removing classes ...');
            this.intersected = true;
            this.classes.forEach((_class) => {
                this.element.classList.remove(_class);
            })
        })
    }

    _setPlaceholderClasses() {
        // console.log('Adding classes ...');
        this.classes.forEach((_class) => {
            this.element.classList.add(_class);
        })
    }
}