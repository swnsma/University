var api = {
    loadImagesList: function(data, success) {
        $.ajax({
            url: '/imageList',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    acceptImage: function(data, success) {
        $.ajax({
            url: '/acceptImage',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    rejectImage: function(data, success) {
        $.ajax({
            url: '/rejectImage',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    remove: function(data, success) {
        $.ajax({
            url: '/removeCurrent',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    loadComponentsList: function(success) {
        $.ajax({
            url: '/loadComponents',
            type: 'GET',
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    createFolder: function(data, success) {
        $.ajax({
            url: '/createFolder',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    },
    deleteFolder: function(data, success) {
        $.ajax({
            url: '/removeFolder',
            type: 'POST',
            data: data,
            success: function(response) {
                success(response);
            },
            error: function (xhr) {
                console.log(xhr);
                alert('Woops! Something going wrong.');
            }
        })
    }
};