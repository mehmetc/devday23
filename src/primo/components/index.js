export default class Component {
    /**
     * Get a List of all components
     * 
     * @returns [component]
     */
    static get list() {
        let tags = document.getElementsByTagName('*');
        let components = [];
        for (let tag of tags) {
            let tagName = tag.localName;
            if (/^prm-|primo-|test/.test(tagName)) {
                let component = { name: tagName, obj: angular.element(tag) };
                components.push(component);
            }
        }
        return components;
    }

    /**
     * 
     * @param {string} componentName - name of the component 
     * @returns component element
     */
    static element(componentName) {
        let el = this.list.filter((f) => f.name === componentName).map((m) => angular.element(m.obj[0]))
        if (el && el.length > 0) {
            return el;
            //return el.length == 1 ? el[0] : el;
        }
        return null;
    }

    /**
     * 
     * @param {string} componentName - name of the component
     * @returns scope of component
     */
    static scope(componentName) {
        return this.element(componentName).map(m => m.scope());
    }

    /**
     * 
     * @param {string} componentName - name of the component
     * @returns controller of component
     */
    static controller(componentName) {                
        let controllers = this.list.filter((f) => f.name === componentName).map((m) => angular.element(m.obj).controller(componentName));
        if (controllers.length > 0) {
            return controllers;
            //return controllers.length == 1 ? controllers[0] : controllers;
        }
        return null;        
    }

    /**
     * 
     * @param {string} componentName - name of the component
     * @returns component
     */    
    static get(componentName) {
        return this.list.filter((f) => componentName === f.name).map(m => m.obj[0]);
    }
}