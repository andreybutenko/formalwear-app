FormalWear.controller('EditProfileCtrl', function($scope, $state, Camera, NavBar, $ionicHistory, SignOut, $http, $ionicPopup, $ionicScrollDelegate) {
    $scope.user = {};
    $scope.userSecure = {
        email: '',
        password: '',
        newPassword: '',
        imageData: '',
        imageDataNew: ''
    };
    $scope.clubs = {
        'FBLA': false,
        'DECA': false,
        'MUN': false,
        'HOSA': false
    }

    $scope.popup = {};

    var newClubPopup = ({
        template: '<input type="text" ng-model="popup.newClub">',
        title: 'Enter club name',
        scope: $scope,
        buttons: [
            { text: 'Cancel' },
            {
                text: '<b>Save</b>',
                type: 'button-positive',
                onTap: function(e) {
                    return $scope.popup.newClub;
                }
            }
        ]
    });

    $scope.$on('$ionicView.beforeEnter', function() {
        NavBar.setVisibility(true);
    });

    $scope.takePicture = function() {
        Camera.getPicture({ destinationType: 0, encodingType: 1 }).then(function(imageURI) {
            $scope.userSecure.imageData = 'data:image/png;base64,' + imageURI;
            $scope.userSecure.imageDataNew = imageURI;
        }, function(err) {
            console.log(err);
            if(err != 'Camera cancelled.')
                alert(err);
        });
    }

    $scope.addClub = function() {
        $scope.popup.newClub = '';
        var popup = $ionicPopup.show(newClubPopup);
        popup.then(function(clubName) {
            if((clubName != '') && clubName) {
                $scope.clubs[clubName] = true;
            }
        });

        $ionicScrollDelegate.resize();
    }

    // get account info
    $http.post(window.localStorage.serverIP + '/account/details/full', {
        token: window.localStorage.token
    }).then(
        function(response) {
            $scope.user = response.data;
            $scope.userSecure.email = $scope.user.emailAddress || 'NO';
            if($scope.user.imageUrl.indexOf('http') == -1) {
                $scope.userSecure.imageData = window.localStorage.serverIP + $scope.user.imageUrl;
            }
            else {
                $scope.userSecure.imageData = $scope.user.imageUrl;
            }
            for(var i = 0; i < response.data.clubs.length; i++) {
                $scope.clubs[response.data.clubs[i]] = true;
            }
        },
        function(response) {
            console.log('Failed to get info!');
            $state.go('splash');
        }
    );

    $scope.save = function() {
        $scope.popup.error = '';

        var counter = 0;
        var expecting = 0;
        var notices = '';

        var done = function done() {
            var popup = $ionicPopup.alert({
                title: 'Updated!',
                template: notices
            });
            counter = 0;
            expecting = 0;
            notices = '';
        }
        var success = function success(response) {
            console.log('Success updating profile!');
            counter++;
            notices += response.data + '<br/>';
            if(counter == expecting) done();
        }
        var error = function error(response) {
            console.log('Error updating profile!');
            console.log(response);
            counter++;
            notices += response.data + '<br/>';
            if(counter == expecting) done();
        }

        // aggregate new club info
        var clubsArray = [];
        for(var club in $scope.clubs) {
            if($scope.clubs[club] == true)
                clubsArray.push(club);
        }
        // aggregate all unconfidential, profile-related info
        var generalInfo = {
            firstName: $scope.user.name.first || '',
            lastName: $scope.user.name.last || '',
            description: $scope.user.description || '',
            school: $scope.user.school || '',
            clubs: clubsArray || []
        }

        // aggregate profile picture data, if necassary
        var photoInfo = {};
        if($scope.userSecure.imageDataNew != '') {
            photoInfo = {
                picture: $scope.userSecure.imageDataNew
            }
        }

        // aggregate secure account info, if necassary
        var accountInfo = {};
        if($scope.userSecure.email != $scope.user.emailAddress) { // email field altered
            if($scope.userSecure.email != 'NO') { // no email
                if(typeof $scope.userSecure.email == 'undefined') { // invalid eamil
                    $scope.popup.error += 'Invalid email address.<br/>';
                }
                else {
                    if($scope.userSecure.password == '') { // no password provided
                        $scope.popup.error += 'Provide current password to change email address.<br/>';
                    }
                    else {
                        accountInfo.email = $scope.userSecure.email;
                        accountInfo.password = $scope.userSecure.password;
                        accountInfo.newPassword = null;
                    }
                }
            }
        }

        if($scope.userSecure.newPassword != '') { // new password field altered
            if($scope.userSecure.password == '') { // current password not provided
                $scope.popup.error += 'Provide current password to set new one.<br/>';
            }
            else {
                accountInfo.password = $scope.userSecure.password;
                accountInfo.newPassword = $scope.userSecure.newPassword;
            }
        }

        // error check
        if($scope.popup.error != '') {
            var popup = $ionicPopup.alert({
                title: 'Errors in form',
                template: $scope.popup.error
            });
            return;
        }

        // send out updates
        generalInfo.token = window.localStorage.token;
        $http.post(window.localStorage.serverIP + '/profile/update/general', generalInfo).then(success, error);
        expecting++;
        if(typeof photoInfo.picture != 'undefined') {
            photoInfo.token = window.localStorage.token;
            $http.post(window.localStorage.serverIP + '/profile/update/image', photoInfo).then(success, error);
            expecting++;
        }
        if(typeof accountInfo.password != 'undefined') {
            accountInfo.token = window.localStorage.token;
            $http.post(window.localStorage.serverIP + '/profile/update/secure', accountInfo).then(success, error);
            expecting++;
        }
    }
});
