class JustForShow {
    constructor(selector, options) {
        // console.log('Justforshow using the intersection observer API ...', '\n\n');
        
        this.selector = selector;

        if(!this.selector || typeof this.selector != 'string') {
            console.error('If you don\'t give me an element to observe, what am I even here for? Why are we here anyway?');
            return;
        }

        this.options = this._setOptions(options);

        this.preset = this.options.preset;
        this.syncScrollPosition = this.options.syncScrollPosition;

        this.root = this.options.root;
        this.rootMargin = this.options.rootMargin;
        this.threshold = this.options.threshold;

        this.onEnterBottom = this.options.onEnterBottom;
        this.onEnterTop = this.options.onEnterTop;
        this.onLeaveBottom = this.options.onLeaveBottom;
        this.onLeaveTop = this.options.onLeaveTop;

        this.elements = [...document.querySelectorAll(selector)];

        this.instances = this._createInstances();

        this.scrollPosition = this._getScrollPosition();
        this.observer = this._createIntersectionObserver();

        this._init();
    }

    _init() {
        this._observeElements();

        if(this.syncScrollPosition) this._syncToCurrentScrollPosition();
    }

    _createInstances() {
        let instances = [];

        this.elements.forEach((element) => {
            instances.push({
                element: element,
                preset: this._createPreset(element),
                observating: false,
            })
        })

        return instances;
    }

    _createPreset(element) {
        // if there was no preset given, then we shouldn't try to create this instance
        if(!this.preset) return null;

        return this.preset(element);
    }

    _createIntersectionObserver() {
        return new IntersectionObserver(this._intersectionObserverCallback.bind(this), {
            root: this.options.root,
            rootMargin: this.options.rootMargin,
            threshold: this.options.threshold,
        })
    }

    _observeElements() {
        this.instances.forEach((instance) => {
            /* adding a target like this will trigger the observer callback */
            this.observer.observe(instance.element);
        })
    }

    _onEnterBottom(element) {
        if(typeof this.onEnterBottom == 'function') {
            this.onEnterBottom(element);
        } else if(this.preset != null) {
            let instancePreset = this._getInstancePresetByElement(element);
            (instancePreset.onEnterBottom && typeof instancePreset.onEnterBottom == 'function') ? instancePreset.onEnterBottom() : false;
        }
    }

    _onEnterTop(element) {
        if(typeof this.onEnterTop == 'function') {
            this.onEnterTop(element);
        } else if(this.preset) {
            let instancePreset = this._getInstancePresetByElement(element);
            (instancePreset.onEnterTop && typeof instancePreset.onEnterTop == 'function') ? instancePreset.onEnterTop() : false;
        }
    }

    _onLeaveBottom(element) {
        if(typeof this.onLeaveBottom == 'function') {
            this.onLeaveBottom(element);
        } else if(this.preset) {
            let instancePreset = this._getInstancePresetByElement(element);
            (instancePreset.onLeaveBottom && typeof instancePreset.onLeaveBottom == 'function') ? instancePreset.onLeaveBottom() : false;
        }
    }

    _onLeaveTop(element) {
        if(typeof this.onLeaveTop == 'function') {
            this.onLeaveTop(element);
        } else if(this.preset) {
            let instancePreset = this._getInstancePresetByElement(element);
            (instancePreset.onLeaveTop && typeof instancePreset.onLeaveTop == 'function') ? instancePreset.onLeaveTop() : false;
        }
    }

    _intersectionObserverCallback(entries) {
        entries.forEach(entry => {
            let newScrollPosition = this._getScrollPosition();

            if(newScrollPosition >= this.scrollPosition && entry.isIntersecting) {
                this._onEnterBottom(entry.target);
            } else if(newScrollPosition < this.scrollPosition && entry.isIntersecting) {
                this._onEnterTop(entry.target);
            } else if(newScrollPosition < this.scrollPosition && !entry.isIntersecting) {
                this._onLeaveBottom(entry.target);
            } else if(newScrollPosition >= this.scrollPosition && !entry.isIntersecting) {
                this._onLeaveTop(entry.target);
            }
    
            this.scrollPosition = newScrollPosition;
        });
    }

    _getInstancePresetByElement(element) {
        let instance = this.instances.find(instance => instance.element == element);
        return instance.preset;
    }

    _getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
    }

    _setOptions(options) {
        return {
            preset: this._setPresetOption(options.preset),
            syncScrollPosition: (options && options.syncScrollPosition) ? options.syncScrollPosition : true,

            root: (options && options.root) ? options.root : null,
            rootMargin: (options && options.rootMargin) ? options.rootMargin : '0px 0px 0px 0px',
            threshold: (options && options.threshold) ? options.threshold : [0],

            onEnterBottom: (options && options.onEnterBottom) ? options.onEnterBottom : null,
            onEnterTop: (options && options.onEnterTop) ? options.onEnterTop : null,
            onLeaveBottom: (options && options.onLeaveBottom) ? options.onLeaveBottom : null,
            onLeaveTop: (options && options.onLeaveTop) ? options.onLeaveTop : null,
        }
    }

    _setPresetOption(preset) {
        if(typeof preset == 'string') {
            let presetType = this._getPresetTypes().find((presetType) => presetType.name === preset);
            return presetType.create;
        } else if(typeof preset == 'function') {
            return preset;
        } else {
            return null;
        }
    }

    _getPresetTypes() {
        return [
            { name: 'animate-from', create: (element) => new AnimateFrom(element) },
            { name: 'lazyload', create: (element) => new LazyLoadingImage(element) }
        ];
    }

    // this method can be called in childs of the ScrollObject classes
    // makes sure that elements above the current scroll positions are in sync with the jfs scroll event 
    // needs to be checked on browser compatibility
    _syncToCurrentScrollPosition() {
        let currentUserScrollPosition = {
            top: window.pageYOffset,
            bottom: window.pageYOffset + window.innerHeight
        }
        this.instances.forEach((instance) => {
            let objectScrollPosition = {
                top: instance.element.getBoundingClientRect().top + currentUserScrollPosition.top,
                bottom: instance.element.getBoundingClientRect().bottom + currentUserScrollPosition.top
            }
            // console.log('object: ', objectScrollPosition, 'screen: ', currentUserScrollPosition);
            if(objectScrollPosition.top < currentUserScrollPosition.bottom) { 
                this._onEnterBottom(instance.element); 
                // console.log('Element already entered from bottom');
            }
            if(objectScrollPosition.bottom < currentUserScrollPosition.top) { 
                this._onLeaveTop(instance.element); 
                // console.log('Element already left from top');
            }
        })
    }
}


/* API examples */

new JustForShow('[data-jfs]', {
    /* default settings */
    preset: 'animate-from',
    syncScrollPosition: true,
    root: null,
    rootMargin: '0px 0px 0px 0px',
    threshold: [0]
})

// new JustForShow('[data-section-counter]', {
//     preset: (element) => new SectionCounter(element),
// });

new JustForShow('[data-logger]', {
    onEnterBottom: function(element) {
        console.log('Scrolling down enter ...');
    },
    onEnterTop: function(element) {
        console.log('Scrolling up enter ...');
    },
    onLeaveTop: function(element) {
        console.log('Scrolling up leave ...');
    },
    onLeaveBottom: function(element) {
        console.log('Scrolling down leave ...');
    }
})
