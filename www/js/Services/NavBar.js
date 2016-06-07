FormalWear.factory('NavBar', function () {
    var navVisible = false;

    var setVisibility = function(visibility) {
        navVisible = visibility;
        if(visibility)
            document.body.classList.remove('nav-hidden');
        else
            document.body.classList.add('nav-hidden');
    }

    return {
        setVisibility(visibility) {
            setVisibility(visibility);
        },
        toggleVisibility() {
            setVisibility(!navVisible);
        }
    }
})
