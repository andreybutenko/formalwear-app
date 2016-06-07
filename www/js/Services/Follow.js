FormalWear.factory('Follow', function() {
    var isPossible = function isPossible($http, userId, etc, callback) {
        if(userId == localStorage.userId)
            return callback({
                canFollow: 'self',
                etc: etc
            });
        getFollowingList($http, localStorage.userId, function (following) {
            if(following.indexOf(userId) > -1)
                callback({
                    canFollow: false,
                    etc: etc
                });
            else
                callback({
                    canFollow: true,
                    etc: etc
                });
        });
    }

    var getFollowingList = function getFollowingList($http, userId, callback) {
        $http.post(window.localStorage.serverIP + '/account/details', {
            token: localStorage.token,
            id: userId
        }).then(
            function success(response) {
                callback(response.data.following);
            },
            function fail(response) {
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                callback([]);
            }
        );
    }

    var unfollow = function unfollow($http, userId) {
        $http.post(window.localStorage.serverIP + '/feed/unfollow', {
            token: localStorage.token,
            toUnFollowId: userId
        }).then(
            function success(response) {

            },
            function fail(response) {
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                callback([]);
            }
        );
    }

    var follow = function follow($http, userId) {
        $http.post(window.localStorage.serverIP + '/feed/follow', {
            token: localStorage.token,
            toFollowId: userId
        }).then(
            function success(response) {

            },
            function fail(response) {
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
            }
        );
    }
    return {
        possible: isPossible,
        list: getFollowingList,
        follow: follow,
        unfollow: unfollow
    }
});
