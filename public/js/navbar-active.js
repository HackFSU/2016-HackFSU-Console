function getCurrentPage() {
    var url = document.location.href;
    var name = url.substring(url.lastIndexOf('/') + 1);

    return name.toLowerCase();
}

$(document).ready(function() {
    var currentPage = getCurrentPage();

    switch (currentPage) {
        case '':
            $('#home').addClass('active');
            break;
        case 'data':
            $('#data').addClass('active');
            break;
    }
});
