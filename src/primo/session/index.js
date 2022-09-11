import PrimoComponents from '../components'

export default class Session {
    /**
     * User object
     */
    static get user() {            
        let isLoggedIn = this.#jwt.signedIn == null ? false : true;
        let onCampus = this.#jwt.onCampus == 'false' ? false : true;

        return {            
            email: this.#jwt.email || '',            
            display_name: this.#userSession.getUserNameForDisplay(),
            user_name: this.#jwt.userName,
            isLoggedIn: isLoggedIn,
            isOnCampus: onCampus
        };
    }

    /**
     * View object
     */
    static get view() {
        return {
            code: this.#appCtrl.viewId || window.appConfig['vid'],
            institution: {
                code: this.#userSession.inst,
                name: window.appConfig['primo-view']['attributes-map'].institution
            },
            interfaceLanguage: this.#userSession.getUserLanguage() || window.appConfig['primo-view']['attributes-map'].interfaceLanguage,
            ip: (this.#userSession.ip || this.#jwt.userIp)            
        }
    }

    /**
     * Helper class points to primo-explore element
     */
    static get #app() {
        let element = PrimoComponents.element('primo-explore')
        if (element && element.length == 1) {
            return element[0];
        }
        return element;        
    }

    /**
     * Helper class points to controller of element primo-explore
     */
    static get #appCtrl() {
        let controller = PrimoComponents.controller('primo-explore');
        if (controller && controller.length == 1) {
            return controller[0];
        }
        return controller;        
    }

    /** 
     * Helper points to userSessionManagerService
     */
    static get #userSession() {
        return this.#appCtrl.userSessionManagerService;        
    }

    /**
     * Helper points to decoded JWT token
     */
    static get #jwt() {        
        return this.#userSession.jwtUtilService.getDecodedToken();
    }
}