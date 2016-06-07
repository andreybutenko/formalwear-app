FormalWear.directive('actionBtn', function(Follow, $compile, $http) {
    return {
        restrict: 'AEC',
        template: function(element, attrs) {
            var template = '<div class="button button-positive">';
            template += '</div>';
        },
        link: function(scope, element, attr) {
            Follow.possible($http, attr.authorId, 0, function callback(result) {
                attr.canFollow = result.canFollow;
                var classes = 'button ';
                var click = '';
                var content = '';

                if(result.canFollow == true) {
                    click = 'follow()';
                    classes += 'button-positive ';
                    content = '{{ verb }} {{ post.author.first }}';
                }
                if(result.canFollow == false) {
                    click = 'follow()';
                    classes += 'button-positive ';
                    content = '{{ verb }} {{ post.author.first }}';
                }
                if(result.canFollow == 'self') {
                    click = 'deletePost()';
                    classes += 'button-assertive ';
                    content = 'Delete Post';
                }

                var content = '<div class="' + classes + '" ng-init="setup(' + result.canFollow + ', \'' + attr.authorId + '\', \'' + attr.postId + '\')" ng-click="' + click + '">' + content + '{{test}}</div>';

                element.html(content);
                $compile(element.contents())(scope);
            });
        },
        controller: function($scope, $element, $ionicPopup, $window, Follow) {
            $scope.verb = 'Follow';
            $scope.setup = function setup(canFollow, authorId, postId) {
                $scope.canFollow = canFollow;
                $scope.authorId = authorId;
                $scope.postId = postId;
                if(canFollow == false) {
                    $scope.verb = 'Unfollow';
                }
            }
            $scope.follow = function follow() {
                if($scope.canFollow == true) {
                    $scope.canFollow = false;
                    Follow.follow($http, $scope.authorId);
                    $scope.verb = 'Unfollow';
                }
                if($scope.canFollow == false) {
                    $scope.canFollow = true;
                    Follow.unfollow($http, $scope.authorId);
                    $scope.verb = 'Follow';
                }
            }

            $scope.deletePost = function deletePost() {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Deletion Confirmation',
                    template: 'Are you sure you want to delete your post?'
                });

                confirmPopup.then(function(result) {
                    if(result) {
                        $http.post(window.localStorage.serverIP + '/post/delete', {
                            token: localStorage.token,
                            postId: $scope.postId
                        }).then(
                            function success(response) {
                                $window.location.reload();
                            },
                            function error(response) {
                                console.log('Error connecting to Formal Wear!');
                                console.log(response);
                                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                            }
                        );
                    }
                });
            }
        }
    }
});
