class LazyLoadingImage extends ScrollObject {
    constructor(entry) {
        super(entry);

        console.log('Lazy loading this element: ', this.element);
    }

    onEnterBottom() {
        console.log('onEnterBottom LazyLoadingImage ...');
        this.element.src = this.element.getAttribute(this.selector);
    }
}