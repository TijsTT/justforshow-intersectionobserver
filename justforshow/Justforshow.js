class JustForShow {
    constructor(options) {
        console.log('Justforshow using the intersection observer API ...', '\n\n');
        
        this.options = this._setOptions(options);
        this.scrollObjectTypes = [
            {
                selector: 'data-jfs-from',
                create: entry => new AnimateFrom(entry)
            },
            {
                selector: 'data-jfs-lazyload',
                create: entry => new LazyLoadingImage(entry)
            }
        ];

        this.scrollPosition = this._getScrollPosition();
        this.scrollObjects = this._createScrollObjects();
        
        this.observer = this._createIntersectionObserver();

        this._init();
    }

    _init() {
        // this._setScrollPositionToTop();
        this._observeElements();
    }

    _createScrollObjects() {
        let scrollObjects = [];

        this.scrollObjectTypes.forEach((scrollObjectType) => {
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
            observer: {
                root: (options && options.observer && options.observer.root) ? options.observer.root : null,
                rootMargin: (options && options.observer && options.observer.rootMargin) ? options.observer.rootMargin : '0px 0px 0px 0px',
                threshold: (options && options.observer && options.observer.threshold) ? options.observer.threshold : [0]
            }
        }
    }

    _setScrollPositionToTop() {
        // temporary fix for problem where elements are not revealed when scrolling up, because the page was loaded on a scrollposition down the page
        // basicly, the scroll position is set to 0 before EVERY unload
        window.addEventListener('beforeunload', () => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
            document.body.scrollTop = 0; // For Safari
        })
    }
}

new JustForShow({ observer: { rootMargin: "0px 0px -100px 0px"}});