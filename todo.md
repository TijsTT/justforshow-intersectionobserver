# Todo's

## Problem 1: which class is more important
If class, added by jfs animate transition, is trying to overwrite the same css property as onanother class, then this class should have a more strict definition.
Example: Tailwindcss classes are not strictly defined. If bg-black is added to element that wants to use bg-red as animate class, then bg-red should make use of important variant and be declared as !-bg-red. This makes the class property important so it overwrites any existing classes on the element. See: https://tailwindcss.com/docs/plugins/#complex-variants

## Problem 2: AnimateFrom - what about animation of elements above the viewport?
If the location of the window is down the page, then some elements won't be revealed when scrolling up, cuz the observer events didn't trigger by scrolling. Do we just play all animations that already scrolled, or do we ALWAYS make a page go to top on load?

Temporary fix: before unload, set scrollposition to 0. Always.
Current fix: classes are added to elements if scroll position onload is higher. I think this is the way to go, still needs to be tested.

## Problem 3: Creating custom object needs to be easy and failproof.
This needs to be well documented. Errors should be dealt with behind the scene, and should NEVER make the JFS instance break.

## Problem 4: If using lazy loading, what if JS doesn't work?
If JS doesn't work the images won't be loaded, as they don't have a src attribute.
-   Set a src with a low quality image to be changed, so if JS breaks there at least something there instead of a blank space.
-   Get polyfills to work so the intersection observer is 100% supported (this makes jfs more failproof)

## Problem 5: when scrolling REALLY fast, an img without any width or height won't emit an event and won't lazyload
Yh, idk what to do. Maybe give every lazy loaded image a set height and width?
(doc: https://www.sitepoint.com/five-techniques-lazy-load-images-website-performance/)

## Problem 6: lazyload image element load event fires before image actually gets replaced
This event is triggered when the image that was set as src is loaded, but with large images there is a short delay between the load event and the visual image change. This makes designing a transition between the 2 images very difficult ... Do I make a transition and let users deal with the delay with large images or do i figure out why this is happening. Already took a short look into this and couldn't find anything.

## Features
-   Make it possible to add custom scroll objects
-   Figure out how to pass options, and which options
-   Make it possible to make a seperate observer for a certain type of object. 
    Case: I want the lazyload of images to trigger just before they come into view, but i want my reveal animation to trigger when the element is partly entering the view.
    (OR init justforshow a second time and every time you init jfs you can pass the type of sccrollobject you want to use for that instance!!!)