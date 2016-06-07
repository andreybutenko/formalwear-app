FormalWear.controller('NotificationsCtrl', function($scope, $state, $ionicScrollDelegate, NavBar, Composer, $http, NavBar) {
    $scope.notifications = [];

    $scope.$on('$ionicView.beforeEnter', function() {
        NavBar.setVisibility(true);
    });

    $scope.update = function update() {
        // Only convoluted because of callbacks!
        // getNotifications: get all notifications
        // saveNotifications: handling
        // getAuthor: get additional data about authors
        // saveAuthor: handling
        // getDate: get date
        // done, fail: end conditions
        var getNotifications = function getNotifications() {
            $http.post(window.localStorage.serverIP + '/notifications/get', {
                token: localStorage.token
            }).then(
                saveNotifications,
                fail
            );
        }
        var saveNotifications = function saveNotifications(notificationDatas) {
            $scope.notifications = [];

            if(notificationDatas.data.length == 0)
                return;

            for(var i = 0; i < notificationDatas.data.length; i++) {
                var j = notificationDatas.data.length - 1 - i; // opposite, so we can reverse-order
                $scope.notifications[i] = notificationDatas.data[j];
            }

            getAuthor();
        }

        var getAuthor = function getAuthor() {
            $scope.notifications.forEach(function(notification, index) {
                $http.post(window.localStorage.serverIP + '/account/details', {
                    id: notification.source
                }).then(
                    function(authorData) { saveAuthor(index, authorData) },
                    fail
                );
            });
        }
        var saveAuthor = function finalize(index, authorData) {
            $scope.notifications[index].authorData = authorData.data;
            if($scope.notifications[index].authorData.imageUrl.indexOf('http') == -1) {
                $scope.notifications[index].authorData.imageUrl = window.localStorage.serverIP + $scope.notifications[index].authorData.imageUrl;
            }
            if(index == $scope.notifications.length - 1) getDate();
        }

        var getDate = function getDate() {
            $scope.notifications.forEach(function(notification, index) {
                $http.post(window.localStorage.serverIP + '/date/humanize', {
                    date: notification.time
                }).then(
                    function(response) { $scope.notifications[index].time = response.data; },
                    fail
                );
                if(index == $scope.notifications.length - 1) done();
            });
        }

        var done = function done() {
            $scope.$broadcast('scroll.refreshComplete');
        }
        var fail = function fail(response) { // if anything goes wrong
            console.log('Error connecting to Formal Wear!');
            console.log(response);
            alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
        }
        getNotifications();
    }

    $scope.update();
});
