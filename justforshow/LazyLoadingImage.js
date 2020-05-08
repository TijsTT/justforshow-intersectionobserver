class LazyLoadingImage extends ScrollObject {
    constructor(entry) {
        super(entry);

        this.moveToCurrentScrollPosition();
    }

    onEnterBottom() {
        this.element.src = this.element.getAttribute(this.selector);
    }
}