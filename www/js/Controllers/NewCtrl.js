FormalWear.controller('NewCtrl', function($scope, $state, $ionicScrollDelegate, NavBar, Composer, $http) {
    $scope.showView = {
        details: true,
        questions: false,
        privacy: false
    };

    $scope.imgDataURL = Composer.getImg();
    var currId = 0;
    $scope.prompts = [];
    $scope.showDelete = false;
    $scope.showReorder = false;
    $scope.deleting = false;
    $scope.reordering = false;
    $scope.sortableConfig = {
        handle: '.ion-drag'
    }
    $scope.discovery = true;

    $scope.$on('$ionicView.beforeEnter', function() {
        NavBar.setVisibility(true);
    });

    $scope.clickedItem = function(id) {
        if($scope.deleting) {
            $scope.removeItem(id);
        }
        else if($scope.reordering) {
            $scope.upItem(id);
        }
        else {
            $scope.editItem(id);
        }
    }

    $scope.setEdit = function(state) {
        var elements = document.getElementsByClassName('user-prompt-entry');
        for(var i = 0; i < elements.length; i++) {
            elements[i].setAttribute('contentEditable', state);
        }
    }

    $scope.switchTo = function(view) {
        for(var i in $scope.showView) {
            document.getElementById('tab-' + i).classList.remove('tab-item-active');
            $scope.showView[i] = false;
        }
        $scope.showView[view] = true;
        document.getElementById('tab-' + view).classList.add('tab-item-active');
    }

    $scope.displayRemoveItem = function() {
        $scope.deleting = !$scope.deleting;
        if($scope.deleting) {
            $scope.reordering = false;
            $scope.setEdit(false);
        }
        else
            $scope.setEdit(true);
    }

    $scope.displayReorderItem = function() {
        $scope.reordering = !$scope.reordering;
        if($scope.reordering) {
            $scope.deleting = false;
            $scope.setEdit(false);
        }
        else
            $scope.setEdit(true);
    }

    $scope.removeItem = function(id) {
        for(var i = 0; i < $scope.prompts.length; i++) {
            if($scope.prompts[i].id == id) {
                $scope.prompts.splice(i, 1);
            }
        }
        if($scope.prompts.length <= 1)
            $scope.showReorder = false;
        if($scope.prompts.length <= 0) {
            $scope.showDelete = false;
            $scope.deleting = false;
        }
        $ionicScrollDelegate.resize();
    }

    $scope.upItem = function(id) {
        for(var i = 0; i < $scope.prompts.length; i++) {
            if($scope.prompts[i].id == id) {
                var removed = $scope.prompts.splice(i, 1);
                removed = removed[0];
                $scope.prompts.unshift({
                    id: removed.id,
                    prompt: removed.prompt
                });
                setTimeout(function(){
                    var promptElement = document.getElementById('prompt-' + id).getElementsByClassName('entry')[0];
                    promptElement.innerHTML = removed.prompt;
                }, 1); // wait for DOM update
            }
        }
    }

    $scope.editItem = function(id) {
        var promptElement = document.getElementById('prompt-' + id).getElementsByClassName('entry')[0];
        promptElement.focus();
    }

    $scope.saveItem = function(id) {
        for(var i = 0; i < $scope.prompts.length; i++) {
            if($scope.prompts[i].id == id) {
                $scope.prompts[i].prompt = document.getElementById('prompt-' + id).getElementsByClassName('entry')[0].innerHTML;
            }
        }
        $ionicScrollDelegate.resize();
    }

    $scope.createItem = function() {
        var newPrompt = {
            id: currId,
            prompt: ''
        };
        currId++;
        $scope.prompts.push(newPrompt);
        setTimeout(function(){ $scope.editItem(newPrompt.id); }, 1); // wait for DOM update
        if($scope.prompts.length > 1)
            $scope.showReorder = true;
        if($scope.prompts.length > 0)
            $scope.showDelete = true;
        $ionicScrollDelegate.resize();
    }

    $scope.toggleDiscovery = function() {
        $scope.discovery = !$scope.discovery;
    }

    $scope.post = function() {
        setTimeout($scope.contPost, 1);
    }

    $scope.contPost = function() {
        var newPromptArray = [];
        for(var i = 0; i < $scope.prompts.length; i++) {
            newPromptArray[i] = $scope.prompts[i].prompt;
        }

        $http.post(window.localStorage.serverIP + '/post/image', {
            token: window.localStorage.token,
            imageData: Composer.getImg(),
            description: document.getElementById('user-description').value,
            prompts: newPromptArray,
            discovery: $scope.discovery
        }).then(
            function success(response) {
                delete window.localStorage.composing;
                $state.go('tab.feed');
            },
            function error(response) {
                console.log('Error logging into Formal Wear!')
                console.log(response);
                alert('Could not connect to Formal Wear servers! Have you tried to reset the IP address through the options menu?');
            }
        );
    }
})
