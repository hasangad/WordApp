//let's set our AJAX config
$.ajaxSetup ({
    //enable caching of AJAX responses
    cache: true
});

//Global variables
var wa_readingWidth; //needs to be global as jQuery edits the default value
var wa_fadingTime = 0; //time needed to fade
var wa_ajax_loading = "<div style='position:absolute;' id='wa_load'><div id='wa_load_image'></div></div>"; //the ajax loading image
var wa_minCutOff = 1200; //the cut off until merging the two main sections
var wa_delayLoad = 0; //the delay on loading different content
var wa_disableTouches = true; //to disable touches
var wa_supportScript = '/wp-content/themes/wordapp/scripts/support.php'; //the support script
var wa_loadURL_CDN = "/wp-content/themes/wordapp/api/"; //the get data script
var wa_loadURL = "/wp-content/themes/wordapp/api/"; //the get data script
var wa_nameError = "Please enter a name."; //error for no name
var wa_emailError = 'Please enter a valid email.'; //error for no correct email
var wa_messageError = 'Please enter a message.'; //error for no message
var wa_descriptionError = 'Please enter a description for your tip.'; //error for the description
var wa_sourceError = 'Please enter a valid source in link format starting with "http://".'; //error for wrong source
var wa_popupOpen = false; //whether or not if a popup is currently open
var wa_popupLoaded = false; //whether a popup has been loaded
var wa_myScroll_categories; //scroller for categories
var wa_myScroll_posts; //scroller for the posts section
var wa_loadedPostID = -1; //the post ID of a loaded post
var wa_featuredData; //featured data
var wa_smallScreen; //whether it's a smaller screen (below the cut off point)
var wa_catsPosition; //position var
var wa_currentCategory = -1; //the current category
var wa_currentAuthor = -1; //the current author
var wa_postsKey; //the key to prevent caching of "bad" data
var wa_currentPage = 0; //the current page
var wa_postRange; //the range of posts
var wa_lastPostID; //the last loaded post ID in the post list
var wa_currentTag = -1; //curent loaded tag ID
var wa_columnsMerged = false; //whether or not the columns have been merged
var wa_currentLocation = {text: ""}; // the current location where the user is
var wa_preloaded_content = []; //for the content that is preloaded
var wa_isLoadingContent = false; //not loading content
var disqus_shortname = "techcores"; //for disqus
var disqus_developer = 1; //turn disqus into dev mode
var wa_disqusLoaded = 0; //count of Disqus load times
var wa_disqusEnabled = false; //is disqus enabled?
var wa_startTime = (new Date()).getTime(); //load time for user
var wa_loading_time; //time taken to load
var wa_preloadedPostNum = 0; //what post it stopped at when preloading
var wa_isAnalyticsEnabled = false; //disalbe Google Analytics

//determine if it's an iOS device
var wa_ua = navigator.userAgent;
var wa_isMobileDevice = (wa_ua.match(/(iPhone|iPod|iPad)/)) ? true : false;

//dev log stuff
var wa_textDevLog = ""; //the entire log
var wa_devLogIsOn = (!wa_isMobileDevice) ? false : false; //whether or not things should be loggd to the console

//click events
var wa_clickEventStart = (wa_isMobileDevice) ? "touchstart" : "mousedown";
var wa_clickEventEnd = (wa_isMobileDevice) ? "touchend" : "click";

//async loop
var asyncFor = function(params) {
        var defaults = {
        total: 0,
        limit: 100,
        pause: 10,
        context: this
    },
    options = $.extend(defaults, params),
    def = $.Deferred(),
    step = 0,
    done = 0;

    this.loop = function() {
        if (done < options.total) {
            tep = 0;
            for (; step < options.limit; step += 1, done += 1) {
                def.notifyWith(options.context, [done]);
            }
            setTimeout.apply(this, [this.loop, options.pause]);
        } else {
            def.resolveWith(options.context);
        }
    };
     
    setTimeout.apply(this, [this.loop, options.pause]);
    return def;
};

//jQuery theme functions
//For centering anything exactly on screen
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", (($(window).height() - this.outerHeight()) / 2) + "px");
    this.css("left", (($(window).width() - this.outerWidth()) / 2) + "px");
    return this;
};


//function to push images to cache
(function($) {

	var wa_pushImage = this.src;

	// Arguments are image paths relative to the current page.
	$.preLoadImages = function(e) {
		var wa_pushImage = e.src; //get source of image

		var wa_cacheImage = document.createElement('img');

		wa_cacheImage.src = wa_pushImage;
	};
	
})(jQuery);

//check to see if element is in viewport
function wa_isScrolledIntoView(elem){
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

//Main theme functions
function wa_sendToGA(wa_url) {
	wa_devLog("sending " + wa_url + " to Google...");
	
	if (typeof _gaq !== "undefined" && _gaq !== null) {
		_gaq.push(['_trackPageview', wa_url]);
	}
}

//for converting object to string
function wa_objToString (wa_obj) {
    var wa_str = '';
    for (var p in wa_obj) {
        if (wa_obj.hasOwnProperty(p)) {
            wa_str += p + '::' + wa_obj[p] + ' - ';
        }
    }
    return wa_str;
}

//for dev logging
function wa_devLog(wa_log) {
	var wa_myDate = new Date();
	wa_textDevLog += wa_myDate + ":\t\t" + wa_log + "\n";
	
	if (wa_devLogIsOn) {
		console.log(wa_log);
	}
}

//load posts
function wa_loadAJAX(wa_loadURL_CDN,wa_postData) { 
    return $.get(wa_loadURL_CDN, wa_postData,
        function(wa_posts_data) {}
    );
}

//for validating emails
function wa_isValidEmailAddress(wa_emailAddress) {
    var wa_pattern = new RegExp(/^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
    return wa_pattern.test(wa_emailAddress);
}

//for validating the url links
function wa_isValidURL (wa_link) {
    var wa_pattern = new RegExp(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&amp;'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
    return wa_pattern.test(wa_link);
}

//function to show reCAPTCHA 
function wa_showRecaptcha(wa_element) {
    Recaptcha.create("6LeeO8cSAAAAAAlA1BWyDAHDbYj8uzAzeTkHpBSb", wa_element, {theme: "white",callback: Recaptcha.focus_response_field});
}

//function for handling the load posts button
function wa_loadPostsPage(wa_paged, wa_isLoadingPost) {
    
    if (!wa_isLoadingPost) {
    	//show the loading indicator
    	wa_showLoading();
    }
        
    //add one to the current page
    wa_currentPage++;
    
    wa_devLog("loading posts page " + wa_currentPage + " and wa_isLoadingPost = " + wa_isLoadingPost);
    
    //declare the array
    var wa_array = [];
    
    //test if it's not the home page
    if (wa_currentCategory !== -1 && wa_currentTag === -1 ) wa_array.category = wa_currentCategory;
    
    //set the tags
    if (wa_currentTag !== -1) wa_array.tags = wa_currentTag;
	
	//set the tags
	if (wa_currentAuthor !== -1) wa_array.author = wa_currentAuthor;

    $.get(wa_loadURL_CDN, $.extend(true, {key: wa_postsKey, paged: wa_currentPage, type: 'posts'}, wa_array), function(wa_data) {

		wa_devLog("done downloading page " + wa_currentPage + "... loading images");

        //remove all post range divs
        $("aside #wa_posts_range").remove();
        
        //set data
        wa_addPosts(wa_data);
        
        $('body').waitForImages(function() {
        
			wa_devLog("done loading images for post page " + wa_currentPage);
            
            //determine last post ID
            wa_determinewa_lastPostID();
                                        
            //make active post to be sure
            wa_activePost();
                    
            //set range
            wa_set_postRange();
            
            if (wa_isLoadingPost) {
                //cache selector
                var wa_selector = $("#"  + wa_loadedPostID);
                
                //load the post
                wa_loadPost(wa_selector.parent().next().children().children(".wa_posts_title").attr("class").split(" ")[1], null, wa_selector.parent().next().children().attr("class").split(" ")[1]);
            } else {
                //hide the loading
                wa_hideLoading();
			}
        
			//preload the posts
			wa_preloadContent();
			
			//quickly check the paging
            wa_checkPaging();
        });
        
    }, 'json');
}

//for loading post data on startup only
function wa_loadPostOnStartup(wa_key,wa_slug) {

	wa_devLog("loading post" + wa_slug + " on key " + wa_key);
	
	var wa_data = null;
	
    //only run if there is a post key
    if (wa_key !== "" && wa_key !== null && wa_slug !== "" && wa_slug !== null) {
        //get slug from hash
        
        if (wa_slug === "") {
            var wa_path = window.location.pathname;
            wa_slug = wa_path.replace(/\//g,'');
        }
        
        //data returned
        var wa_data = [];
        
		//for single posts
        if ($("article").hasClass("wa_isSingle")){
			//is a single post -- content is already there
			wa_data[0] = wa_selector.html();
        } else if (wa_slug !=="" && wa_slug !=="#" && wa_slug !=="#!") {
			//load post using existing function
			wa_data = wa_loadAJAX( wa_loadURL_CDN,{ type: "post", slug:wa_slug, key:wa_key } );
        }
        
    } else if ($("article").hasClass("wa_isSingle")) {
    	wa_data = [];
		wa_data[0] = $("#wa_reading_wrapper #wa_scroller").html();
    }
    
    //return the data
    return wa_data;
}

//to add range to post listing
function wa_addRange(wa_data) {
	$('aside #wa_posts_listing').append('<div id="wa_posts_range" class="' + wa_data[wa_data.length-1].range + '"></div>');
}

//to add posts to post listing from JSON
function wa_addPosts(wa_data) { 	
	for( var i=0; i < wa_data.length-1; i++) {
		$('aside #wa_posts_listing').jqoteapp('#wa_template_posts', wa_data[i]);
	}
	
	wa_addRange(wa_data);
}


//for loading all the posts and featured content dynamically
//on start up only
function wa_loadData(wa_isFirstTime) {
    //show the loading indicator
    wa_showLoading(); 
    
    //hide breadcrumb
    wa_showHideBreadcrumb(false);
    
    //get slug from hash
    var wa_slug = window.location.href.split("/").pop();
    
    //make sure it's only taking from the first hash
    wa_slug = wa_slug.split('#')[0];
    
    //if it's not the first time, reset hash
    if (!wa_isFirstTime) {
		window.location.hash = '';
		wa_slug = "";
    }
    
    //set the slug
    var wa_newSlug = {type: "key"};

    //test the slug and fix the reading text if needed
    if (wa_slug !== "" && wa_slug !== "!" && wa_slug !== "#"){
        $("nav #wa_nav_reading span").html("Reading");
        wa_togglePostNav(true);
        wa_newSlug = $.extend(true, wa_newSlug, {slug:wa_slug});
    }
    
    $.ajax({
        type: "GET",
        url: wa_loadURL,
        cache: false,
        data: wa_newSlug,
        dataType: "json",
        success: function(wa_data){
        
            //set the posts key
            wa_postsKey = wa_data.posts;
            
            wa_devLog("loading data on startup...");

            //load both the posts and featured data
            $.when( wa_loadAJAX(wa_loadURL_CDN,{type: "posts",key: wa_postsKey} ), wa_loadAJAX(wa_loadURL_CDN,{ type: "featured", key: wa_data.featured } ), wa_loadPostOnStartup(wa_data.post,wa_slug)).done(function(wa_posts_data, wa_featured_data, wa_post_data){
                
                if (typeof wa_post_data === "undefined") {
					wa_post_data = null;
                } else {
					wa_devLog("loading " + wa_slug + " on startup...");
                }
                
                //make sure everything is switch over
                if (wa_smallScreen && !wa_isFirstTime && wa_post_data === null) {
                    $("article, nav #wa_nav_reading").hide();
                    $("aside, nav #wa_nav_posts").show();
                    wa_devLog("hiding article and showing aside");
                } else if (wa_smallScreen && wa_isFirstTime && wa_post_data !==null) {
                    $("article, nav #wa_nav_reading").show();
                    $("aside, nav #wa_nav_posts").hide();
                    wa_devLog("show article and hiding aside");
                }

				//check how long it took to load
				wa_loading_time = (new Date()).getTime() - wa_startTime;

                //enable touches
                wa_disableTouches = false;
                
                var wa_featuredJSON =  $.parseJSON(wa_featured_data[0]);
                
                //set clear fix
                var wa_clearFix = '<div class="wa_clearfix"></div>';
                
                //set the new data
	            var wa_newFeaturedData = [];
				
				//fill it in
				for (var i=0; i<3; i++) {
					wa_newFeaturedData[i] = {
					      "posts": $('#wa_template_featured_post').jqote(wa_featuredJSON[i].post0) + $('#wa_template_featured_post').jqote(wa_featuredJSON[i].post1) + wa_clearFix,
					      "catName": wa_featuredJSON[i].catName
					};
				}

                //save the featured data
                wa_featuredData = '<div id="wa_reading_section" class="wa_reading_featured">' + $('#wa_template_featured').jqote(wa_newFeaturedData) + "</div>";
            
                //test to see if a post needs to be loaded
                //if not, load the featured posts
                if (wa_post_data === null) {
                    //add in the featured data
                    $("article .wa_scroller").html(wa_featuredData);
                    wa_devLog("no post needs to be loaded... showing feature data");
                } else {
                	
                	if (!$("article").hasClass("wa_isSingle")) {
		                //set json data
		                var wa_jsonPost = $.parseJSON(wa_post_data[0]);
	
		                //show post
		                $('#wa_reading_wrapper .wa_scroller').jqotesub('#wa_template_article', wa_jsonPost);
	                }
	                
                    wa_devLog("post needs to be loaded... showing post data");
                                        
                    //alert Google
                    wa_sendToGAOnPost();
                }
                
                //set json data
                var wa_jsonData = $.parseJSON(wa_posts_data[0]);
                
				//remove all posts
				$('aside #wa_posts_listing a').remove(0);

                //add in the posts data                
                wa_addPosts(wa_jsonData);
        
                //fix flash
                wa_fix_flash();

                wa_devLog("waiting for images to load...");
                
                $('body').waitForImages(function() {
                	wa_devLog("images are now fully loaded");

                    //fade it all in
                    if (wa_smallScreen){
	                    if (wa_post_data === null) {
	                    	$("aside div, aside").fadeIn(wa_fadingTime);	
	                    } else {
	                    	$("#wa_reading_wrapper").fadeIn(wa_fadingTime);	
	                    }
                    } else {
	                    	$("#wa_reading_wrapper, aside div, aside").fadeIn(wa_fadingTime);	
                    }
                    
                    //resize the view
                    wa_resizePostsArea();
                    wa_resizeMainContent();
		
                    //hide the loading
                    wa_hideLoading();	
                                                            
                    if (!$.browser.msie && wa_isFirstTime && wa_isMobileDevice) {
                        setTimeout(function () {
                            //posts scrollbar
                            wa_myScroll_posts = new iScroll('wa_posts_wrapper', {checkDOMChanges: true, scrollbarClass: 'wa_posts_scrollbar' ,fadeScrollbar: false, hideScrollbar : false, bounce : true, momentum: true });
                            
                            wa_devLog("starting iScroll...");
                        }, wa_delayLoad);
                    } else if (!wa_isFirstTime) {
                        //reset the scrollers
                        
                        //reset the wa_loadedPostID as no posts are loaded
                        wa_loadedPostID = -1;
                                                
                        //refresh the scroll bar
                        if (wa_isMobileDevice) {
                            wa_refreshScroller(null, wa_myScroll_posts);
                        } else {
                            wa_refreshScroller($("#wa_posts_wrapper"), null);
                            wa_refreshScroller($("#wa_reading_wrapper"), null);
                        }
                        
                        //change the reading text
                        wa_changeReadingText(false);
                        
                    }
                    
                    if (wa_isFirstTime) {

                        if (wa_slug !== "" && wa_slug !== "!" && wa_slug !== "#"){
                            //make sure the post is highlighted and loaded
                            wa_setLoadedPost();
                            wa_activePost();
                            
                            //set range
                            wa_determinewa_lastPostID();
                            wa_set_postRange();
                            
                            //run post actions
                            wa_postsActions();
                        }

                        //make sure load posts button is right
                        wa_set_postRange();
                        wa_checkPaging();
                                            
                        //add the active class
                        if (!wa_isMobileDevice) {
                            $(this).addClass('wa_active');
                        }

                    } else {
						//remove search results, if any
						wa_removeSearchResults();
                    }
                    
                    //check post range
                    wa_set_postRange();
                    
                    //determine last post ID
                    wa_determinewa_lastPostID();

					//preload the posts
					wa_preloadContent();
                    
                });
                
            });
        }
    });


}

//for refreshing the scroll bars
function wa_refreshScroller(wa_div,wa_scroller) {

    //refresh the scroll bar
    if (wa_scroller !==null) {
        if (!$.browser.msie) {
            setTimeout(function () { 
                wa_scroller.scrollTo(0,0,0);
                wa_scroller.refresh();
            }, 0);
        }
    } else {
        setTimeout(function () { 
            wa_div.scrollTop(0);
        }, 0);
        
    }

	wa_devLog("refressing scrollbar");
}

//function for making post active
function wa_activePost() {
    //give the active post the active class
    $("aside a").removeClass('wa_active_post');
    $("#"  + wa_loadedPostID).parent().addClass('wa_active_post');
    wa_devLog("setting active post");
}


//for setting the loaded post
function wa_setLoadedPost() {
	wa_loadedPostID = $("#wa_reading_wrapper .wa_scroller #wa_main_post:last").attr("class");
	wa_devLog("setting loaded post");
}

function wa_fix_flash() {
	
	wa_devLog("fixing flash...");
	
    // loop through every embed tag on the site
    var wa_embeds = document.getElementsByTagName('embed');
    var wa_html;
    var i;
    
    for (i = 0; i < wa_embeds.length; i++) {
        wa_embed = wa_embeds[i];
        var wa_new_embed;
        // everything but Firefox & Konqueror
        if (wa_embed.outerHTML) {
            wa_html = wa_embed.outerHTML;
            // replace an existing wmode parameter
            if (wa_html.match(/wmode\s*=\s*('|")[a-zA-Z]+('|")/i))
                wa_new_embed = wa_html.replace(/wmode\s*=\s*('|")window('|")/i, "wmode='transparent'");
            // add a new wmode parameter
            else
                wa_new_embed = wa_html.replace(/<embed\s/i, "<embed wmode='transparent' ");
            // replace the old embed object with the fixed version
            wa_embed.insertAdjacentHTML('beforeBegin', wa_new_embed);
            wa_embed.parentNode.removeChild(wa_embed);
        } else {
            // cloneNode is buggy in some versions of Safari & Opera, but works fine in FF
            wa_new_embed = wa_embed.cloneNode(true);
            if (!wa_new_embed.getAttribute('wmode') || wa_new_embed.getAttribute('wmode').toLowerCase() === 'window')
                wa_new_embed.setAttribute('wmode', 'transparent');
            wa_embed.parentNode.replaceChild(wa_new_embed, wa_embed);
        }
    }
    // loop through every object tag on the site
    var wa_objects = document.getElementsByTagName('object');
    for (i = 0; i < wa_objects.length; i++) {
        wa_object = wa_objects[i];
        var wa_new_object;
        // object is an IE specific tag so we can use outerHTML here
        if (wa_object.outerHTML) {
            wa_html = wa_object.outerHTML;
            // replace an existing wmode parameter
            if (wa_html.match(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")[a-zA-Z]+('|")\s*\/?\>/i))
                wa_new_object = wa_html.replace(/<param\s+name\s*=\s*('|")wmode('|")\s+value\s*=\s*('|")window('|")\s*\/?\>/i, "<param name='wmode' value='transparent' />");
            // add a new wmode parameter
            else
                wa_new_object = wa_html.replace(/<\/object\>/i, "<param name='wmode' value='transparent' />\n</object>");
            // loop through each of the param tags
            var wa_children = wa_object.childNodes;
            for (j = 0; j < wa_children.length; j++) {
                try {
                    if (wa_children[j] !==null) {
                        var wa_theName = wa_children[j].getAttribute('name');
                        if (wa_theName !==null && wa_theName.match(/flashvars/i)) {
                            wa_new_object = wa_new_object.replace(/<param\s+name\s*=\s*('|")flashvars('|")\s+value\s*=\s*('|")[^'"]*('|")\s*\/?\>/i, "<param name='flashvars' value='" + wa_children[j].getAttribute('value') + "' />");
                        }
                    }
                }
                catch (wa_err) {
                }
            }
            // replace the old embed object with the fixed versiony
            wa_object.insertAdjacentHTML('beforeBegin', wa_new_object);
            wa_object.parentNode.removeChild(wa_object);
        }
    }
}
                

function wa_postsActions() {
	wa_devLog("running post actions...");
	
	//refresh size as scrollbars might or not be there
	setTimeout(function () { 
		wa_resizePostsArea();
		wa_resizeMainContent();
	}, 7);

	//for removing image links
    $("#wa_reading_content a:has(img)").each(function() { 
    	//making sure it doesn't do it for the right links
    	if (!$(this).children().hasClass('link')) {
			$(this).replaceWith($(this).children());
		}
	});
	
	//make open in new window for all post links
    $("#wa_reading_content a").each(function() { 
    	//making sure it doesn't do it for the right links
		$(this).attr("target", "_blank");
	});

	//move images in h1-6 tags out
	$("#wa_reading_content h1:has(img),#wa_reading_content h2:has(img),#wa_reading_content h3:has(img),#wa_reading_content h4:has(img),#wa_reading_content h5:has(img),#wa_reading_content h6:has(img)").each(function(wa_index, wa_val) {
		$("img", wa_val).insertAfter(wa_val);
	});
	
	//strip all iframes in post based on what it is sourcing
	$("#wa_reading_content iframe").each(function () {
		//set the iframe
		var wa_iframe = $(this);
		
		//get the source val
		var wa_linkSource = wa_iframe.attr("src");
		
		//video ID
		var wa_vidID = "";
		
		//determine what type of vid it is
		if (wa_linkSource.indexOf( "youtube.com/embed" ) > -1) {
			
			//save the id of the vid
			wa_vidID = wa_linkSource.match(/[\w\-]{11,}/)[0];
		
			//create and add image element			
			var wa_source = 'http://img.youtube.com/vi/' + wa_vidID + '/0.jpg';
			wa_iframe.after('<img class="wa_aligncenter" id="' + wa_vidID + '" src="' + wa_source + '" />');
						
		} else if (wa_linkSource.indexOf( "player.vimeo.com" ) > -1) {
		
			//save the id of the vid
			wa_vidID = wa_linkSource.split(/video\/|http:\/\/vimeo\.com\//)[1].split(/[?&]/)[0];
			
			//set the api url to vimeo
		    var wa_url = "http://vimeo.com/api/v2/video/" + wa_vidID + ".json?callback=wa_showThumb_vimeo";
		
		    //create the img element after iframe
		    wa_iframe.after('<img class="wa_aligncenter" id="' + wa_vidID + '" src="" />');
		
			//create and download the data from the vimeo api
		    var wa_script = document.createElement( 'script' );
		    wa_script.type = 'text/javascript';
		    wa_script.src = wa_url;
		
			//add the script before the image
		    $("#" + wa_vidID).before(wa_script);
		}
		
		//add a:link after iframe and then remove
		$("#" + wa_vidID).wrap('<a class="various iframe fancybox-media wa_aligncenter" href="' + wa_linkSource + '?autoplay=true"></a>');
		$("#" + wa_vidID).before('<span class="video"></span>');
		
		//remove iframe
		wa_iframe.remove(0);		
	});
	
	//see if mobile to show twitter and hide main social bar
	if (wa_isMobileDevice) {
		//show twitter button in title
		$("#wa_twitter_mobile").css("display", "inline-block");
		
		//hide main social section
		$("#wa_social_area, #wa_social_text, .wa_social_line").remove(0);
	}
	
	//check breadcrumb
	wa_checkBreadcrumb();
	
	//scrolltop
	$("body, html").scrollTop(0);
	
	//set active post
	wa_activePost();
	
	//load disqusz
	wa_loadDisqus();
}

function wa_showThumb_vimeo(wa_data){
	//grab the id for the img container
    var wa_vidID = wa_data[0].id;
    
    //set the source of the image url from the json data retrieved
    $("#" + wa_vidID).attr('src', wa_data[0].thumbnail_large);
}

//used for showing and hiding the breadcrumb
function wa_showHideBreadcrumb(wa_show) {
    var wa_selector = $("#wa_breadcrumb");
    
    wa_devLog("showing breadcrumb: " + wa_show);
    
    if (wa_show) {
        wa_selector.show(0);
    } else {
        wa_selector.hide(0);
    }
        
}

//for checking if the breadcrumb needs to be shown
function wa_checkBreadcrumb() {
    //check if the breadcrumb needs shown
    if (wa_smallScreen && wa_loadedPostID !== null && wa_loadedPostID !== -1) {
        //show it
        wa_showHideBreadcrumb(true);
        wa_setBreadCrumb();
        wa_devLog("showing breadcrumb...");
    } else {
        wa_showHideBreadcrumb(false);
    }
}

//for setting the breadcrumb
function wa_setBreadCrumb() {
	
    if (wa_smallScreen) {

		wa_devLog("setting up breadcrumb...");

        //set the main location
        if (wa_currentLocation.text !=="") {
            $("#wa_breadcrumb_location").show();
            
            $("#wa_breadcrumb_location div").html(wa_currentLocation.text);
        } else {
            $("#wa_breadcrumb_location").hide();
        }
        
        //set the post title
        $("#wa_breadcrumb_post").html($("article section #wa_reading_title").html());
    }
}

//for loading a new post
function wa_loadPost(wa_newLoadedSlug,wa_postOffset,wa_key) {

	wa_devLog("loading " + wa_newLoadedSlug + " with key " + wa_key + " and " + wa_postOffset + " offset...");
		
    //show the loading
    wa_showLoading();		
    
    //set the query
    var wa_query = {type: 'post', slug: wa_newLoadedSlug};
    
    //add the key in only if it's there
    if (wa_key !==null) wa_query = $.extend(true, { key: wa_key }, wa_query);
        
    //load the data
    if (wa_preloaded_content !== null && typeof wa_preloaded_content[wa_newLoadedSlug] === "undefined") {
		//did not load data before. load it
		$.get(wa_loadURL_CDN, wa_query, wa_showPost, 'json');
		wa_devLog("downloading post...");
	} else {
		//grab data from the preloaded content array and send it over to the function
		wa_showPost(wa_preloaded_content[wa_newLoadedSlug]);
		wa_devLog("getting post from storage...");
	}
}

//sending data to Google Analytics
function wa_sendToGAOnPost() {
    if (wa_isAnalyticsEnabled) wa_sendToGA("/" + $("#wa_main_post .wa_post_date").attr("id") + "/" + window.location.href.split("/").pop() + "/");
}

//For loading Disqus commenting system
function wa_loadDisqus() { 	
    if (wa_disqusEnabled) {
    	var disqus = $('#disqus_thread');

    	$.getScript('http://techcores.disqus.com/disqus.js');

    	if (wa_disqusLoaded > 0 && typeof DISQUS !== "undefined") {
    		//remove all tooltips
    		$("[class^=dsq-tooltip-]").remove(0);
    		
    		DISQUS.reset({
    		  reload: true,
    		  config: function () {  
    		    this.page.identifier = window.location.href.split("/").pop();  
    		    this.page.url = document.URL;
    		  }
    		});
    	}
    	
    	//loaded once
    	wa_disqusLoaded++;
    }
}

function wa_showPost(wa_data) {
	
	wa_devLog("showing post...");
	
	//add in the data
	$('#wa_reading_wrapper .wa_scroller').jqoteapp('#wa_template_article', wa_data);
		    
	//set the loaded post
	wa_setLoadedPost();
	
	//hide the loaded post
	$("." + wa_loadedPostID).hide();

	//if it's a small screen, make sure everything is switched over
	if (wa_smallScreen) {
		$('#wa_nav_posts').fadeOut(wa_fadingTime/2);

		var wa_reading = $('#wa_nav_reading');
		if (!wa_reading.is(":visible")) wa_reading.fadeIn(wa_fadingTime);
	    
		$("aside").fadeOut(wa_fadingTime/2);
		//$("article").hide();
	}
	
	//fix flash
	wa_fix_flash();
	
	wa_devLog("waiting for images...");
	
	//wait for the images to load then fade out and switch over
	//IMPORTANT: must fade out both posts due to how jQuery & JS works
	$('#wa_reading_wrapper').waitForImages(function() {
	
		wa_devLog("images are loaded");

		//remove all flash objects
		//kep the <object> though to preserve the content from not moving
		$('article .wa_scroller div' + ":first embed").remove();

		$("#wa_main_post").fadeOut(wa_fadingTime/2, function() {

			//remove the previous element... whatever it is
			$('article .wa_scroller div' + ":first").remove();

			//fade in article if small screen
			if (wa_smallScreen) {
				$("article").fadeIn(wa_fadingTime/2);
			}

	        //fade in the content
			$('#wa_main_post').fadeIn(wa_fadingTime/2, function() {	            	            	            
	            //change hash
	            window.location.hash = "!/" + $("article section #wa_reading_title").attr("class");
	            
	            //set the loaded post ID
	            wa_setLoadedPost();		
	            	            
	            //send data to Google
	            wa_sendToGAOnPost();
            	
            	//scroll to top
            	$("body, html").scrollTop(0);
            	
	            //remove any links in images that WordPress adds in 
	            wa_postsActions();
	        });
	                            	            
	        //hide the loading
	        wa_hideLoading();
	        
	        //change the reading pane text only if featured is being displayed
	        if ( $("nav #wa_nav_reading span").html() === "Featured") {
	            wa_changeReadingText(true);
	        }
	        	        
	        //refresh the scroll bar
	        if (!wa_isMobileDevice) {
	            wa_refreshScroller($("#wa_reading_wrapper"), null);
	        }				
	                        
	    });
	    
	});
}
 
//For resizing the posts area based on everything else
function wa_resizePostsArea() {
	wa_devLog("resizing post area...");
	
    //let's set the current width!
    var wa_width = Math.floor( ($("#wa_container").width() - $("#wa_sidebar").outerWidth()) / 2 );
        
    if (wa_width >= wa_readingWidth) {
        //make the posts and reading column the same
        $("article,#wa_breadcrumb,#wa_nav_reading").css('width',wa_width-1);
         $("aside,nav #wa_nav_posts").css('width',wa_width);
    } else if ($("#wa_container").width() <= wa_minCutOff) {
	        wa_removeAndMergeColumns(true);
	        wa_smallScreen = true;
    } else { 
         //can't be 50%, resize the posts column too
         var wa_postsWidth = Math.floor($("#wa_container").width() - $("#wa_sidebar").outerWidth() - wa_readingWidth);
         $("aside,nav #wa_nav_posts").css('width', wa_postsWidth-1);
         $("article,#wa_breadcrumb,#wa_nav_reading").css('width', wa_readingWidth);
     }
     
     if ($("#wa_container").width() > wa_minCutOff && wa_smallScreen) {
         wa_removeAndMergeColumns(false);
         wa_smallScreen = false;
    }
      
}

//for combining (and reseting) the posts and reading section
function wa_removeAndMergeColumns(wa_combine) {

	wa_devLog("remove and merging columns: " + wa_combine);
	
    if (wa_combine) {
    
        //get the width
        var wa_width = $("#wa_container").width() - $("#wa_sidebar").outerWidth() - 1;
        
        //resize the reading column
        $("article,#wa_nav_reading,#wa_breadcrumb").css('width',wa_width);
        
        //resize the posts column
        $("aside,nav #wa_nav_posts").css('width',wa_width);
        
        if (wa_loadedPostID === -1 && !wa_columnsMerged) {
            //hide the reading section
            $("article,#wa_nav_reading").hide();
        } else if (!wa_columnsMerged) {
            //hide the posts section
            $("aside,nav #wa_nav_posts").hide();
        }
        
        wa_checkBreadcrumb();
                
        //set that you're now merged
        wa_columnsMerged = true;

    } else {
        //show the reading section
        $("article,#wa_nav_reading").show();
        $("aside,nav #wa_nav_posts").show();
        
        if (wa_smallScreen && $("#wa_breadcrumb").is(":visible")) {
            wa_showHideBreadcrumb(false);
        }
        
        //set that you're not merged
        wa_columnsMerged = false;
    }
}

//For resizing the height of the main content
function wa_resizeMainContent() {
    
    wa_devLog("resizing main content...");
    
    //set the body/html/wa_container height
   // $("body,html,#wa_container").css('height', $(window).height());
    
	//set the height
	var wa_height = $(window).height() - ($("header").outerHeight() + $("nav").outerHeight());
	
	//if there's the WP-Admin bar, account in for that
	if ($("#wpadminbar").length > 0){
		wa_height -= $("#wpadminbar").outerHeight();
	}
	
	//resize it all!
	$("#wa_sidebar").css('height',wa_height);
	$("aside").css('height',wa_height+1);
	//$("article, #wa_right").css('height',wa_height);
	  
	//if there is a breadcrumb bar, resize the article
	//if (wa_smallScreen) {
	//	$("article, #wa_right").css('height',$("article").height() - $("#wa_breadcrumb").outerHeight());
	//}
	
	//resize any pop-up on screen if it's visible
	if ($("#wa_popup").is(":visible")) {
		$("#wa_popup").center();
	}
	
	//resize any loading indicator on screen if it's visible
	if ($("#wa_load").is(":visible")) {
		$("#wa_load").center();
	}

}

//show the ajax loading
function wa_showLoading() {
	
	wa_devLog("show loading...");
	
    //add in the loading indicator
    $("body").prepend(wa_ajax_loading);
    
    //make sure to center that loading icon!
    $("#wa_load").center().show(wa_fadingTime);
    
    //disable touches
    $("#wa_disableClicks").show();
}

//for hiding the loading indicator
function wa_hideLoading() {
	
	wa_devLog("hide loading...");
	
    $("#wa_load").fadeOut(wa_fadingTime, function() {
        $(this).remove();

        //enable touches
        $("#wa_disableClicks").hide();
    });
}

//for closing a popup window
function wa_closePopup() {

	wa_devLog("closing popup...");
	
    //set the popup variables
    wa_popupOpen = false;
    wa_popupLoaded = false;
    
    wa_show_popup(false,null);
}

//show or hide the popup
function wa_show_popup(wa_isOpening,wa_idName) {
    
    wa_devLog("opening/closing popup " + wa_idName + " - isOpening = " + wa_isOpening);
    
    //test the function variable
    if (wa_isOpening) {
    
        //the query ajax needs to load
        var wa_queryArray;
        var wa_queryName;
        var wa_template = "wa_template_page";
        
        switch (wa_idName) {
            case "wa_sidebar_categories_item":
            	wa_queryName = "categories";
                wa_queryArray = {type: "categories"};
                wa_template = "wa_template_categories";
                
                break;
            case "wa_sidebar_contact_item":
            	wa_queryName = "contact";
                wa_queryArray = {type: "page", page: "Contact"};
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;
            case "wa_sidebar_about_item":
            	wa_queryName = "about";
                wa_queryArray = {type: "about"};
                wa_template = "wa_template_about";
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;
            case "wa_sidebar_polls_item":
            	wa_queryName = "polls";
                wa_queryArray = {type: "page", page: "Polls"};
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;
            case "wa_tipus_button":
            	wa_queryName = "tipus";
                wa_queryArray = {type: "page", page: "Tip Us"};
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;
            case "wa_terms_of_use":
	          	wa_queryName = "terms";
                wa_queryArray = {type: "page", page: "Terms of Use"};
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;
            case "wa_privacy":
         		wa_queryName = "privacy";
                wa_queryArray = {type: "page", page: "Privacy Policy"};
                
                //send data to Google
                wa_sendToGA("/" + wa_queryName + "/");
                break;				
        }

        //disable clicks somehow
        if (wa_idName !=="wa_sidebar_categories_item"){
            wa_fade(false,true);
        } else {
            wa_fade(false,false);
        }
        
        //show the loading indicator
        wa_showLoading(); 
                 
        wa_devLog("loading popup content...");
        
        //use basic url for polls
        var wa_urlToLoad = (wa_idName !== "wa_sidebar_polls_item") ? wa_loadURL_CDN : wa_loadURL;
        
        //load it!
        $.get(wa_urlToLoad, wa_queryArray,
            function(wa_data) {
            
            	wa_devLog("popup content loaded");
            	
                //load the data
                $('body').jqotepre("#" + wa_template, wa_data);

                //popup is loaded
                if (wa_idName !=="wa_sidebar_categories_item" && wa_idName !=="wa_sidebar_about_item") {
                    wa_popupLoaded = true;
                }

                //fade the new data in
                $(".wa_main_popup").fadeIn(wa_fadingTime);
                
                //popup is loading, fade in and center it!
                //only if it's a standard popup
                if ($("#wa_popup").length > 0) $("#wa_popup").center();
                                    
                //fade out the loading indicator
                wa_hideLoading();
                
                //if it's the X item, load the scrollbar
                if (wa_idName === "wa_sidebar_categories_item"){
                                                      
                    setTimeout(function () { 
                        if (wa_isMobileDevice && !$.browser.msie) wa_myScroll_categories = new iScroll('wa_categories_wrapper', {scrollbarClass: 'wa_posts_scrollbar' ,fadeScrollbar: false, hideScrollbar : false, bounce : true, momentum: true });
                        
                        wa_popupLoaded = true;
                    }, wa_delayLoad);
                    
                } else if (wa_idName === "wa_sidebar_about_item") {
                    setTimeout(function () { 
                        if (wa_isMobileDevice && !$.browser.msie) var myScroll_popup = new iScroll('wa_popup_wrapper', {scrollbarClass: 'wa_posts_scrollbar' ,fadeScrollbar: false, hideScrollbar : false, bounce : true, momentum: true });
                        
                        wa_popupLoaded = true;
                    }, wa_delayLoad);
                    
                } else if (wa_idName === "wa_sidebar_contact_item" || wa_idName === "wa_tipus_button") {
                	
                    //show reCAPTCHA
                    wa_showRecaptcha('tci_recapthca');
                                        
                    //name error checking
                    $("#tci_form #name").focus(function() {
                        if ($(this).val() === wa_nameError) {
                            $(this).val('');
                            $(this).removeClass('wa_border_red');
                        }
                    });

                    //email error checking
                    $("#tci_form #email").focus(function() {
                        if ($(this).val() === wa_emailError) {
                            $(this).val('');
                            $(this).removeClass('wa_border_red');
                        }
                    });
                    
                    if (wa_idName !=="wa_tipus_button") {
                        //message error checking
                        $("#tci_form #comments").focus(function() {
                            if ($(this).val() === wa_messageError) {
                                $(this).val('');
                                $(this).removeClass('wa_border_red');
                            }
                        });
                    } else {
                        //source error checking
                        $("#tci_form #source").focus(function() {
                            if ($(this).val() === wa_sourceError) {
                                $(this).val('http://');
                                $(this).removeClass('wa_border_red');
                            }
                        });

                        //description error checking
                        $("#tci_form #description").focus(function() {
                            if ($(this).val() === wa_descriptionError) {
                                $(this).val('');
                                $(this).removeClass('wa_border_red');
                            }
                        });
                    }
                    
                }
            }
        , "json");
        
    } else {
        //fade out the the darker background
        //remove them as well
        wa_fade(true, false);
        $("#wa_load,.wa_popup_window").fadeOut(wa_fadingTime, function() {
            //remove the window
            $(this).remove(); 
            
            //run the close categories action if needed
            if ($(this).children().attr('id') === "wa_categories_popup-arrow-border") {
                wa_closeCategories();
            }
        });
    }
}   

//for toggling the post navigation
function wa_togglePostNav(wa_isOnPost) {
	wa_devLog("toggling post navigation : " + wa_isOnPost);
	
    if (wa_isOnPost) {
        //fade in the reading controls
        $("#wa_nav_previous_post, #wa_nav_next_post").fadeIn(wa_fadingTime/2);
        
    } else {
        //fade out the reading controls
        $("#wa_nav_previous_post, #wa_nav_next_post").fadeOut(wa_fadingTime/2);
    }
}

//for changing the reading text from featured to reading and vice versa
function wa_changeReadingText(wa_isOnPost) {
	
	wa_devLog("changing reading text : " + wa_isOnPost);
	
    var wa_paneText;
    
    //set the pane text
    //if it is a mobile device, it'll always be reading
    if (wa_isOnPost || wa_isMobileDevice) {
        wa_paneText = "Reading"; 
        
    } else {
        wa_paneText = "Featured"; 
    }
    
    if (!wa_isOnPost) wa_togglePostNav(false);
    
    $("nav #wa_nav_reading span").fadeOut(wa_fadingTime/2, function() {
        $(this).html(wa_paneText);
        
        setTimeout(function() {
            $("nav #wa_nav_reading span").fadeIn(wa_fadingTime/2);
            
            if (wa_isOnPost) wa_togglePostNav(true);
        }, wa_fadingTime/2);
    });

}

//for determining the last post ID in the list
function wa_determinewa_lastPostID() {
    //get the last post ID
    wa_lastPostID = $("#wa_posts_wrapper #wa_posts_listing a:last .wa_posts_content").attr("id");
    wa_devLog("last post ID : " + wa_lastPostID);
}

//for reseting the text on the search
function wa_resetSearch() {
    $("#wa_nav_search_bar").val("Search...");
    $('#wa_search_x').hide();
    wa_devLog("resetting search");
}

//show the posts section for a small screen
function wa_switchLayout(wa_str) {
	wa_devLog("switching layout: " + wa_str);
	
    if (wa_str === "posts") {
            $("aside, aside div").fadeIn(wa_fadingTime);
            $('#wa_nav_posts').fadeIn(wa_fadingTime);
            $('#wa_nav_reading').fadeOut(wa_fadingTime);
            $("article").fadeOut(wa_fadingTime);
	}
}

//to remove any search results
function wa_removeSearchResults() {
	//remove any no search results div
	$("aside #wa_no_search_results").remove();
}

//for replacing the posts in the post list
function wa_replacePosts(wa_mainArray) {

	wa_devLog("replacing posts: " + wa_objToString( wa_mainArray));
	
	//hide breadcrumb
	wa_showHideBreadcrumb(false);
	
    //show the loading
    wa_showLoading();
    
    //set page to zero
    wa_currentPage = 0;
    
    //if there is nothing to be searched for, reset it
    if (typeof wa_mainArray.search === "undefined" &&  $("#wa_nav_search_bar").val() !== "Search Tech Cores...") wa_resetSearch();
    
    //always make sure the search form isn't in focus
    $("#wa_nav_search_bar").blur();
    
    //grab the number of posts currently
    var wa_numPosts = $("aside #wa_posts_listing a").size();
    
    //hide paging
    $("#wa_loadPosts_container").hide();
    
    //remove all post range divs
    $("aside #wa_posts_range").remove();
    
    //make sure the current tag get replaced to none if it's not set
    if (wa_mainArray.tags === null) wa_currentTag = -1;
    
    wa_devLog("downloading posts...");
    
    $.get(wa_loadURL_CDN,$.extend(true, { type: "posts", key: wa_postsKey }, wa_mainArray), function(wa_data) {
    	
    	wa_devLog("done downloading posts");
    	
        //enable touches
        wa_disableTouches = false;		
        
        //make sure it's not querying for no search results
        if (wa_data[wa_data.length-1].range.replace(/(^[\s\xA0]+|[\s\xA0]+$)/g, '') !== "nosearchresults") {
            
            //remove search results
            wa_removeSearchResults();
            
            //add in the posts data
            wa_addPosts(wa_data);
            
            wa_devLog("waiting for images to load...");
            
            $('body').waitForImages(function() {
                
                wa_devLog("images fully loaded");
                                        
                //hide the loading
                wa_hideLoading();
                                
                //remove first fourteen posts
                $("aside #wa_posts_listing a:lt(" + wa_numPosts + ")").remove();
                            
                //refresh the scroll bar
                if (wa_isMobileDevice) {
                    wa_refreshScroller(null, wa_myScroll_posts);
                } else {
                    wa_refreshScroller($("#wa_posts_wrapper"), null);
                }
                
                //check post range
                wa_set_postRange();
                
                //determine last post ID
                wa_determinewa_lastPostID();
                
                //make active post to be sure
                if (wa_mainArray.tags === null || !wa_smallScreen) {
                    wa_activePost();
                } else {
                    wa_loadedPostID = -1;
                }
                
           	    if (wa_smallScreen) wa_switchLayout("posts");
                
                
                if (wa_smallScreen) {
                    //remove active post class
                    $("aside a").removeClass('wa_active_post');
                }
                
                //preload the posts
                wa_preloadContent();
         		
         		//resize again       
         		wa_resizePostsArea();
                wa_resizeMainContent();
                
                //check if paging is applicable
                wa_checkPaging();
                
                //scrolltop
                $("body, html").scrollTop(0);
            });
            
        } else {
        	wa_devLog("no search results");
        	        	
            //hide the loading
            wa_hideLoading();
        
            //hide paging
            $("aside #wa_loadPosts_container").hide();
            
            //insert data
            $("aside #wa_posts_listing").html('<div id="wa_no_search_results" class="wa_aligncenter"><div id="wa_search_large_icon" class="wa_aligncenter wa_retina"></div><div id="wa_search_no_posts_text" class="wa_aligncenter">Sorry, there are no results for "' + $("nav #wa_nav_search_bar").val() + '"</div></div>');
                        
        }
        
    }, "json");

}

//to make sure the more posts button is working properly
function wa_checkPaging() {
	wa_devLog("checking paging...");
	
    //figure out if the more posts button needs to be removed or shown
    if (wa_lastPostID !==wa_postRange[1] && wa_postRange[0] !== wa_postRange[1] /*&& !$("#wa_loadPosts_container").is(":visible")*/) {
        $("aside #wa_loadPosts_container").show();
    } else  {
        $("aside #wa_loadPosts_container").hide();
    }
}

function wa_set_postRange() {
    //grab the first and last post made
    wa_postRange = $("aside #wa_posts_range").attr("class").split("-");
    wa_devLog("post range: " + wa_postRange);
}

//for the fading of the popup windows
function wa_fade(wa_close, wa_shade) {
	wa_devLog("fading:" + wa_close + " " + wa_shade);
	
    if (wa_close) {
        //handle the close condition
        $("#wa_fading,#wa_shade").fadeOut(wa_fadingTime);
        
    } else {
        //show the main fading part
        if (!wa_shade) {
            $("#wa_fading").show();
        } else {
            $("#wa_shade,#wa_fading").fadeIn(wa_fadingTime);
        }
    }
}

//Things to do on startup
function wa_startup() {
	wa_devLog("running startup tasks");
	
    //Resize the main area
    wa_resizePostsArea();
    wa_resizeMainContent();
    
    //load the main content
    wa_loadData(true);			
}

//for closing the categories popup
function wa_closeCategories() {
	wa_devLog("closing categories window");
	
    //fade out and remove the categories
    //destory the scrolling
    if (!$.browser.msie && wa_isMobileDevice) {
        wa_myScroll_categories.destroy();
        wa_myScroll_categories = null;
    }
}

//for checking the browser if <=IE6
function wa_checkBrowser() {
    if ($.browser.msie && parseInt($.browser.version, 10) <= 6) {
        //show the old browser popup
        $("#wa_upgradeBrowser").show();
        wa_fade(false,true);
    }
}

//for preloading content in background
function wa_preloadContent() {
	
	if (!wa_isMobileDevice && wa_loading_time < 3000) {
	
		wa_devLog("preloading content...");
		
		//save the size
		var wa_size = $("aside #wa_posts_listing a").size() - wa_preloadedPostNum;
		
		//see when stopped at
		var wa_lastStoppedAt = 0;
		
		asyncFor({
			total: wa_size,
			context: this,
			limit: 1,
			pause: 145
		}).progress(function(i) {
			//grab the next ID of the preloaded post 
			var wa_ID = $("aside a:eq(" + (i + wa_preloadedPostNum) + ") .wa_posts_content").attr("id");
			
			//get the data from the post
			var wa_key =  $("#"  + wa_ID).attr("class").split(" ")[1];
			var wa_seoTag = $("#"  + wa_ID + " .wa_posts_title").attr("class").split(" ")[1];
			
			//set the query
			var wa_query = {type: 'post', slug: wa_seoTag, key: wa_key};
			
			//check to see if the content is already preloaded
			if (typeof wa_preloaded_content[wa_seoTag] === "undefined") {
					//save the data
					wa_preloadContet_data(wa_query);
			}
			
			//save stopped at for use later
			wa_lastStoppedAt = i + wa_preloadedPostNum;
		}).done(function() {
			//stopped at
			wa_preloadedPostNum = wa_lastStoppedAt + 1;
			
			wa_devLog("done preloading content");
		});
		
	}
}

//for preloading the featured contet in background
//TODO: implement this
function wa_preloadFeaturedContent() {
	//save the size
	var wa_size = $("article #wa_reading_section .wa_featured_item").size();
	
	//loop through every section	
	for (var i = 0; i < wa_size; i++) {

		//grab the next ID of the preloaded post 
		var wa_ID = $("article #wa_reading_section .wa_featured_item:eq(" + i + ")").attr("id");
		
		//get the data from the post
		var wa_key =  $("article #wa_reading_section #"  + wa_ID).attr("class").split(" ")[2];
		var wa_seoTag = $("article #wa_reading_section #"  + wa_ID + " .wa_featured_content").attr("id");
		
		//set the query
		var wa_query = {type: 'post', slug: wa_seoTag, key: wa_key};
		
		//check to see if the content is already preloaded
		if (jQuery.type(wa_preloaded_content[wa_seoTag]) === "undefined") {
				//save the data
				wa_preloadContet_data(wa_query);
		}

	}
}

//getting the data from the posts and loading it in
function wa_preloadContet_data(wa_query) {

	if (!wa_isMobileDevice) {

			$.ajax({
			type: 'GET',
			url: wa_loadURL_CDN,
			data: wa_query,
			dataType: 'json',
			slug: wa_query.slug, // Capture the current value of 'i'.
			success: function(wa_data) {
			
				//get the slug
				var wa_dataSlug = this.slug;
				
				//save the data
				wa_preloaded_content[wa_dataSlug] = wa_data;
					
				//preload all images
				var wa_images = $(wa_data.content).find('img');
				
				for (var i = 0; i < wa_images.length; i++) {
					jQuery.preLoadImages(wa_images[i]);
					
					wa_devLog("pushing " + wa_images[i].src + " to cache");
				}

			}
		});
	}
}


//Things to do when the page is ready
$(document).ready(function() {	
    
    //support cross domain
    jQuery.support.cors = true;
            
    //javascript is loaded
    //disable as we really do not need it
    //	$("#wa_nojs, #wa_shade").hide();
    
    //save some data out
    wa_readingWidth = $("article").outerWidth(); //needs to be global as jQuery edits the default value
      	
    //Need to resize certain things
    $(window).resize(function() {
    	wa_resizePostsArea();
    	wa_resizeMainContent();
    });
    
    window.onorientationchange = function() {
		wa_resizePostsArea();
		wa_resizeMainContent();
    };
        
    //Make the arrows move in the sidebar
    if (!wa_isMobileDevice) {
	    $("#wa_sidebar .wa_sidebar_element").hover(
	        function () {
	            $(this).children(".wa_sidebar_arrow").animate({
	                marginLeft: "+=5"
	            }, 100 );
	        }, 
	        function () {
	            $(this).children(".wa_sidebar_arrow").animate({
	                marginLeft: "-=5"
	            }, 100 );
	        }
	    );		
    }
    
    //fading control for the pop-ups
    //when a popup button is clicked
    $("body").on(wa_clickEventEnd, "#wa_sidebar #wa_sidebar_categories_item, #wa_sidebar #wa_sidebar_contact_item, #wa_sidebar #wa_sidebar_about_item, #wa_sidebar #wa_sidebar_polls_item, header #wa_tipus_section #wa_tipus_button, #wa_sidebar #wa_terms_of_use,#wa_sidebar #wa_privacy, #wa_sidebar #wa_sidebar_apply", function() {	
        if (!wa_disableTouches && !wa_popupOpen){
            //popup is open
            wa_popupOpen = true;

            wa_show_popup(true, $(this).attr('id'));
        }
    });

    $("aside").on("click", "#wa_loadPosts_container", function (){
        //load said page
        wa_loadPostsPage(wa_currentPage, false);
    });
    
    $("body").on(wa_clickEventEnd, "#wa_sidebar #wa_sidebar_mobile_item", function() {	
        if (!wa_disableTouches){
            //get the id
            wa_currentCategory = $(this).attr("class").split(' ')[1];
            
            //load the posts in that category
            wa_replacePosts({category: wa_currentCategory});
            
            var wa_text = "Mobile";
            
            //set the current location
            wa_currentLocation = {text: wa_text, id: wa_currentCategory, type: "cat"};
            
            wa_sendToGA("/categories/" + wa_text.replace(/ /g,"-") + "/");
        }
    });

    $("body").on(wa_clickEventEnd, "#wa_sidebar #wa_sidebar_home_item, #wa_breadcrumb_home, #wa_logo", function(e) {
        if (!wa_disableTouches){

			//load the main content
			wa_loadData(false);	
            
            //reset the current location for the small screen breadcrumb
            wa_currentLocation.text = "";
            
            //research the search as it is a full reset
            wa_resetSearch();
                        
            //back to the   page
            wa_currentCategory = -1;	
            
            //back to the original no tags state
            wa_currentTag = -1;
			
			//back to the original no tags state
			wa_currentAuthor = -1;
			            
            //no loaded post
            wa_loadedPostID = -1;
            
            //hide the navigation
            wa_togglePostNav(false);
            
            //goes home
            wa_sendToGA("/");
                        
        }
    });
    

    
    //close the popup when clicked anywhere on the screen
    $("body").on(wa_clickEventEnd, "#wa_fading,#wa_popup_x,.wa_closePopup", function(){
        if ($("#wa_fading").is(":visible") && wa_popupOpen && wa_popupLoaded || $("#wa_upgradeBrowser").is(":visible") ) {
            wa_closePopup();
        }
    });
    
    //remove the disable clicks layer
    $("body").on(wa_clickEventEnd, "#wa_disableClicks", function() {	
        if (wa_popupOpen && wa_popupLoaded){
            //remove the disable clicks layer
            $(this).hide();
            
            //popup is not open
            wa_popupOpen = false;
            
            //popup is not loaded
            wa_popupLoaded = false;

        }
    });
    
    //make the tags clickable
    $("body").on("click", ".wa_reading_tags", function(e) {	
    	e.preventDefault();
    	
        //set current tag
        wa_currentTag = $(this).attr("id");
        
        //send the tag ID and replace the posts
        wa_replacePosts({tags:wa_currentTag});
        
        var wa_text = $(this).html();
        
        //set the current location		
        wa_currentLocation = {text: wa_text, id: wa_currentTag, type: "tag"};
        
        //send to Google
        wa_sendToGA("/tags/" + wa_text.replace(/ /g,"-") + "/");
    });
    
    //add the click event to the previous and next buttons
    $("body").on(wa_clickEventEnd, "#wa_nav_reading #wa_nav_previous_post, #wa_nav_reading #wa_nav_next_post", function() {	
        var wa_offset;
        var wa_selector;
        
        wa_isLoadingContent = true;
        
        //check whether or not you want to go back or forth
        if ($(this).attr('id') === "wa_nav_previous_post") {
            //cache selector
            wa_selector = $("#"  + wa_loadedPostID);
            
            //load post previous to it
            if (wa_loadedPostID !== wa_lastPostID) {
            	wa_loadPost(wa_selector.parent().next().children().children(".wa_posts_title").attr("class").split(" ")[1], null, wa_selector.parent().next().children().attr("class").split(" ")[1]);
            } else {
                wa_loadPostsPage(wa_currentPage, true);
            }
            
        } else {
            //cache selector
            wa_selector = $("#"  + wa_loadedPostID);
            
            //load post next to it
            wa_loadPost(wa_selector.parent().prev().children().children(".wa_posts_title").attr("class").split(" ")[1], null, wa_selector.parent().prev().children().attr("class").split(" ")[1]);
        }
    });


    //handle clicks for the categories
    $("body").on(wa_clickEventStart, "#wa_categories_popup ul li", function() {	
    	//save position
    	wa_catsPosition = $(this).position().top;
    	    	        
    }).on(wa_clickEventEnd, "#wa_categories_popup ul li", function() {
    
    	//ONLY show our post if the current element hasn't moved
    	if ( $(this).position().top === wa_catsPosition ){
    	
			wa_closePopup();
			
			//set the current category
			wa_currentCategory = $(this).attr('id').split("-")[1];
			
			//replace the posts with the category ID
			wa_replacePosts({category: wa_currentCategory});
			
			var wa_text = $(this).html();
			wa_currentLocation = {text: wa_text, id:wa_currentCategory, type: "cat"};
			
			//send to Google
			wa_sendToGA("/categories/" + wa_text.replace(/ /g,"-") + "/");
		}
		    	
    });
    
    $("nav section #wa_search_box").submit( function (e) {
        //make sure the form really isn't submitted
        e.preventDefault();
        
        //replace the posts with the search results
        var wa_sText = $("#wa_nav_search_bar").val();
        wa_replacePosts({search: wa_sText});
        
        wa_currentLocation = {text: wa_sText, type: "search"};
        
		//send to Google
		wa_sendToGA("/search/" + wa_sText.replace(/ /g,"-") + "/");
    });
    
    $("body").on(wa_clickEventEnd, "nav section #wa_search_x", function() {	
        //reset the search query
        wa_resetSearch();
    });
    
    //handle the click for the upgrade browser window of browsers
    $("body").on(wa_clickEventEnd, "#wa_upgradeBrowsersList li", function() {	
        window.open($(this).attr("href"), '_blank');
    });
    
    $("body").on(wa_clickEventEnd, "article #wa_main_post section #wa_reading_author, article #wa_main_post #wa_reading_section #wa_about_author_image", function() {	
        //replace the posts with the category ID
        var wa_authorID = $(this).attr("class").split(" ")[1];
        
        //set the current author
        wa_currentAuthor = wa_authorID;
        
        //replace posts
        wa_replacePosts({author: wa_authorID});
        
        //set the current location
        wa_currentLocation = {text: $(this).html(), id: wa_authorID, type: "author"};
    });
    
    //iframe flashes white bugfix with jquery
    //set visibility to ‘hidden’ in the actual page
    $("iframe").load(function() {
        $(this).css("visibility", "visible");
    });
    $("iframe").ready(function() {
        $(this).css("visibility", "hidden");
    });
        
    //touch handling for the breadcrumb location
    $("body").on(wa_clickEventEnd, "#wa_breadcrumb_location", function() {	

        //figure out what the type is and replae the posts with said content
        switch (wa_currentLocation.type) {
            case "author":
                wa_replacePosts({author: wa_currentLocation.id});
                break;
            
            case "tag":
                wa_replacePosts({tags: wa_currentLocation.id});
                break;
            
            case "cat":
                wa_replacePosts({category: wa_currentLocation.id});
                break;
                
            case "search":
                wa_replacePosts({search: wa_currentLocation.text});
                break;
        }
        
        //have to say the post is not loaded anymore
        wa_loadedPostID = -1;
    });
    
    //TODO: remove #wa_notification

    //add in the click handler for the continue button
    $("body").on(wa_clickEventEnd, ".tc-continue", function() {	
        //for checking for errors
        var wa_error;
        
        //check the name
        if ($("#tci_form #name").val() === "" || $("#tci_form #name").val() === wa_nameError) {
            $("#tci_form #name").addClass('wa_border_red');
            $("#tci_form #name").val(wa_nameError);
            wa_error = 1;
        } else {
            $("#tci_form #name").removeClass('wa_border_red');
        }
        
        //check email
        if ( !wa_isValidEmailAddress( $("#tci_form #email").val() ) || $("#tci_form #email").val() === wa_emailError ) {
            $("#tci_form #email").addClass('wa_border_red');
            $("#tci_form #email").val(wa_emailError);
            wa_error = 1;
        } else {
            $("#tci_form #email").removeClass('wa_border_red');
        }
        
        if ($("#wa_title span").html() === "Contact") {
            //check the message
            if ($("#tci_form #comments").val() === ""  || $("#tci_form #comments").val() === wa_messageError ) {
                $("#tci_form #comments").addClass('wa_border_red');
                $("#tci_form #comments").val(wa_messageError);
                wa_error = 1;
            } else {
                $("#tci_form #comments").removeClass('wa_border_red');
            }
        } else {
            //check the message
            if ($("#tci_form #description").val() === ""  || $("#tci_form #description").val() === wa_descriptionError ) {
                $("#tci_form #description").addClass('wa_border_red');
                $("#tci_form #description").val(wa_descriptionError);
                wa_error = 1;
            } else {
                $("#tci_form #description").removeClass('wa_border_red');
            }
            
            if ( !wa_isValidURL( $("#tci_form #source").val() )  || $("#tci_form #source").val() === wa_emailError ) {
                $("#tci_form #source").addClass('wa_border_red');
                $("#tci_form #source").val(wa_sourceError);
                wa_error = 1;
            } else {
                $("#tci_form #source").removeClass('wa_border_red');
            }
        
        }
                                                
        //don't continue if there is an error
        if (wa_error === 1) return;
        
        //fade out elements
        $("#tci_form li").hide();
                                
        //fade in recaptcha
        $("#tci_recapthca, #submit2, .tc-submit-main").show();
        
        //give it a new title
        $('#title span').html('<span>Verification</span>');
    });
    
	$("body").on("click", ".tc-submit-main", function(e) {	
        //prevent the default
        e.preventDefault();   
        
        
        //if it's on the thankyou page, close the popup
        if ($(this).html() === "Dismiss") {
            wa_closePopup();
        } else {
            //fade in the loading indicator
            wa_showLoading();
        }
			
        //send data to the script
        $.post(wa_supportScript, $("#tci_main_form").serialize() + "&tci_devLog=" + encodeURIComponent(wa_textDevLog),
            function(wa_data){
                //fade in the loading indicator
                wa_hideLoading();
                
                var wa_wrongCaptchaHeading = '<span>Verification - please try again</span>';
                
                //if it failed (1) show an error, or if it passed, thankyou page
                if(wa_data === '1' && $(this).html() !== wa_wrongCaptchaHeading){
                    //it failed
                    $('#title span').fadeTo(wa_fadingTime/2, 0, function(){ 
                    	$(this).html(wa_wrongCaptchaHeading).fadeTo(wa_fadingTime/2, 1);
                    });
                
                    //reload captcha
                    Recaptcha.reload();
                } else {
                    //go to thank you page
                    
                    //hide and fade in the content
                    $("#wa_popup_content").hide().fadeIn(2000);
                    
                    //hide recaptcha
                    $("#tci_recapthca").remove();
                    
                    //add in the thank you text
                    $('#wa_popup_content #tci_popup_desc').addClass('tci_popup_desc_thankyou').html('Thank you for contacting Tech Cores!');
                    
                    //add the thank you title
                    $('#title span').html('<span>Thank you!</span>');

                    //rename the button to dismess
                    $('.tc-submit-main').html('Dismiss');
                }
            }
        , "html");
    });

	$("body").on("click", "aside a, article .wa_featured_item", function(e) {			
	    e.preventDefault();
	
		var wa_firstClass = $(this).children(":first").attr("class").split(' ')[0];
									
	    if ( (wa_loadedPostID !== $(this).children().attr('id')) ||  wa_firstClass === "wa_featured_picture" || wa_firstClass === "wa_featured_tag" ){
	        
	        if (!wa_isMobileDevice) {
				$(this).removeClass('wa_active');
			}
	
	        //loading post
			wa_isLoadingContent = true;
			
			//scroll to top
			$("body, html").scrollTop(0);
	
	        //set up the key
	        var wa_key;
	        
	        //seo tag
	        var wa_seoTag;
	        
	        //set the post ID based on what it is
	        if (wa_firstClass !=="wa_featured_picture" && wa_firstClass !== "wa_featured_tag") {
	            wa_loadedPostID = $(this).children().attr('id');
	            wa_key =  $(this).children().attr('class').split(" ")[1];
	            wa_seoTag = $("#"  + wa_loadedPostID + " .wa_posts_title").attr("class").split(" ")[1];
	            
	            //remove all active class from the post listing
	            $("aside a").removeClass('wa_active');
	            
		        //make active post
		        wa_activePost();
	        } else {
	            wa_loadedPostID = $(this).attr('id');
	            wa_key = $(this).attr('class').split(" ")[1];					
	            wa_seoTag = $("#wa_reading_section #" + wa_loadedPostID + " .wa_featured_content").attr("id");
	        }
	        
	        wa_devLog("loading " + wa_seoTag + " with key " + wa_key);
	           
	        //do the stuff needed to show the post
	        wa_loadPost(wa_seoTag, null, wa_key);
	
	    } else if (wa_loadedPostID === $(this).children().attr('id').split(" ")[0]) {
	    
			wa_devLog("showing featured data");
	
	        //no post is loaded
	        wa_loadedPostID = null;
	        
	        //show the loading indicator
	        wa_showLoading();
	        
	        //remove active post class
	        $("aside a").removeClass('wa_active_post');
	        
	      	//refresh the scroll bar
	      	if (!wa_isMobileDevice) {
	      	    wa_refreshScroller($("#wa_reading_wrapper"), null);
	      	}
	        
	        $("#wa_reading_wrapper").fadeOut(wa_fadingTime/2, function() {
	        
	            $('article .wa_scroller section,#wa_reading_top_bar_shade').remove();
	            
	            setTimeout(function () {
	                $("article .wa_scroller").html(wa_featuredData);
	                
	                $("#wa_reading_wrapper").fadeIn(wa_fadingTime/2, function() {
	                    wa_hideLoading();
	                    
	                    //change the reading pane text
	                    wa_changeReadingText(false);
	                    
	                    //and fix up the reading bar
	                    wa_togglePostNav(false);
	                    
	                    //refresh the scroll bar
	                    if (!wa_isMobileDevice) {
	                        wa_refreshScroller($("#wa_reading_wrapper"), null);
	                    }
	                                                                
	                });	
	            }, wa_fadingTime);
	            
	        });
	        
	    }
	
	});		

    $("aside").on("mousemove", "aside a", function(){
        $(this).removeClass('wa_active');
    });

    //back and forth support
    $(window).hashchange( function(e){
    	//get the slug
    	var wa_slug = window.location.href.split("/").pop();

    	//only do it if there is not a post loading now and if there is something to go back to
   		if (!$("#wa_load").is(":visible") && !wa_isLoadingContent && wa_slug !== '' && wa_slug !== null && wa_slug.indexOf("comment-") === -1) {	   		
	   		wa_loadPost(wa_slug, null, null);
    	} else if (wa_slug.indexOf("comment-") >= 0) {
    		e.preventDefault(); // no page reload
    		window.location.hash = '!/';
    	}
    	
    	//done loading
    	//added so loading a post manually and from a back button do not run at the same time
    	wa_isLoadingContent = false;    	
    });
    
    //fade in container
    $("#wa_container").fadeIn(wa_fadingTime/2);
    
    //run code to check if IE6 or below
    wa_checkBrowser();
    
    //if it is a mobile device
    if (wa_isMobileDevice) {
    	wa_fadingTime = 0; // have NO fading
    }
    
    //Run the main startup actions
    wa_startup();
    
    
    //start fancybox
    $('.fancybox-media')
    	.attr('rel', 'media-gallery')
    	.fancybox({
    	openEffect : 'none',
    	closeEffect : 'none',
    	prevEffect : 'none',
    	nextEffect : 'none',
    	type:		'iframe',
    	
    	arrows : false,
    	helpers : {
    	media : {},
    	buttons : {}
    	}
    });
        
});	

//check if the page needs to be redirected
var wa_hash = window.location.hash;

//remove "/" at end if there in hash
if (wa_hash.substring(wa_hash.length-1) === "/") {
    wa_hash = wa_seoName.substring(0, wa_hash.length-1);
    window.location.hash = wa_hash;
}

//see if it needs a redirect
//get the name of the path
wa_seoName = window.location.pathname;

//removing ending trail if there in URL
if (wa_seoName.substring(wa_seoName.length-1) === "/") {
    wa_seoName = wa_seoName.substring(0, wa_seoName.length-1);
}

//get names
var wa_seoArray = wa_seoName.split("/");

//select last one
wa_seoName = wa_seoArray[wa_seoArray.length-1];

//redirect if it can and previewing post is not on
if (wa_seoName !== "" && wa_seoName !== "#" && window.location.hash === "" && window.location.href.indexOf("?preview=true&preview_id") === -1 ) {
	window.location.href = "http://" + window.location.host + "/#!/" + wa_seoName;
}