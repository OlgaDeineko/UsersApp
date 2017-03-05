'use strict';

angular.
module('usersList').
component('usersList', {
  templateUrl: 'users-list/users-list.template.html',
  controller: ['$uibModal','user', function UsersListController($uibModal, user,  NgMap) {
    var self = this;
    self.orderProp = 'name';

    user.getUsers().then(function(response) {
      self.users = response.data;
    });

    self.distance= function (user) {
      var lat1 = 50.2716;
      var lon1 = 30.3125;
      var index = self.users.indexOf(user);
      var lat2 = self.users[index].address.geo.lat;
      var lon2 = self.users[index].address.geo.lng;
      var rad = function (x) {
        return x * Math.PI / 180;
      };
      var R = 6371000; // metres
      var φ1 = rad(lat1);
      var φ2 = rad(lat2);
      var Δφ = rad(lat2-lat1);
      var Δλ = rad(lon2-lon1);
      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;
      return d.toFixed(2);
    };

    self.deleteUser = function(user){
      var index = self.users.indexOf(user);
      self.users.splice(index, 1);
    };

    self.open = function() {
      $uibModal.open({
        component: "createModal",
        resolve: {
          modalData: function() {
            return self.users;
          }
        }
      });
    };

    self.editUser = function(user) {
      var index = self.users.indexOf(user);
      $uibModal.open({
        component: "editModal",
        resolve: {
          modalData: function() {
            return self.users[index];
          }
        }
      });
    };

   }]
});
angular.
module('usersList').run(function($rootScope) {
  $rootScope.$on('mapInitialized', function(evt,map) {
    $rootScope.map = map;
    $rootScope.$apply();
  });
}).component('createModal', {
  templateUrl: 'users-list/create-modal.html',
  bindings: {
    modalInstance: "<",
    resolve: "<"
  },
  controller: [function() {
    var self = this;
    self.modalData = self.resolve.modalData;
    self.handleClose = function() {
      self.modalInstance.close(self.modalData);
    };

    self.addUser = function (domScope,newUser) {
      self.newUser.id = self.modalData.length + 1;
      self.modalData.push(self.newUser);
      self.newUser = null;
      self.modalInstance.close(self.modalData);

    };

    self.verifyDuplicate = function(domScope){
      for(var i = 0; i < self.modalData.length; i++) {
        if(self.modalData[i].name !== self.newUser.name ) {
          domScope.userForm.personName.$setValidity('duplicate',false);
        }
        else if(self.modalData[i].username !== self.newUser.username ) {
          domScope.userForm.personName.$setValidity('duplicate',false);
        }
        else if(self.modalData[i].email !== self.newUser.email ) {
          domScope.userForm.personName.$setValidity('duplicate',false);
        }
        else if(self.modalData[i].company.name !== self.newUser.company.name ) {
          domScope.userForm.personName.$setValidity('duplicate',false);
        }
        else {
          domScope.userForm.personName.$setValidity('duplicate',true);
          alert("Duplicated!");
          self.newUser.name = "";
          return self.verifyDuplicate(domScope);
        }
      }
    };
    // self.latlng = [-25.363882,131.044922];
    // self.getpos = function(event){
    //   self.modalData[index].address.geo.lat.val(event.latLng.lat());
    //   self.modalData[index].address.geo.lng.val(event.latLng.lng());
    // }

    self.distance= function (user) {
      var lat1 = 50.2716;
      var lon1 = 30.3125;
      var index = self.modalData.indexOf(user);
      var lat2 = self.modalData[index].address.geo.lat;
      var lon2 = self.modalData[index].address.geo.lng;

      var rad = function (x) {
        return x * Math.PI / 180;
      };
      var R = 6371000; // metres
      var φ1 = rad(lat1);
      var φ2 = rad(lat2);
      var Δφ = rad(lat2-lat1);
      var Δλ = rad(lon2-lon1);

      var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c;

      return d.toFixed(2);
    };

  }]
});

angular.
module('usersList').component('editModal', {
  templateUrl: 'users-list/edit-modal.html',
  bindings: {
    modalInstance: "<",
    resolve: "<"
  },
  controller: [function($http) {
    var self = this;
    self.modalData = self.resolve.modalData;
    self.updateUser = function () {
      self.modalInstance.close(self.modalData);
    };
    self.handleClose = function() {
      self.modalInstance.close();
    };

  }]
});

