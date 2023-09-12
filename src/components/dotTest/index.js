class DotTestController {
    constructor() {
        console.log('constructor');
        addEventListener('pnxBaseURLEvent', (event) => { document.querySelector('dot-test').classList.toggle('busy')})
    }
}

export let dotTestComponent = {
    name: 'dot-test',
    config: {
        bindings: {parentCtrl: '<'},
        controller: DotTestController,
        template: "<div class='idle'>.</div>"
    },
    enabled: true,
    appendTo: 'prm-top-bar-before',
    enableInView: '.*'
}