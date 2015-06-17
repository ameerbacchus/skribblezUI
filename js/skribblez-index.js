/**
 * Created by Am on 6/17/15.
 */

//var mainbottom = $('body').offset().top + $('body').height();


// on scroll,
$(window).on('scroll',function(){


    var $windowScroll = $(window).scrollTop();
    var $windowHeight = $(window).height();
    var $bodyHeight = $('body').outerHeight();
    var $starterScrollTop = $('.sk-start-wrapper').offset().top;
//    var $starterHeight = ($('.sk-start-wrapper').outerHeight())/2;
    var starterScrollHeight = $starterScrollTop - $windowHeight;
//    var starterScrollTrigger = starterScrollHeight + $starterHeight;


    var scrollComplete = $bodyHeight - $windowHeight;
    var scrollRatio = $windowHeight/$bodyHeight;
    var scrollThumbHeight = Math.floor(scrollRatio * $windowHeight - 20);


    var triggerHeight = scrollThumbHeight + ($windowScroll * scrollRatio);
    var triggerHeightPx = triggerHeight + "px";

    console.log("windowScroll = " + $windowScroll);
    console.log("starterScrollTop = " + $starterScrollTop);
//    console.log("starterScrollTrigger = " + starterScrollTrigger);
   console.log("triggerHeight = " + triggerHeight);

    /* demo purposes only */
    var $trigger = $('.trigger-test');
    $trigger.css("top", triggerHeightPx);


    if($windowScroll > 0){
        $('nav').addClass('shrink');
        $('#brand').addClass('shrink-brand');

    } else{
        $('nav').removeClass('shrink');
        $('#brand').removeClass('shrink-brand');
    }


    if(   $windowScroll > starterScrollHeight  ){
        console.log('yes');
        $('.sk-start-container').fadeIn("slow");
    }

});
