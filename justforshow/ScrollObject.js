class ScrollObject {
    constructor(entry) {
        this.element = entry.element;
        this.selector = entry.selector;
    }
    onEnterBottom() { /* ... */ }
    onEnterTop() { /* ... */ }
    onLeaveBottom() { /* ... */ } 
    onLeaveTop() { /* ... */ }

    // this method can be called in childs of the ScrollObject classes
    // makes sure that elements above the current scroll positions are in sync with the jfs scroll event 
    // needs to be checked on browser compatibility
    moveToCurrentScrollPosition() {
        let currentUserScrollPosition = {
            top: window.pageYOffset,
            bottom: window.pageYOffset + window.innerHeight
        }
        let objectScrollPosition = {
            top: this.element.getBoundingClientRect().top + currentUserScrollPosition.top,
            bottom: this.element.getBoundingClientRect().bottom + currentUserScrollPosition.top
        }
        // console.log('object: ', objectScrollPosition, 'screen: ', currentUserScrollPosition);
        if(objectScrollPosition.top < currentUserScrollPosition.bottom) { 
            this.onEnterBottom(); 
            console.log('Element already entered from bottom');
        }
        if(objectScrollPosition.bottom < currentUserScrollPosition.top) { 
            this.onLeaveTop(); 
            console.log('Element already left from top');
        }
    }
}