import Common from '../common'

export default class Session {
    /**
     * User object
     */
    static get user() {            
        let isLoggedIn = Common.jwt.signedIn == null ? false : true;
        let onCampus = Common.jwt.onCampus == 'false' ? false : true;

        let userFines = this.#userFines()
        return {            
            email: Common.jwt.email || '',            
            display_name: Common.userSession.getUserNameForDisplay(),
            user_name: Common.jwt.userName,
            isLoggedIn: isLoggedIn,
            isOnCampus: onCampus,
            fines: userFines
        };
    }

    /**
     * View object
     */
    static get view() {
        return {
            code: Common.appCtrl.viewId || window.appConfig['vid'],
            institution: {
                code: Common.userSession.inst,
                name: window.appConfig['primo-view']['attributes-map'].institution
            },
            interfaceLanguage: Common.userSession.getUserLanguage() || window.appConfig['primo-view']['attributes-map'].interfaceLanguage,
            ip: (Common.userSession.ip || Common.jwt.userIp)            
        }
    }

    static async #userFines() {
        let userFines = await Common.http.get(`${Common.restBaseURLs.myAccountBaseURL}/fines`);
    
        try {
          let data = userFines.data;
          if (data.status == 'ok') {
            let fines = data.data.fines;
            return fines.fine;
          } else {
            console.log('No fines');
            return [];
          }
        }
        catch (error) {
          return [];
        }
      }

}