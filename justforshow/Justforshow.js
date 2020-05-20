class JustForShow {
    constructor(options) {
        // console.log('Justforshow using the intersection observer API ...', '\n\n');
        
        this.options = this._setOptions(options);

        this.type = this._setType();
        
        this.scrollPosition = this._getScrollPosition();
        this.scrollObjects = this._createScrollObjects();
        this.observer = this._createIntersectionObserver();

        this._observeElements();
    }

    _setType() {
        let type = this.options.type;

        if(type == null) return type;

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
                this.type.create(element, selector)
            );
        });
        
        return scrollObjects;
    }

    _createIntersectionObserver() {
        return new IntersectionObserver(this._intersectionObserverCallback.bind(this), {
            root: this.options.root,
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold,
        })
    }

    _observeElements() {
        this.scrollObjects.forEach((object) => {
            /* adding a target like this will trigger the observer callback */
            this.observer.observe(object.element);
        })
    }

    _onEnterBottom(entry) {
        if(typeof this.onEnterBottom == 'function') {
            this.onEnterBottom(entry);
        } else {
            let scrollObject = this._getObjectByEntry(entry);
            scrollObject.onEnterBottom();
        }
    }

    _onEnterTop(entry) {
        if(typeof this.onEnterTop == 'function') {
            this.onEnterTop(entry);
        } else {
            let scrollObject = this._getObjectByEntry(entry);
            scrollObject.onEnterTop();
        }
    }

    _onLeaveBottom(entry) {
        if(typeof this.onLeaveBottom == 'function') {
            this.onLeaveBottom(entry);
        } else {
            let scrollObject = this._getObjectByEntry(entry);
            scrollObject.onLeaveBottom();
        }
    }

    _onLeaveTop(entry) {
        if(typeof this.onLeaveTop == 'function') {
            this.onLeaveTop(entry);
        } else {
            let scrollObject = this._getObjectByEntry(entry);
            scrollObject.onLeaveTop();
        }
    }

    _intersectionObserverCallback(entries) {
        entries.forEach(entry => {
            let newScrollPosition = this._getScrollPosition();

            if(newScrollPosition > this.scrollPosition && entry.isIntersecting) {
                // console.log('Scrolling down enter ...');
                this._onEnterBottom(entry);
            } 
            else if(newScrollPosition < this.scrollPosition && entry.isIntersecting) {
                // console.log('Scrolling up enter ...');
                this._onEnterTop(entry);
            } 
            else if(newScrollPosition < this.scrollPosition && !entry.isIntersecting) {
                // console.log('Scrolling up leave ...');
                this._onLeaveBottom(entry);
            } 
            else if(newScrollPosition > this.scrollPosition && !entry.isIntersecting) {
                // console.log('Scrolling down leave ...');
                this._onLeaveTop(entry);
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

            root: (options && options.root) ? options.root : null,
            rootMargin: (options && options.rootMargin) ? options.rootMargin : '0px 0px 0px 0px',
            threshold: (options && options.threshold) ? options.threshold : [0]
        }
    }

    _getPresetTypes() {
        return [
            {
                name: 'animate-from',
                create: (element, selector) => new AnimateFrom(element, selector)
            },
            {
                name: 'lazyload',
                create: (element, selector) => new LazyLoadingImage(element, selector)
            }
        ];
    }
}
