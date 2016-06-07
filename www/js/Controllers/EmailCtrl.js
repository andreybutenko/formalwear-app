FormalWear.controller('EmailCtrl', function($scope, $state, $ionicScrollDelegate, NavBar, Composer, $http, $ionicHistory) {
    $scope.showView = {
        login: false,
        register: true
    };

    $scope.user = {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
    }

    $scope.invalidEmail = false;
    $scope.incomplete = false;
    $scope.displayOther = false;
    $scope.other = '';

    $scope.switchTo = function(view) {
        for(var i in $scope.showView) {
            document.getElementById('tab-' + i).classList.remove('tab-item-active');
            $scope.showView[i] = false;
        }
        $scope.showView[view] = true;
        document.getElementById('tab-' + view).classList.add('tab-item-active');
    }

    $scope.back = function() {
        $scope.user = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        }
        $ionicHistory.goBack();
    }

    function submit(url) {
        $http.post(window.localStorage.serverIP + '/auth/' + url + '/email', $scope.user).then(
            function success(response) {
                console.log('Success logging into Formal Wear!');
                    console.log('Successful logging into Formal Wear!')

                    window.localStorage['token'] = response.data.user.jwt;
                    window.localStorage.userId = response.data.user['_id'];

                    $state.go('tab.feed');
            },
            function err(response) {
                $scope.displayOther = false;
                if(response.data == 'already exists') {
                    $scope.displayOther = true;
                    $scope.other = 'That account already exists. If you meant to log in, switch tabs. Otherwise, try another email.';
                }
                else if(response.data == 'does not exist') {
                    $scope.displayOther = true;
                    $scope.other = 'That account doesn\'t exist. Did you mean to use a different email address?';
                }
                else if(response.data == 'bad password') {
                    $scope.displayOther = true;
                    $scope.other = 'That password is incorrect. Double-check it\'s correct!';
                }
                else {
                    console.log('Error logging into Formal Wear!')
                    console.log(response);
                    alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                }
            }
        );
    }

    $scope.login = function() {
        if(typeof $scope.user.email == 'undefined') {
            $scope.invalidEmail = true;
        }
        else {
            $scope.invalidEmail = false;
        }
        var required = ['email', 'password'];
        $scope.incomplete = false;
        for(var i = 0; i < required.length; i++) {
            if($scope.user[required[i]] == '') {
                $scope.incomplete = true;
            }
        }
        if(!$scope.incomplete && !$scope.invalidEmail) {
            submit('login');
        }
    }

    $scope.register = function() {
        if(typeof $scope.user.email == 'undefined') {
            $scope.invalidEmail = true;
        }
        else {
            $scope.invalidEmail = false;
        }
        var required = ['email', 'password', 'firstName', 'lastName'];
        $scope.incomplete = false;
        for(var i = 0; i < required.length; i++) {
            if($scope.user[required[i]] == '') {
                $scope.incomplete = true;
            }
        }
        if(!$scope.incomplete && !$scope.invalidEmail) {
            submit('register');
        }
    }
});
