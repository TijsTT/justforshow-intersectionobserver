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

    _onEnterBottom(instance) {
        if(typeof this.onEnterBottom == 'function') this.onEnterBottom(instance.element);

        if(this.preset != null && instance.preset.onEnterBottom && typeof instance.preset.onEnterBottom == 'function') instance.preset.onEnterBottom();
    }

    _onEnterTop(instance) {
        if(typeof this.onEnterTop == 'function') this.onEnterTop(instance.element);

        if(this.preset != null && instance.preset.onEnterTop && typeof instance.preset.onEnterTop == 'function') instance.preset.onEnterTop();
    }

    _onLeaveBottom(instance) {
        if(typeof this.onLeaveBottom == 'function') this.onLeaveBottom(instance.element);
        
        if(this.preset != null && instance.preset.onLeaveBottom && typeof instance.preset.onLeaveBottom == 'function') instance.preset.onLeaveBottom();
    }

    _onLeaveTop(instance) {
        if(typeof this.onLeaveTop == 'function') this.onLeaveTop(instance.element);

        if(this.preset != null && instance.preset.onLeaveTop && typeof instance.preset.onLeaveTop == 'function') instance.preset.onLeaveTop();
    }

    _intersectionObserverCallback(entries) {
        entries.forEach(entry => {
            let newScrollPosition = this._getScrollPosition(),
                instance = this._getInstanceByElement(entry.target);

            /* If this is the first callback for this instance then don't do anything, because this was the initial callback when observing the element started */
            if(!instance.observating) {
                instance.observating = true;
                return;
            }

            if(newScrollPosition >= this.scrollPosition && entry.isIntersecting) {
                this._onEnterBottom(instance);
            } else if(newScrollPosition < this.scrollPosition && entry.isIntersecting) {
                this._onEnterTop(instance);
            } else if(newScrollPosition < this.scrollPosition && !entry.isIntersecting) {
                this._onLeaveBottom(instance);
            } else if(newScrollPosition >= this.scrollPosition && !entry.isIntersecting) {
                this._onLeaveTop(instance);
            }
    
            this.scrollPosition = newScrollPosition;
        });
    }

    _getInstanceByElement(element) {
        return this.instances.find(instance => instance.element == element);
    }

    _getScrollPosition() {
        return window.pageYOffset || document.documentElement.scrollTop;
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
                this._onEnterBottom(instance); 
                // console.log('Element already entered from bottom');
            }
            if(objectScrollPosition.bottom < currentUserScrollPosition.top) { 
                this._onLeaveTop(instance); 
                // console.log('Element already left from top');
            }
        })
    }

    _setOptions(options) {
        return {
            preset: this._setPresetOption(options.preset),
            syncScrollPosition: (options && options.syncScrollPosition != undefined) ? options.syncScrollPosition : true,

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
}