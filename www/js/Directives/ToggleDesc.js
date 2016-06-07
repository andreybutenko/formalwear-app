FormalWear.directive('toggleDesc', function($compile) {
    return {
        restrict: 'AEC',
        controller: function($scope, $element, $ionicScrollDelegate) {
            $scope.expanded = false;
            $scope.toggle = function toggle() {
                $scope.expanded = !$scope.expanded;
                $ionicScrollDelegate.resize();
            }
        }
    }
});
