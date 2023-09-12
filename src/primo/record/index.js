import Common from '../common'
import Location from '../location';
import Library from '../library';
import Session from '../session';

/**
 * Helper class to access record currently in full view
 */
class CurrentRecord {
    static get record() {
        try {
            if (Common.isFullViewOverlay()) {
                return Common.components.controller('prm-full-view')[0].item;
            } else if (Common.isFullView()){
                return Common.components.controller('prm-full-view-page')[0].currentItem;
            } else {
                return Common.userSession.searchStateService.resultObject.data[0];
            }
            return null;
        } catch (e) {
            console.error(e)
            return null;
        }        

    }
    static get location() { return Location}
    static get library() {return Library}
    static get source() {
        let that = this;
        let load = async (recordId) => {
            let text = await (await fetch(`${Common.restBaseURLs.sourceRecord}?docId=${recordId}&vid=${Session.view.code}`)).text();
            return text;
        };

        return ( async () => {return await load(that.record.pnx.control.recordid[0])})();       
    }
    static get showSource() {
        let that = this;
        return ( async () => {            
            let d = document.createElement('dialog');
            d.style.height='100vh';
            d.style.width='100vw';
            d.id = 'sourceRecord';
                                
            d.innerHTML = `
            <textarea style='width:100%;height:90%'>${await that.source}</textarea>
            <form method="dialog">
              <button formmethod="dialog" onclick='javascript:Array.from(document.querySelectorAll("#sourceRecord")).map(m => m.remove())'>close</button>
            </form>`;  
            document.body.appendChild(d);
            d.showModal();
        })();            
    }
}

export default class Record {
    /**
     * Get all records
     * 
     * @returns records
     */
    static get all() {
        try {
            if (Common.isFullView()) {
                [Common.components.controller('prm-full-view-page')[0].fullViewPageService.currentItem];
            } else {
                return Common.userSession.searchStateService.resultObject.data;
            }
        } catch (e) {
            console.error(e)
            return [];
        }
    }

    /**
     * Get current record, location and library
     */
    static get current() {
        return CurrentRecord;
    }
}
