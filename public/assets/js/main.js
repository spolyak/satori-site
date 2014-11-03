
function scroll_to(clicked_link, nav_height) {
	var element_class = clicked_link.attr('href').replace('#', '.');
	var scroll_to = 0;
	if(element_class != '.top-content') {
		element_class += '-container';
		scroll_to = $(element_class).offset().top - nav_height;
	}
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 1000);
	}
}


jQuery(document).ready(function() {
	
	$('#js-news').ticker({controls: false,ajaxFeed: true,htmlFeed: false,feedUrl: '/rss/latest',feedType: 'xml'});
	
	$(".flip").hover(function(){
  		$(this).find(".card").toggleClass("flipped");
  		return false;
	});

	/***** Navigation *****/

	$('a.scroll-link').on('click', function(e) {
		e.preventDefault();
		var nav_height = $('nav').height();
		if($('nav').css('position') != 'static') { // window width > 767px
			scroll_to($(this), nav_height);
		}
		else {
			scroll_to($(this), 0);
		}
	});
	
	$('.show-menu a').on('click', function(e){
		e.preventDefault();
		var menu_links = $('.nav-links a').not('.nav-links .show-menu a');
		if(menu_links.css('display') == 'none') {
			menu_links.css('display', 'inline-block');
		}
		else {
			menu_links.css('display', 'none');
		}
	});
	
	$(window).on('resize', function(){
		var menu_links = $('.nav-links a').not('.nav-links .show-menu a');
		if($('nav').css('position') != 'static') { // window width > 767px
			menu_links.css('display', 'inline-block');
		}
		else {
			menu_links.css('display', 'none');
		}
	});
	
	/***** CSS ANIMATIONS (DISABLES ON MOBILE DEVICES) *****/ 

	userAgent = window.navigator.userAgent;
	
	if(/iP(hone|od|ad)/.test(userAgent)==false) {

		$('.slide-up').bind('inview', function (event, visible) {
		  if (visible == true) {
		    // element is now visible in the viewport
		    $(this).addClass('animated fadeInUp');
		  } else {
		    // element has gone out of viewport
		    $(this).removeClass('animated fadeInUp');
		  }
		});

	}


/***** Pretty Photo *****/

$(document).ready(function(){
	jQuery("a[data-gal^='prettyPhoto']").prettyPhoto();
});

/***** Testimonials *****/

$('.carousel').carousel({
  interval: 5000,
  pause: "hover",
});
	
/***** Background slideshow *****/

    
    $('.top-content').backstretch([
      "assets/img/backgrounds/1.jpg"
    , "assets/img/backgrounds/2.jpg"
    , "assets/img/backgrounds/3.jpg"
    ], {duration: 3000, fade: 800});



/***** Subscription form *****/
        
    $('.success-message').hide();
    $('.error-message').hide();

    $('.subscribe form').submit(function(e) {
    	e.preventDefault();
        var postdata = $('.subscribe form').serialize();
        $.ajax({
            type: 'POST',
            url: 'assets/subscribe.php',
            data: postdata,
            dataType: 'json',
            success: function(json) {
                if(json.valid == 0) {
                    $('.success-message').hide();
                    $('.error-message').hide();
                    $('.error-message').html(json.message);
                    $('.error-message').fadeIn();
                }
                else {
                    $('.error-message').hide();
                    $('.success-message').hide();
                    $('.subscribe form').hide();
                    $('.success-message').html(json.message);
                    $('.success-message').fadeIn();
                }
            }
        });
    });
    
/***** Contact form *****/
	    
    $('.contact-form form input[type="text"], .contact-form form textarea').on('focus', function() {
    	$('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
    });
	$('.contact-form form').submit(function(e) {
		e.preventDefault();
	    $('.contact-form form input[type="text"], .contact-form form textarea').removeClass('contact-error');
	    var postdata = $('.contact-form form').serialize();
	    $.ajax({
	        type: 'POST',
	        url: 'assets/contact.php',
	        data: postdata,
	        dataType: 'json',
	        success: function(json) {
	            if(json.emailMessage != '') {
	                $('.contact-form form .contact-email').addClass('contact-error');
	            }
	            if(json.subjectMessage != '') {
	                $('.contact-form form .contact-subject').addClass('contact-error');
	            }
	            if(json.messageMessage != '') {
	                $('.contact-form form textarea').addClass('contact-error');
	            }
	            if(json.emailMessage == '' && json.subjectMessage == '' && json.messageMessage == '') {
	                $('.contact-form form').fadeOut('fast', function() {
	                    $('.contact-form').append('<p>Thanks for contacting us!</p>');
	                });
	            }
	        }
	    });
	});

    
});


    


