# PrimoVE development

[Yarn](https://yarnpkg.com/) is prefered as package manager. But any will do.

## Directory structure
```bash
.
├── README.md                       This file
├── dist                            Your build folder
│   └── 11INST-VIEW
│       └── js
│           ├── custom.js
│           └── custom.js.map
├── make_package.js                 Packaging code
├── package                         Alma ready. Packaged build
├── package.json                    Environment configuration
├── resources                       Resources
│   ├── 11INST-VIEW                 Institution and ViewID specific files
│   │   ├── img
│   │   ├── html
│   │   └── js
│   └── general                     These files will be added to all Institution and Views
│       ├── img
│       ├── html
│       └── js
├── src                             Source code
│   ├── components                  Component definitions
│   │   └── dotTest
│   │       └── index.js
│   ├── modules                     Module definitions
│   │   ├── interceptors
│   │   └── pubSubInterceptor.js
│   ├── sass                        Style sheets
│   │   ├── base
│   │   ├── layout
│   │   └── style.scss            
│   ├── index.js                    Entry point to custom.js
│   └── loader.js                   Components loader
├── webpack.config.js               Webpack configuration
└── yarn.lock                       yarn.lock file
```

## Resources
### general
All static **non** view specific html, img and js files  
CSS files are not stored here since SASS is used to generate them.  
If you need to reference an html file from another html file the base path = '/discovery'.  
for example: ```./custom/11INST-VIEW/hello.html``` or ```/discovery/custom/11INST-VIEW /world.html```

### [INSTITUTION-VIEWID] like 11INST-VIEW 
All static view specific css, html, img and js files

## package.json
Is used to configure and setup the environment
```json
  "primo": {
    "url": "https://test.primo.exlibrisgroup.com",       #base url of primo
    "institution": "11INST",                             #institution id
    "vidId": "VIEW",                                     #view id to use with `yarn start`
    "build": {                                           #list of views to build
      "views": [
        "VIEW"
      ],
      "dist": "./dist",                                  #build folder
      "resources": "./resources",                        #resource folder
      "package": "./package",                            #packages folder
      "tmp": "./tmpPackage"                              #temp package folder
    }
  }
```


## Usage
Start a preview in the browser
```bash
yarn start
```

Build a custom.js file. Will be written to __./dist/[INSTITUTION:VID]__ folder
```bash
yarn build
```
Watch for changes in the ./src folder and rebuild the __custom.js__ file that will trigger a browser reload.
```bash
yarn watch
```
Package the ./dist folder into something that can be uploaded to Alma
```bash
yarn package
```

## Best way to develop.
Run ```yarn``` inside the project directory to install all dependencies and possible updates

When using Visual Studio Code open a terminal and run
```bash
yarn watch
```
Open another terminal and run
```bash
yarn start
```
Everytime you update a component it will trigger a rebuild every rebuild will trigger a reload in the browser.

## Creating a new component.

### Component skeleton
Creates a green dot on screen

```javascript
class DotTestController {
    constructor() {
        console.log('test component');
    }
}

export let dotTestComponent = {
    name: 'dot-test',
    config: {
        bindings: {parentCtrl: '<'},
        controller: DotTestController,
        template: "<div style='position:fixed;right: 0;top: 0;color:#009991;opacity:0.5;z-index: 100000;font-size: 10em;'>.</div>"
    },
    enabled: true,
    appendTo: 'prm-top-bar-before',
    enableInView: '.*'
}
```

- name: name of the component. 
- config: see [AngularJS](https://docs.angularjs.org/guide/component)
- enabled: if component enabled in configuration
- appendTo: a __before__ or __after__ hook to attach your component. If value is NULL then the component can be used anywhere like for example the home page.
Get a list of hooks. This varies depending on context. 
```javascript
Array.from(document.getElementsByTagName('*')).filter(f => /before|after/.test(f.localName))
```
- enabledInView: a RegEx to restrict a component to a view


## Interceptors
An interceptor can modify the request and response of an API call.  
Interceptors use a publish/subscribe mechanism. It is possible to intercept a request 'before' it is executed or 'after' is was executed and before the UI receives it.

### Adding interceptors
Interceptors are stored in the ```src/modules/pubSubInterceptor/interceptors``` directory. It is possible to group interceptors in a sub directory. Every "before" interceptor calls the subscribed callback function with a [request](https://docs.angularjs.org/api/ng/service/$http#$http-arguments) parameter. Every "after" interceptor calls the subscribed callback method with a [response](https://docs.angularjs.org/api/ng/service/$http#$http-returns) parameter.

For example:
```javascript
document.addEventListener('pubSubInterceptorsReady', (e) => {    
    pubSub.subscribe('before-pnxBaseURL', (reqRes) => {
        //modify request here
        return reqRes;
    });

    pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
        //modify response here
        return reqRes;
    });    
});
```

A topic name is constructed by a prefix(after-, before-) and a rest base url as defined by PrimoVE.
All restBaseURLs can be queries for using the pubSub object.
```javascript
pubSub.restBaseURLs
```

### List of before-topics
```javascript
pubSub.listBeforeTopics
```

### List of after-topics
```javascript
pubSub.listAfterTopics
```

### List all events
```javascript
pubSub.listEvents
```