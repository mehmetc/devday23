import PrimoSession from './session';
import PrimoComponents from './components';

window.Primo = {
    session: PrimoSession, 
    components: PrimoComponents,
    version:  (() => {
        let version = "0.0.1";
        return `Library:${version} - ALMA:${window.appConfig['system-configuration'].Alma_Version}`;
    })()

};