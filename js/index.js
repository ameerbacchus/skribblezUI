(function($) {
    $(document).ready(function(evt) {
        var $img = $('.logo img'),
            loaded = false;

        $img.on('load', function(evt) {
            loaded = true;
            $('body').addClass('loaded');
            $img
                .off('load')
                .attr('src', $img.attr('src'));
        });

        if (!loaded) {
            $img.attr('src', $img.attr('src') + '?' + new Date().getTime());
        }
    });
})(jQuery);