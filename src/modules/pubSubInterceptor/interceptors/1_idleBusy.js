//document.addEventListener('pubSubInterceptorsReady', (e) => {

let dotTestPerformanceStart;

pubSub.subscribe('before-pnxBaseURL', (reqRes) => {
    dotTestPerformanceStart = performance.now();
    document.querySelector('dot-test').innerHTML = '.'
    document.querySelector('dot-test').classList.add('busy')
    return reqRes;
} );

pubSub.subscribe('after-pnxBaseURL', (reqRes) => {
    document.querySelector('dot-test').classList.remove('busy')    
    document.querySelector('dot-test').innerHTML = Math.ceil(performance.now() - dotTestPerformanceStart);    
    return reqRes;
} );
//});