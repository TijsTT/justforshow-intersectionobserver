class JustForShow {
    constructor(options) {
        // console.log('Justforshow using the intersection observer API ...', '\n\n');
        
        this.options = this._setOptions(options);

        if(!(this.type = this._setType())) { 
            console.error('There is either no type set or the given type is invalid. What do you expect me to observer without a type?');
            return;
        };
        
        this.scrollPosition = this._getScrollPosition();
        this.scrollObjects = this._createScrollObjects();
        this.observer = this._createIntersectionObserver();

        this._observeElements();
    }

    _setType() {
        if(this.options.type === null) return false;

        let type = null;

        if(typeof this.options.type === 'string') {
            let presetTypes = this._getPresetTypes();
            type = presetTypes.find((presetType) => presetType.name === this.options.type);

        } else if(typeof this.options.type === 'object' && this.options.type.name && this.options.type.create) {
            type = this.options.type;
        } 
        
        return type;
    }

    _createScrollObjects() {
        let scrollObjects = [],
            selector = `data-jfs-${this.type.name.replace(/ /g,'')}`,
            elements = document.querySelectorAll(`[${selector}]`);

        elements.forEach((element) => {
            scrollObjects.push(
                this.type.create({ 
                    selector: selector, 
                    element: element, 
                })
            );
        });
        
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
                // console.log('Scrolling down enter ...');
                scrollObject.onEnterBottom();
            } 
            else if(newScrollPosition < this.scrollPosition && entry.isIntersecting) {
                // console.log('Scrolling up enter ...');
                scrollObject.onEnterTop();
            } 
            else if(newScrollPosition < this.scrollPosition && !entry.isIntersecting) {
                // console.log('Scrolling up leave ...');
                scrollObject.onLeaveBottom();
            } 
            else if(newScrollPosition > this.scrollPosition && !entry.isIntersecting) {
                // console.log('Scrolling down leave ...');
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
            type: (options && options.type) ? options.type : null,
            observer: {
                root: (options && options.observer && options.observer.root) ? options.observer.root : null,
                rootMargin: (options && options.observer && options.observer.rootMargin) ? options.observer.rootMargin : '0px 0px 0px 0px',
                threshold: (options && options.observer && options.observer.threshold) ? options.observer.threshold : [0]
            }
        }
    }

    _getPresetTypes() {
        return [
            {
                name: 'animate-from',
                create: entry => new AnimateFrom(entry)
            },
            {
                name: 'lazyload',
                create: entry => new LazyLoadingImage(entry)
            }
        ];
    }
}

new JustForShow({ 
    type: 'animate-from',
    observer: { rootMargin: "0px 0px -100px 0px"}
});

new JustForShow({ 
    type: 'lazyload',
    observer: { rootMargin: "0px 0px -100px 0px"}
});

new JustForShow({ 
    type: {
        name: 'section-counter',
        create: (entry) => new SectionCounter(entry)
    },
});