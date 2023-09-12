import Common from '../common'

export default class Library {
    /**
     * Get access to all libraries controllers of a record in view
     * 
     * @returns object
     */
    static get all() {
        try {
            return Common.components.controller('prm-library')
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    /**
     * Get access to all libraries elements of a record in view
     * 
     * @returns object
     */

    static get allAsElement() {
        try {
            return Common.components.element('prm-library')
        } catch (e) {
            console.error(e)
            return null;
        }
    }

    static elementVisible() {
        if (Common.components.get('prm-library').length > 0) {
            return !(window.getComputedStyle(Common.components.get('prm-library')[0]).visibility == 'hidden')
        }
        return false;
    }
}