class LazyLoadingImage extends ScrollObject {
    constructor(entry) {
        super(entry);

        this.classes = this.element.getAttribute('data-jfs-lazyload-from') ? this.element.getAttribute('data-jfs-lazyload-from').split(' ') : [];

        this._setPlaceholderClasses();
        this.moveToCurrentScrollPosition();
    }

    onEnterBottom() {
        this.element.src = this.element.getAttribute(this.selector);

        this.element.addEventListener('load', () => {
            this.classes.forEach((_class) => {
                this.element.classList.remove(_class);
            })
        })
    }

    _setPlaceholderClasses() {
        console.log(this.classes);
        this.classes.forEach((_class) => {
            this.element.classList.add(_class);
        })
    }
}