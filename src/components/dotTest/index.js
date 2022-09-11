class DotTestController {
    constructor($ocLazyLoad, $injector) {
        console.log('constructor');
    }
}

DotTestController.$inject = ['$ocLazyLoad','$injector']

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