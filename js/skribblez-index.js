/**
 * Created by Am on 6/17/15.
 */

//var mainbottom = $('body').offset().top + $('body').height();


// on scroll,
$(window).on('scroll',function(){

    windowScroll = $(window).scrollTop();
    console.log(windowScroll);

    if(windowScroll>0){
        $('nav').addClass('shrink');
        $('#brand').addClass('shrink-brand');

    } else{
        $('nav').removeClass('shrink');
        $('#brand').removeClass('shrink-brand');
    }

//    if (stop > mainbottom) {
//        $('nav').addClass('shrink');
//    } else {
//        $('nav').removeClass('shrink');
//    }

});