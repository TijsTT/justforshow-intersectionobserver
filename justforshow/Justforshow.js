class JustForShow {
    constructor(options) {
        console.log('Justforshow using the intersection observer API ...', '\n\n');
        
        this.options = this._setOptions(options);

        this.scrollPosition = this._getScrollPosition();
        this.scrollObjects = this._createScrollObjects();
        
        this.observer = this._createIntersectionObserver();

        this._init();
    }

    _init() {
        this._observeElements();
    }

    _createScrollObjects() {
        let scrollObjects = [];

        this.options.scrollObjectTypes.forEach((scrollObjectType) => {
            let elements = document.querySelectorAll(`[${scrollObjectType.selector}]`);

            elements.forEach((element) => {
                scrollObjects.push(
                    scrollObjectType.create({ 
                        selector: scrollObjectType.selector, 
                        element: element, 
                    })
                );
            });
        })
        
        return scrollObjects;
    }

    _createIntersectionObserver() {
        return new IntersectionObserver(this._intersectionObserverCallback.bind(this), {
            root: this.options.observer.root,
            rootMargin: this.options.observer.rootMargin,
            threshold: this.options.observer.threshold,
        })
    }

    _observeElements() {
        this.scrollObjects.forEach((object) => {
            /* adding a target like this will trigger the observer callback */
            this.observer.observe(object.element);
        })
    }

    _intersectionObserverCallback(entries) {
        entries.forEach(entry => {
            let newScrollPosition = this._getScrollPosition(),
                scrollObject = this._getObjectByEntry(entry);
    
            if(newScrollPosition > this.scrollPosition && entry.isIntersecting) {
                console.log('Scrolling down enter ...');
                scrollObject.onEnterBottom();
            } 
            else if(newScrollPosition < this.scrollPosition && entry.isIntersecting) {
                console.log('Scrolling up enter ...');
                scrollObject.onEnterTop();
            } 
            else if(newScrollPosition < this.scrollPosition && !entry.isIntersecting) {
                console.log('Scrolling up leave ...');
                scrollObject.onLeaveBottom();
            } 
            else if(newScrollPosition > this.scrollPosition && !entry.isIntersecting) {
                console.log('Scrolling down leave ...');
                scrollObject.onLeaveTop();
            }
    
            this.scrollPosition = newScrollPosition;
        });
    }

    _getObjectByEntry(entry) {
        return this.scrollObjects.find(object => object.element == entry.target);
    }

    _getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    _setOptions(options) {
        return {
            scrollObjectTypes: this._getAllScrollObjectTypes(options),
            observer: {
                root: (options && options.observer && options.observer.root) ? options.observer.root : null,
                rootMargin: (options && options.observer && options.observer.rootMargin) ? options.observer.rootMargin : '0px 0px 0px 0px',
                threshold: (options && options.observer && options.observer.threshold) ? options.observer.threshold : [0]
            }
        }
    }

    _getAllScrollObjectTypes(options) {
        let scrollObjectTypes = this._getPresetScrollObjectTypes();
        let filteredObjectTypes = [];

        if(options.scrollObjectTypes && typeof options.scrollObjectTypes == 'object') {
            filteredObjectTypes = scrollObjectTypes.filter((scrollObjectType) => {
                return scrollObjectType.name == options.scrollObjectTypes;
            });
            scrollObjectTypes = filteredObjectTypes;
        }

        if(options.customScrollObjectTypes && typeof options.customScrollObjectTypes == 'object') {
            options.customScrollObjectTypes.forEach(customScrollObjectType => scrollObjectTypes.push(customScrollObjectType));
        }

        return scrollObjectTypes;
    }

    _getPresetScrollObjectTypes() {
        return [
            {
                name: 'AnimateFrom',
                selector: 'data-jfs-from',
                create: entry => new AnimateFrom(entry)
            },
            {
                name: 'LazyLoadingImage',
                selector: 'data-jfs-lazyload',
                create: entry => new LazyLoadingImage(entry)
            }
        ];
    }
}

new JustForShow({ 
    // scrollObjectTypes: ['AnimateFrom', 'LazyLoadingImage'],
    customScrollObjectTypes: [],
    observer: { rootMargin: "0px 0px -100px 0px"}
});

new JustForShow({
    scrollObjectTypes: [],
    customScrollObjectTypes: [{
        selector: 'data-jfs-section-counter',
        create: (entry) => new SectionCounter(entry)
    }]
})