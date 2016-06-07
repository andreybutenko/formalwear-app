FormalWear.controller('ProfileCtrl', function($scope, $state, $http, $stateParams, $ionicNavBarDelegate, $ionicHistory, FeedPosts, Follow, NavBar) {
    NavBar.setVisibility(true);
    $scope.userId = $stateParams.userId;
    $scope.user = {};
    $scope.posts = [];

    $scope.canFollow = true;
    $scope.hideFollow = true;

    $scope.isDiscoveryTemplate = true;
    if($ionicHistory.currentStateName().indexOf('feed') > -1) {
        $scope.baseurl = 'feed';
    }
    else if($ionicHistory.currentStateName().indexOf('notifications') > -1) {
        $scope.baseurl = 'notifications';
    }
    else {
        $scope.baseurl = 'explore';
    }

    $http.post(window.localStorage.serverIP + '/account/details', {
        id: $scope.userId
    }).then(
        function success(response) {
            $scope.user = response.data;
            if($scope.user.imageUrl.indexOf('http') == -1) {
                $scope.user.imageUrl = window.localStorage.serverIP + $scope.user.imageUrl;
            }
        },
        function fail(response) { // if anything goes wrong
            console.log('Error connecting to Formal Wear!');
            console.log(response);
            alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
        }
    );

    $scope.posts = [];

    $scope.update = function update() {
        FeedPosts.getPosts($http, '/feed/user', { userId: $scope.userId }, function callback(posts) {
            $scope.posts = posts;

            for(var i = 0; i < $scope.posts.length; i++) {
                Follow.possible($http, $scope.posts[i].authorData['_id'], i, function callback(result) {
                    if(result.canFollow == true)
                        $scope.posts[result.etc].canFollow = true;
                    if(result.canFollow == false)
                        $scope.posts[result.etc].canFollow = false;
                    if(result.canFollow == 'self')
                        $scope.posts[result.etc].hideFollow = true;
                    else
                        $scope.posts[result.etc].hideFollow = false;
                });
            }
        });
    }

    $scope.update();
});
