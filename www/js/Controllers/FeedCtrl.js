FormalWear.controller('FeedCtrl', function($scope, $state, $ionicScrollDelegate, $ionicPopup, NavBar, FeedPosts, $http, Follow) {
    $scope.posts = [];
    $scope.lock = false;
    $scope.empty = false;
    $scope.isFeedTemplate = true;
    $scope.baseurl = 'feed';

    $scope.refresh = function() {
        FeedPosts.getPosts($http, 'feed', {}, function callback(posts) {
            $scope.posts = posts;
            if($scope.posts.length == 0) {
                NavBar.setVisibility(true);
                $scope.lock = true;
                $scope.empty = true;
            }
            else {
                $scope.lock = false;
                $scope.empty = false;
            }

            $scope.$broadcast('scroll.refreshComplete');
            scrollDeadZone = 20;
        });
    }

    $scope.refresh();

    $scope.pulling = function() {
        scrollDeadZone = 100;
        setTimeout(function() { scrollDeadZone = 20; }, 5000);
    }

    $scope.navigate = function(destination) {
        $state.go(destination);
    }

    // auto-hide title
    var scrollPos = 0;
    var scrollDeadZone = 20;
    $scope.scroll = function() {
        if($scope.lock) return;
        var scrollData = $ionicScrollDelegate.getScrollPosition();
        if(Math.abs(scrollData.top - scrollPos) > scrollDeadZone) {
            if(scrollPos > scrollData.top) // scroll up
                NavBar.setVisibility(true);
            else // scroll down
                NavBar.setVisibility(false);
            scrollPos = scrollData.top;
        }
    }
});
