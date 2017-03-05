'use strict';

angular.
module('userServise', [])
  .service('user', ['$http', function($http) {

    this.getUsers = function(){
    return $http.get('https://jsonplaceholder.typicode.com/users');
  }
}]);
