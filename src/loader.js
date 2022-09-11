/*
    Primo component loader.
    Will load all defined components in the src/components directory. 

  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/

import Components from './components/**/*'

String.prototype.toCamelCase = function () {
    return this.split('-').map((d, i, a) => i > 0 ? d.charAt(0).toUpperCase() + d.slice(1) : d).join('');
}

export default class Loader {
    constructor() {}

    load(modType) {
        this._injectComponentPlaceHoldersIntoAfterComponents(modType);
    }

    /**
     * 
     * 
     **/
    _importComponents() {
        let components = [];
        Object.keys(Components).forEach((component_def) => {
            components.push(Components[component_def]);
        });
        return components.filter((component) => (component.enabled && new RegExp(component.enableInView).test(window.appConfig.vid)));
    }

    /**
     * 
     * 
     **/
    _createComponents(modType) {
        let components = this._importComponents();
        let afterComponents = {};

        //Create all components and determine in which after component these need to be
        //injected
        console.log('Loading components');
        components.forEach((component) => {
            console.log(component.name)

            if (component.enabled) {
                if (component.appendTo) {

                    let elements = afterComponents[component.appendTo] || [];
                    elements.push({
                        'name': component.name,
                        'enableInView': component.enableInView
                    });
                    if (Array.isArray(component.appendTo)) {
                        component.appendTo.forEach(appendTo => {
                            afterComponents[appendTo] = elements;
                        });
                    } else {
                        afterComponents[component.appendTo] = elements;
                    }
                }
                angular.module(modType).constant('afterComponents', afterComponents);
                angular.module(modType).component(component.name.toCamelCase(), component.config);
            }
        });

        return afterComponents;
    }

    /**
     * 
     * 
     **/
    _injectComponentPlaceHoldersIntoAfterComponents(modType) {
        let afterComponents = this._createComponents(modType);
        //Inject place holders into the after components
        Object.keys(afterComponents).forEach((component, i) => {
            let subComponents = afterComponents[component];

            angular.module(modType).component(component.toCamelCase(), {
                bindings: {
                    parentCtrl: '<'
                },
                template: subComponents.map(m => `<${m.name} parent-ctrl="$ctrl"></${m.name}>`).join("")
            });
        });
    }
}