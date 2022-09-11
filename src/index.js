/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
import './primo';
import './sass/style.scss';
import Loader from './loader';
import './modules/pubSubInterceptor';

(function(){
  let customType = 'centralCustom';
  let moduleList = ['ng', 'oc.lazyLoad', 'angularLoad', 'ngMaterial', 'pubSubInterceptor'];
                    
  let app = angular.module(customType, moduleList);

  //Load components
  new Loader().load(customType);
  console.log(`Done initializing ${customType}`);
})();