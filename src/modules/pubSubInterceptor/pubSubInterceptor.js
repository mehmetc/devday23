/*
  KULeuven/LIBIS (c) 2022
  Mehmet Celik mehmet(dot)celik(at)kuleuven(dot)be
*/
import interceptors from './interceptors/**/*';

angular.module('pubSubInterceptor', ['ng'])
    .config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push(['$q', ($q) => {
            return {
                'request': (request) => {                                                            
                    request = pubSub.delegateTopic('before', request);

                    pubSub.fireEvent(request.url, request);                                        
                    return request;
                },
                'requestError': (request) => {                    
                    return $q.reject(request)
                },
                'responseError': (response) => {                    
                    return $q.reject(response)
                },
                'response': (response) => {                    
                    response = pubSub.delegateTopic('after', response);
                    pubSub.fireEvent(response.config.url, response.data);
                    
                    return response
                }
            }
        }]);        
    }]);