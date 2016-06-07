FormalWear.factory('FeedPosts', function() {
    var posts = [];

    // Flow is convoluted because of callbacks not playing well with for loops.
    // Basically:
    // getPosts gets array of posts
    // savePost puts data from first response into model
    // getAuthor gets additional author information
    // saveAuthor puts data from getAuthor responses into model
    // getDate gets and parses relative date

    return {
        getPosts($http, url, data, callback) {
            data.token = window.localStorage.token;
            var getPosts = function getPosts() {
                $http.post(window.localStorage.serverIP + url, data).then(
                    savePost,
                    fail
                );
            }
            var savePost = function savePost(postDatas) {
                posts = [];

                if(postDatas.data.length == 0)
                    return callback([]);

                for(var i = 0; i < postDatas.data.length; i++) {
                    var postData = postDatas.data[i];

                    posts[i] = {
                        postData: postData,
                        id: postData['_id'],
                        description: postData.description,
                        image: window.localStorage.serverIP + postData.imageUri,
                        questions: postData.prompts,
                        questionCount: postData.prompts.length
                    };
                }

                getAuthor();
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

            var done = function done() {
                callback(posts);
            }
            var fail = function fail(response) { // if anything goes wrong
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                callback();
            }

            getPosts();
        },


        getComments($http, postId, callback) {
            var comments = [];
            var getComments = function getComments() {
                $http.post(window.localStorage.serverIP + '/comment/get', {
                    token: localStorage.token,
                    postId: postId
                }).then(
                    saveComments,
                    fail
                );
            }
            var saveComments = function saveComments(commentDatas) {
                if(commentDatas.data.length == 0)
                    return callback([]);

                for(var i = 0; i < commentDatas.data.length; i++) {
                    var commentData = commentDatas.data[i];

                    comments[i] = {
                        id: commentData['_id'],
                        author: commentData.commenterId,
                        comment: commentData.comment,
                        published: commentData.published
                    };
                }

                getAuthor();
            }

            var getAuthor = function getAuthor() {
                comments.forEach(function(comment, index) {
                    $http.post(window.localStorage.serverIP + '/account/details', {
                        id: comment.author
                    }).then(
                        function(authorData) { saveAuthor(index, authorData) },
                        fail
                    );
                });
            }
            var saveAuthor = function saveAuthor(index, authorData) {
                comments[index].authorData = authorData.data;
                comments[index].author = {
                    first: authorData.data.name.first,
                    last: authorData.data.name.last,
                    full: authorData.data.name.first + ' ' + authorData.data.name.last
                }
                if(comments[index].authorData.imageUrl.indexOf('http') == -1) {
                    comments[index].authorData.imageUrl = window.localStorage.serverIP + comments[index].authorData.imageUrl;
                }
                if(index == comments.length - 1) getDate();
            }

            var getDate = function getDate() {
                comments.forEach(function(comment, index) {
                    $http.post(window.localStorage.serverIP + '/date/humanize', {
                        date: comments[index].published
                    }).then(
                        function(response) { comments[index].time = response.data; },
                        fail
                    );
                    if(index == comments.length - 1) done();
                });
            }

            var done = function done() {
                callback(comments);
            }
            var fail = function fail(response) { // if anything goes wrong
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                callback();
            }

            getComments();
        },


        getPost($http, postId, callback) {
            var postData = {};
            var fail = function fail(response) { // if anything goes wrong
                console.log('Error connecting to Formal Wear!');
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
                callback();
            }
            $http.post(window.localStorage.serverIP + '/post/get', {
                token: localStorage.token,
                postId: postId
            }).then(
                function(response) {
                    postData = {
                        postData: response.data,
                        id: response.data['_id'],
                        description: response.data.description,
                        image: window.localStorage.serverIP + response.data.imageUri,
                        questions: response.data.prompts,
                        questionCount: response.data.prompts.length
                    };
                    $http.post(window.localStorage.serverIP + '/account/details', {
                        id: postData.postData.author
                    }).then(
                        function(authorData) {
                            postData.authorData = authorData.data;
                            postData.author = {
                                first: authorData.data.name.first,
                                last: authorData.data.name.last,
                                full: authorData.data.name.first + ' ' + authorData.data.name.last
                            }
                            if(postData.authorData.imageUrl.indexOf('http') == -1) {
                                postData.authorData.imageUrl = window.localStorage.serverIP + postData.authorData.imageUrl;
                            }
                            $http.post(window.localStorage.serverIP + '/date/humanize', {
                                date: postData.postData.published
                            }).then(
                                function(timeData) {
                                    postData.time = timeData.data;
                                    callback(postData);
                                },
                                fail
                            );
                         },
                        fail
                    );
                },
                fail
            );
        }
    };
});
