FormalWear.controller('FeedQuestionCtrl', function($scope, $state, $ionicPopup, $ionicScrollDelegate, Follow, $ionicHistory, $stateParams, NavBar, FeedPosts, $http) {
    $scope.showView = {
        questions: true,
        comments: false
    };

    $scope.newCommentText = '';

    if($ionicHistory.currentStateName().indexOf('feed') > -1) {
        $scope.baseurl = 'feed';
    }
    else if($ionicHistory.currentStateName().indexOf('notifications') > -1) {
        $scope.baseurl = 'notifications';
    }
    else {
        $scope.baseurl = 'explore';
    }

    $scope.switchTo = function(view) {
        for(var i in $scope.showView) {
            document.getElementById('tab-' + i).classList.remove('tab-item-active');
            $scope.showView[i] = false;
        }
        $scope.showView[view] = true;
        document.getElementById('tab-' + view).classList.add('tab-item-active');
        setTimeout(function() { $ionicScrollDelegate.resize(); }, 1);
        setTimeout(function() { $ionicScrollDelegate.resize(); }, 5);
    }

    $scope.$on('$ionicView.beforeEnter', function() {
        NavBar.setVisibility(true);
    });

    $scope.post = {};

    $scope.deleteComment = function(id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deletion Confirmation',
            template: 'Are you sure you want to delete your comment?'
        });

        confirmPopup.then(function(result) {
            if(result) {
                $http.post(window.localStorage.serverIP + '/comment/delete', {
                    token: localStorage.token,
                    commentId: id
                }).then(
                    function success(response) {
                      $ionicHistory.goBack();
                    },
                    function error(response) {
                        alert('Error connecting to Formal Wear');
                    }
                );
            }
        });
    }

    $scope.postComment = function(text) {
        if(text.trim() == '') {
            return;
        }

        $http.post(window.localStorage.serverIP + '/comment/post', {
            token: localStorage.token,
            postId: $scope.post.id,
            comment: text
        }).then(
            function success(response) {
                $state.go($state.current, {}, {reload: true});
            },
            function error(response) {
                console.log(response);
                alert('Error connecting to Formal Wear');
            }
        );
    }

    $scope.follow = function follow(index, userId) {
        $scope.post.canFollow = false;
        Follow.follow($http, userId);
    }

    $scope.unfollow = function unfollow(index, userId) {
        $scope.post.canFollow = true;
        Follow.unfollow($http, userId);
    }

    $scope.deletePost = function deletePost(index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Deletion Confirmation',
            template: 'Are you sure you want to delete your post?'
        });

        confirmPopup.then(function(result) {
            if(result) {
                $http.post(window.localStorage.serverIP + '/post/delete', {
                    token: localStorage.token,
                    postId: $scope.post.id
                }).then(
                    function success(response) {
                        $scope.posts.splice(index, 1);
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

    FeedPosts.getPost($http, $stateParams.postId, function callback(post) {
        $scope.post = post;
        readyUp();
        if($scope.post.questions.length == 0) {
            $scope.switchTo('comments');
        }

        Follow.possible($http, $scope.post.authorData['_id'], 0, function callback(result) {
            if(result.canFollow == true)
                $scope.post.canFollow = true;
            if(result.canFollow == false)
                $scope.post.canFollow = false;
            if(result.canFollow == 'self')
                $scope.post.hideFollow = true;
            else
                $scope.post.hideFollow = false;
        });
    });
    $scope.voted = {};
    $scope.stats = {};

    function readyUp () {
        getComments();

        for(var i = 0; i < $scope.post.questions.length; i++) {
            $http.post(window.localStorage.serverIP + '/question/canVote', {
                token: window.localStorage.token,
                postId: $scope.post.id,
                questionId: i
            }).then(
                function success(response) {
                    $scope.voted[response.data.requested] = !response.data.can;
                    getStats(response.data.requested);
                },
                function error(response) {
                    console.log('Failed to check if we can vote!');
                    console.log(response);
                }
            );
        }
    }

    function getStats (questionId) {
        $http.post(window.localStorage.serverIP + '/question/getResults', {
            token: window.localStorage.token,
            postId: $scope.post.id,
            questionId: questionId
        }).then(
            function success(response) {
                $scope.stats[response.data.requested] = {};
                $scope.stats[response.data.requested].yes = response.data.voteYes;
                $scope.stats[response.data.requested].no = response.data.voteNo;
                $scope.stats[response.data.requested].total = response.data.voteYes + response.data.voteNo;
            },
            function error(response) {
                console.log('Failed to get stats!');
                console.log(response);
            }
        );
    }

    function getComments() {
        FeedPosts.getComments($http, $scope.post.id, function callback(comments) {
            $scope.post.comments = comments;
            for(var i = 0; i < comments.length; i++) {
                if(comments[i].authorData['_id'] == localStorage.userId) {
                    comments[i].amOwner = true;
                }
                else {
                    comments[i].amOwner = false;
                }
            }
        })
    }

    $scope.toggleDesc = function(id) {
        document.getElementById(id).classList.toggle('expanded');
        $ionicScrollDelegate.resize();
    }

    $scope.respond = function(response, index) {
        $http.post(window.localStorage.serverIP + '/question/respond', {
            token: window.localStorage.token,
            postId: $scope.post.id,
            questionId: index,
            answer: response
        }).then(
            function success(response) {
                console.log('Successfully voted!');
                $scope.voted[index] = true;
                getStats(index);
            },
            function error(response) {
                console.log('Failed voting!');
                console.log(response);
            }
        );
    }
});
