import blendHTML from './kuleuven.html'
import './kuleuven.css'

class BlendController {
    constructor() {
        let self = this;
    }

    get total() {
        try {
            return parseInt(blendedSearch.set2.data.info.total);
        }
        catch(e) {
            return 0;
        }        
    }

    get show() {
        return blendedSearch.allowed;
    }

    goKULeuven() {
        let self = this;
    
        let kuleuven = new URL(document.location.href);
        kuleuven.host = 'kuleuven.limo.libis.be';
        kuleuven.protocol='https:';
        kuleuven.port='443';
        kuleuven.searchParams.set('tab', 'all_content_tab');
        kuleuven.searchParams.set('search_scope', 'All_Content');
        kuleuven.searchParams.set('vid', '32KUL_KUL:KULeuven');
        kuleuven.searchParams.set('offset', '0');
        kuleuven.searchParams.delete('pcAvailability');

        window.open(kuleuven.href, '_blank');
    }
}

export let blendComponent = {
  name: 'custom-blend',
  config: {
    bindings: { parentCtrl: '<' },
    controller: BlendController,
    template: blendHTML
  },
  enabled: true,
  appendTo: ['prm-search-result-tool-bar-after','prm-no-search-result-after'],
  enableInView: '.*'
}