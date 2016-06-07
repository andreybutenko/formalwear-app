FormalWear.controller('SearchCtrl', function($scope, $state, $http, $stateParams, $ionicNavBarDelegate, FeedPosts, $ionicScrollDelegate, Follow) {
    $scope.searchTerm = $stateParams.searchTerm;
    $scope.posts = [];
    $scope.people = [];
    $scope.baseurl = 'explore';
    $scope.isDiscoveryTemplate = true;

    $scope.arePosts = false;
    $scope.areUsers = false;

    $scope.follow = function follow(index, userId) {
        $scope.posts.canFollow = false;
        Follow.follow($http, userId);
    }

    $scope.unfollow = function unfollow(index, userId) {
        $scope.posts.canFollow = true;
        Follow.unfollow($http, userId);
    }

    $scope.search = function search(searchTerm) {
        $scope.searchTerm = searchTerm;
        $http.post(window.localStorage.serverIP + '/search', { query: $scope.searchTerm }).then(
            function success(response) {
                $scope.people = [];
                $scope.posts = [];

                setupPosts(response.data.response.posts);
                $scope.people = response.data.response.users;
                for(var i = 0; i < $scope.people.length; i++) {
                    if($scope.people[i].imageUrl.indexOf('http') == -1) {
                        $scope.people[i].imageUrl = window.localStorage.serverIP + $scope.people[i].imageUrl;
                    }
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
                }

                if(response.data.response.posts == 0) {
                    $scope.arePosts = false;
                }
                else {
                    $scope.arePosts = true;
                }

                if(response.data.response.users == 0) {
                    $scope.areUsers = false;
                }
                else {
                    $scope.areUsers = true;
                }
            },
            function fail(response) { // if anything goes wrong
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
            }
        );
    }

    $scope.search($stateParams.searchTerm);

    function setupPosts(postDatas) {
        posts = [];
        // Flow is convoluted because of callbacks not playing well with for loops.
        // Basically:
        // we have the array of posts
        // savePost puts data from first response into model
        // getAuthor gets additional author information
        // saveAuthor puts data from getAuthor responses into model
        // getDate gets and parses relative date

        if(postDatas.length == 0)
            return;

        for(var i = 0; i < postDatas.length; i++) {
            var postData = postDatas[i];

            posts[i] = {
                postData: postData,
                id: postData['_id'],
                description: postData.description,
                image: window.localStorage.serverIP + postData.imageUri,
                questions: postData.prompts,
                questionCount: postData.prompts.length
            };
        }

        var getAuthor = function getAuthor() {
            posts.forEach(function(post, index) {
                $http.post(window.localStorage.serverIP + '/account/details', {
                    id: post.postData.author
                }).then(
                    function(authorData) { saveAuthor(index, authorData) },
                    fail
                );
            });
        }
        var saveAuthor = function finalize(index, authorData) {
            posts[index].authorData = authorData.data;
            posts[index].author = {
                first: authorData.data.name.first,
                last: authorData.data.name.last,
                full: authorData.data.name.first + ' ' + authorData.data.name.last
            }
            if(posts[index].authorData.imageUrl.indexOf('http') == -1) {
                posts[index].authorData.imageUrl = window.localStorage.serverIP + posts[index].authorData.imageUrl;
            }
            if(index == posts.length - 1) getDate();
        }

        var getDate = function getDate() {
            posts.forEach(function(post, index) {
                $http.post(window.localStorage.serverIP + '/date/humanize', {
                    date: post.postData.published
                }).then(
                    function(response) { posts[index].time = response.data; },
                    fail
                );
                if(index == posts.length - 1) done();
            });
        }

        var done = function done () {
            console.log(posts);
            $scope.posts = posts;
        }

        var fail = function fail() {
            console.log('Error connecting to Formal Wear!');
            console.log(response);
            alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
        }

        getAuthor();
    }
});
