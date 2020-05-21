class LazyLoadingImage {
    constructor(element) {
        this.element = element;

        this._lazyloadAttribute = 'data-jfs-lazyload';
        this._lazyloadFromAttribute = 'data-jfs-lazyload-from';

        this.src = this.element.getAttribute(this._lazyloadAttribute);
        this.classes = this.element.getAttribute(this._lazyloadFromAttribute) ? this.element.getAttribute(this._lazyloadFromAttribute).split(' ') : [];
        this.intersected = false;

        this._setPlaceholderClasses();
        this.moveToCurrentScrollPosition();
    }

    onEnterBottom() {
        if(this.intersected) return;
        
        this.element.src = this.src;

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