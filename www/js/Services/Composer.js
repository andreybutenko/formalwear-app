FormalWear.factory('Composer', function() {
    var dataURL = 'http://192.168.0.32:8100/img/placeholder/man1.jpg';
    var currId = 0;
    var prompts = [];

    return {
        newImg(newDataURL) {
            dataURL = newDataURL;
        },
        getImg() {
            return dataURL;
        }
    }
})
