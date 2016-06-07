FormalWear.controller('ExploreCtrl', function($scope, $ionicHistory, $http, $state, $ionicNavBarDelegate, NavBar, FeedPosts, $ionicScrollDelegate, Follow) {
    $scope.posts = [];
    $scope.searchTerm = '';
    $scope.userId = localStorage.userId;
    $scope.isDiscoveryTemplate = true;
    $scope.baseurl = 'explore';

    $scope.$on('$ionicView.beforeEnter', function() {
        NavBar.setVisibility(true);
    });

    $scope.update = function update() {
        FeedPosts.getPosts($http, 'explore', {}, function callback(posts) {
            $scope.posts = posts;
        });
    }

    $scope.update();
});
