$(document).ready(function() {
    
    $('.btn-filter').on('click', function() {
        
        $('.btn-filter').removeClass('active'); 
        $(this).addClass('active');             

        var filterValue = $(this).attr('data-filter');

        if (filterValue === 'all') {
            $('.news-card').fadeIn(400);
        } else {
            $('.news-card').hide();
            $('.news-card.' + filterValue).fadeIn(400);
        }
    });

});