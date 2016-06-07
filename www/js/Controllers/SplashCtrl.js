FormalWear.controller('SplashCtrl', function($scope, NavBar, $http, $ionicSlideBoxDelegate, $state, $ionicHistory, $ionicPopup) {
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $scope.nextSlide = function() {
        $ionicSlideBoxDelegate.next();
    }

    $scope.configure = function() {
        
    }

    $scope.login = function() {
        facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'],
            function loginSuccess(success) {
                var server = window.localStorage['serverIP'];
                console.log('Successful logging into Facebook!');
                $http.post(server + '/auth/register/facebook', {
                    fbUserId: success.authResponse.userID,
                    fbAccessToken: success.authResponse.accessToken,
                    fbTokenExpiry: success.authResponse.expiresIn
                }).then(
                    function successCallback(response) {
                        console.log('Successful logging into Formal Wear!')

                        window.localStorage['token'] = response.data.user.jwt;
                        window.localStorage.userId = response.data.user['_id'];

                        $state.go('tab.feed');
                    },
                    function errorCallback(response) {
                        console.log('Error logging into Formal Wear!')
                        console.log(response);
                        alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                    }
                );
            },
            function loginFail(detail) {
                console.log('Error logging into Facebook!');
                console.log(detail);
                alert('Could not connect to Facebook! Please try again later.');
            });
    }
});
