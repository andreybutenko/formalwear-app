FormalWear.factory('SignOut', function () {
    return {
        signOut($state, $ionicHistory) {
            window.localStorage['token'] = undefined;
            delete window.localStorage['token'];
            window.localStorage.userId = undefined;
            delete window.localStorage.userId;
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
            $state.go('splash');
        }
    }
})
