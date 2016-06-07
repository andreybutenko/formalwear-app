FormalWear.controller('TabCtrl', function($scope, $ionicScrollDelegate, SignOut, NavBar, Camera, Composer, $state, $ionicHistory, $ionicPopover) {

    $scope.logout = function() {
        $scope.popover.hide();
        SignOut.signOut($state, $ionicHistory);
    }

    $ionicPopover.fromTemplateUrl('templates/popover.html', { scope: $scope }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.toggleVisibility = function() {
        NavBar.toggleVisibility();
    }

    $scope.new = function() {
        Camera.getPicture({ destinationType: 0, encodingType: 1 }).then(function(imageURI) {
            //var dataURL = 'data:image/png;base64,' + imageURI;
            Composer.newImg(imageURI);
            $state.go('tab.new');
        }, function(err) {
            console.log(err);
            if(err != 'Camera cancelled.')
                alert(err);

            $state.go('tab.feed');
        });
    }

    $scope.navigate = function(destination) {
        $state.go(destination);
    }
})
