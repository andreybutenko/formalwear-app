FormalWear.directive('tabView', function($compile) {
    return {
        restrict: 'AEC',
        controller: function($scope, $element, $ionicScrollDelegate) {
            $scope.showView = {};

            $scope.setupTabs = function setupTabs(tabs) {
                for(var i = 0; i < tabs.length; i++) {
                    $scope.showView[tabs[i]] = false;
                    if(i == 0) {
                        $scope.showView[tabs[i]] = true;
                    }
                }
            }

            $scope.switchTo = function switchTo(view) {
                for(var i in $scope.showView) {
                    document.getElementById('tab-' + i).classList.remove('tab-item-active');
                    $scope.showView[i] = false;
                }
                $scope.showView[view] = true;
                document.getElementById('tab-' + view).classList.add('tab-item-active');

                setTimeout(function() { $ionicScrollDelegate.resize(); }, 1);
                setTimeout(function() { $ionicScrollDelegate.resize(); }, 5);
            }
        }
    }
});
