
import Components from '../components'

export default class Common {
    /**
     * Helper class points to primo-explore element
     * 
     * @returns object
     */
    static get app() {
        let element = Components.element('primo-explore')
        if (element && element.length == 1) {
            return element[0];
        }
        return element;        
    }


    static get injector() {
        let app = this.app;
    
        if (app) {
          let injector = angular.element(app).injector();
          if (injector) {
            return injector;
          }
        }
    
        return null;
      }

    /**
     * Helper class points to controller of element primo-explore
     * 
     * @returns object
     */
    static get appCtrl() {
        let controller = Components.controller('primo-explore');
        if (controller && controller.length == 1) {
            return controller[0];
        }
        return controller;        
    }

    /** 
     * Helper points to userSessionManagerService
     * 
     * @returns object 
     */
    static get userSession() {
        return this.appCtrl.userSessionManagerService;        
    }

    /**
     * Helper points to decoded JWT token
     * 
     * @returns object
     */
    static get jwt() {        
        return this.userSession.jwtUtilService.getDecodedToken();
    }

    /**
     * Interface to components
     * 
     * @returns Components class
     */
    static get components() {
        return Components;
    }

    /**
     * Is the current page a full view page. 
     * This happens when you load a full view page url directly.
     * 
     * @returns boolean
     */
    static isFullView() {        
        try {
            return this.components.controller('prm-full-view-page') == null ? false : true            
        } catch(e){
            return false;
        }        
    }    

    /**
     * Is the current page a full view page overlayed on top of the result set
     * 
     * @returns boolean     
     */
    static isFullViewOverlay() {
        try {
            return this.components.controller('prm-full-view') && !this.components.controller('prm-full-view-page') ? true :false
        } catch(e){
            return false;
        }
    }

    /**
     * shortcut to facet service
     * 
     * @returns object
     */
    static get facetService() {
        try {
            return Common.components.controller('prm-facet')[0].facetService
        } catch(e){            
            return {results:[]}
        }
    }

    static get restBaseURLs() {
        return this.injector.get('restBaseURLs')
      }

      static get http() {
        let injector = this.injector;
        if (injector) {
          let h = injector.get('$http');
          if (h) {
            return h;
          }
        }
    
        return null;
      }      
}