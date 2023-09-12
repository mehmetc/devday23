import Common from '../common'

class LocationItem {
    /**
     * Get access to all items controllers of a record in view
     * 
     * @returns object
     */
    static get all() {
        try {
            return Common.components.controller('prm-location-items')
        } catch (e) {
            console.error(e)
            return null;
        }        
    }

    /**
     * returns item object elements instead of controller
     * usefull when HTML needs to be changed
     * 
     * @returns object
     */
    static get allAsElement() {
        try {
            return Common.components.element('prm-location-items')
        } catch (e) {
            console.error(e)
            return null;
        }
    }
    
    /**
     * returns item object 
     * 
     * @returns object
     */
    static get current() {
        try {
            if (this.elementVisible()) {
                return Common.components.controller('prm-location-items')[0];
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    static elementVisible() {
        if (Common.components.get('prm-location-items').length > 0) {
            return !(window.getComputedStyle(Common.components.get('prm-location-items')[0]).visibility == 'hidden')
        }
        return false;
    }
}


export default class Location {
    /**
     * Get access to all location controllers of a record in view
     * 
     * @returns object
     */
    static get all() {
        try {
            return Common.components.controller('prm-location')
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    /**
     * returns location object on items page
     * 
     * @returns object
     */
    static get current() {
        try {
            if (this.elementVisible()) {
                return Common.components.controller('prm-location')[0];
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    /**
     * returns location object elements instead of controller
     * usefull when HTML needs to be changed
     * 
     * @returns object
     */
    static get allAsElement() {
        try {
            return Common.components.element('prm-location')
        } catch (e) {
            console.error(e)
            return null;
        }
    }


    static get item() { return LocationItem }

    static elementVisible() {
        if (Common.components.get('prm-location').length > 0) {
            return !(window.getComputedStyle(Common.components.get('prm-location')[0]).visibility == 'hidden')
        }

        return false;
    }
}