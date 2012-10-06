<!doctype html>

<html lang="en">

<JasobNoObfs>

<!--
   ____      _ __        __            _    _                                    
  / ___| ___| |\ \      / /__  _ __ __| |  / \   _ __  _ __   ___ ___  _ __ ___  
 | |  _ / _ \ __\ \ /\ / / _ \| '__/ _` | / _ \ | '_ \| '_ \ / __/ _ \| '_ ` _ \ 
 | |_| |  __/ |_ \ V  V / (_) | | | (_| |/ ___ \| |_) | |_) | (_| (_) | | | | | |
  \____|\___|\__| \_/\_/ \___/|_|  \__,_/_/   \_\ .__/| .__(_)___\___/|_| |_| |_|
                                                |_|   |_|                                                            
- Handcrafted & Engineered by Taylor Jasko
-->

</JasobNoObfs>

<head>
	<!-- Set meta data -->
	<meta charset="UTF-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	
	<!-- Title of page -->
	<title>
		<?php 
		if (is_home ()) { 
			echo get_bloginfo('name').' - '.get_bloginfo('description'); 
		} else {
			echo get_bloginfo('name');
			wp_title('-', true, 'left');
		}
		?>
	</title>
	
	<!-- Favicon -->	
	<link rel="shortcut icon" href="/wp-content/themes/wordapp/favicon.ico" />

	<!--The Viewport for iDevices-->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	
	<!--Kill IE6's pop-up-on-mouseover toolbar for images that can interfere with certain designs and be distracting-->
	<meta http-equiv="imagetoolbar" content="false" />
	
	<!--Make it a web app-->	
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta names="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	
	<!--The main stylesheet-->
	<!-- ADD CDN FOR IN PRODUCTION -->
	<link rel="stylesheet" href="/wp-content/themes/wordapp/style.css">
			
	<!--The stylesheet for IE8 and below-->
	<!--[if lte IE 8]>
		<link rel="stylesheet" href="/wp-content/themes/wordapp/css/ie_style.css">
	<![endif]-->

	<!--The stylesheet for IE9 and below-->
	<!--[if lte IE 9]>
		<link rel="stylesheet" href="/wp-content/themes/wordapp/css/ie_general_style.css">
	<![endif]-->
		
	<!--Put all JS to the footer for speed BUT HTML5 shim-->
	<!--HTML5 Shim-->
	<!--[if lt IE 9]>
		<script src="//html5shim.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
		
	<?php
		//jQuery FTW!>
		wp_deregister_script('jquery');
		
		//set new jQuery path
		wp_register_script('jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js', '1.7', 1);
		
		//queue it up
		wp_enqueue_script('jquery', $in_footer = true);
		 	
		//echo the WordPress header
		wp_head();	
	?>
		
</head>
<body>	

	<!--The shade across the screen for the pop-ups-->
	<div id="wa_shade" class="wa_entireContainer"></div>
	
	<!--disable clicks-->
	<div id="wa_disableClicks" class="wa_entireContainer"></div>
			
	<!--The fading for the pop-ups-->
	<div id="wa_fading" class="wa_entireContainer"></div>
			
	<!--The main container-->	
	<div id="wa_container">
		
		<!--The header-->
		<header class="wa_min_width">
			<!--Logo-->
			<div id="wa_logo"><?php echo get_bloginfo('name'); ?></div>
		</header>
	
		<!--The below header bar-->
		<nav class="wa_allow_text_selection">
			<!--Search section-->
			<section id="wa_nav_search">
				<div id="wa_nav_search_icon" class="wa_retina"></div>
				<div id="wa_search_x" class="wa_retina"></div>

				<form id="wa_search_box">
					<input class="wa_allow_text_selection" alt="Search" type="text" name="s" id="wa_nav_search_bar" value="Search..." onblur="if(this.value==''){ this.value='Search...'; $('#wa_search_x').hide();}" onfocus="if(this.value=='Search...')this.value=''; $('#wa_search_x').show(); "/>
					<input type="submit" id="wa_search_button" />
				</form>
			</section>
			
			<!--Posts section-->
			<section id="wa_nav_posts"><span>Posts</span></section>
			
			<!--Reading section-->
			<section id="wa_nav_reading">
				
				<!--Previous Post Button-->
				<div id="wa_nav_previous_post" class="wa_retina"></div>
				
				<!--Next Post Button-->
				<div id="wa_nav_next_post" class="wa_retina"></div>
				
				<span>Featured</span>
							
			</section>
			
		</nav>
		
		<!--The sidebar/navbar-->
		<div id="wa_sidebar">
		
			<!--Home--> 
			<div class="wa_sidebar_element" id="wa_sidebar_home_item"><span class="wa_sidebar_arrow wa_retina"></span><span id="wa_sidebar_home" class="wa_retina"></span><span class="wa_sidebar_text">Home</span></div>
			
			<!--Mobile-->
			<div class="wa_sidebar_element <?php echo get_cat_ID('Mobile'); ?>)" id="wa_sidebar_mobile_item"><span class="wa_sidebar_arrow wa_retina"></span><span id="wa_sidebar_mobile" class="wa_retina"></span><span class="wa_sidebar_text">Mobile</span></div>
			
			<!--Gap-->
			<div class="wa_sidebar_gap"></div>
			
			<!--Categories-->
			<div class="wa_sidebar_element" id="wa_sidebar_categories_item"><span class="wa_sidebar_arrow wa_retina"></span><span id="wa_sidebar_categories" class="wa_retina"></span><span class="wa_sidebar_text">Categories</span></div>
			
			<!--Gap-->
			<div class="wa_sidebar_gap"></div>
			
			<!--Contact-->
			<div class="wa_sidebar_element" id="wa_sidebar_contact_item"><span class="wa_sidebar_arrow wa_retina"></span><span id="wa_sidebar_contact" class="wa_retina"></span><span class="wa_sidebar_text">Contact</span></div>
			
			<!--About-->
			<div class="wa_sidebar_element" id="wa_sidebar_about_item"><span class="wa_sidebar_arrow wa_retina"></span><span id="wa_sidebar_about" class="wa_retina"></span><span class="wa_sidebar_text">About</span></div>
			
			<!--Gap-->
			<div class="wa_sidebar_gap"></div>
			
			<!--Gap-->
			<div class="wa_sidebar_gap"></div>

			<!--Bottom text of the sidebar-->
			<div id="wa_sidebar_bottom">				
				<!--Copyright section-->
				<div id="wa_sidebar_copyright">
					&copy; <?php echo date("Y"); ?> <span><?php echo get_bloginfo('name'); ?></span>
				</div>
				
			</div>
		</div>
		
		<!--The posts section-->
		<aside id="wa_posts_wrapper">
			<div class="wa_scroller">
				<!--POSTS GO HERE-->
				<div id="wa_posts_listing"></div>
			
				<!--Load posts button-->
				<div id="wa_loadPosts_container">
					<div id="wa_loadPosts_button">
						Load More Posts...
					</div>
				</div>
			
			</div>
		</aside>
				
		<!--Breadcrumb-->
		<ul id="wa_breadcrumb">
			<li><div><span id="wa_breadcrumb_home" class="wa_retina"></span></div></li>
			<li id="wa_breadcrumb_location"><div></div></li>
			<li id="wa_breadcrumb_post"></li>
		</ul>
	</div>
	
	<section id="wa_right">
		<!--The posts and featured section-->
		<article id="wa_reading_wrapper" class="<?php if (is_single()) echo "wa_isSingle"; ?>">
			<div class="wa_scroller">
				<?php 
				//if there is a single post, let it show
				if (is_single() && have_posts()) {
					require_once("api/functions.php");
					echo showPost(get_the_id(),null,null,null, "single");
					
					echo get_the_id();
				}						
				?>					
			</div>
		</article>					
	</section>

	<div class="wa_clearfix"></div>
		
	<!--[if lt IE 7 ]>
	<script src="js/libs/dd_belatedpng.js"></script>
	<script> DD_belatedPNG.fix('img, .png_bg');</script>
	<![endif]-->
		
	<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you want to support IE 6.
	     chromium.org/developers/how-tos/chrome-frame-getting-started -->
	<!--[if lt IE 7 ]>
	  <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
	  <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
	<![endif]-->
	
	<?php
	//echo the WordPress footer
	wp_footer();
	?>
				
		<!-- Scroll Bar-->
		<script src="/wp-content/themes/wordapp/js/plugins/scroll.js" type="text/javascript"></script>
	
		<!--Wait for images jQuery plugin-->
		<script src="/wp-content/themes/wordapp/js/plugins/jquery.waitforimages.js" type="text/javascript"></script>
		
		<!--The main JavaScript file-->
		<!-- ADD CDN FOR IN PRODUCTION -->
		<script src="/wp-content/themes/wordapp/js/main.js" type="text/javascript"></script>		
		
		<!--The hashchange jQuery plugin-->
		<script src="/wp-content/themes/wordapp/js/plugins/jquery.ba-hashchange.min.js" type="text/javascript"></script>	

		<!--The template jQuery plugin-->
		<script src="/wp-content/themes/wordapp/js/plugins/jquery.jquote2.min.js" type="text/javascript"></script>	
			
		<!--Add in FancyBox-->
		<link rel="stylesheet" href="/wp-content/themes/wordapp/js/plugins/fancybox/jquery.fancybox.css" type="text/css" media="screen" />
		<script type="text/javascript" src="/wp-content/themes/wordapp/js/plugins/fancybox/jquery.fancybox.pack.js"></script>
		<script type="text/javascript" src="/wp-content/themes/wordapp/js/plugins/fancybox/helpers/jquery.fancybox-media.js"></script>
						
		<!-- Post listing template -->
		<script type="text/html" id="wa_template_posts">
		<![CDATA[
		<a href="<%= this.url %>" onclick="return false;">
			<div class="wa_posts_content <%= this.key %>" id="<%= this.id %>">
				<!--Post image-->
				<% if ( this.image !== null ) { %>
					<div class="wa_posts_image_main"><img class="wa_posts_image" src="<%= this.image %>" /></div>
				<% } %>
						
				<!--Post title-->
				<div class="wa_posts_title <%= this.seoName %>"><%= this.name %></div>
				
				<!--Post description-->
				<span class="wa_posts_desc"><%= this.content %></span>
	
				<!--Clear fix-->
				<div class="wa_clearfix"></div>
	
				<!--Post info-->
				<div class="wa_posts_info">
					<div class="wa_posts_author wa_retina"></div><span><%= this.author %></span>
					
					<div class="wa_posts_date wa_retina"></div><span><%= this.time %></span>
					
					<div class="wa_posts_categories wa_retina"></div><span><%= this.categories %></span>
				</div>
			</div>
		</a>
		]]>
		</script>

		<!-- Page template -->
		<script type="text/html" id="wa_template_page">
		<![CDATA[
			<div id="wa_popup" class="wa_popup_window wa_main_popup <%= this.selector %>">
				<!--X btn-->
				<div id="wa_popup_x" class="wa_retina"></div>
				
				<!--The title-->
				<div id="wa_title">
					<!--Server-side title-->
					<span><%= this.title %></span>
				</div>
				
				<!--Server-side content-->
				<div id="wa_popup_wrapper">
				<div class="wa_scroller">
					<div id="wa_popup_content"><%= this.content %></div>
				</div>
			</div>
		]]>
		</script>

		<!-- Featured template -->
		<script type="text/html" id="wa_template_featured">
		<![CDATA[
			<!--The featured items category-->
			<div class="wa_heading"><%= this.catName %></div>
			
			<!--Yeah, cheap, but it is the line below it!-->
			<div class="wa_heading_line"></div>
			
			<!-- the posts -->
			<%= this.posts %>
		]]>
		</script>

		<!-- Featured post template -->
		<script type="text/html" id="wa_template_featured_post">
		<![CDATA[
			<div class="wa_featured_item <%= this.key %> align<%= this.side %>" id="<%= this.id %>">
				<!--Any tags it may have-->
				<% if (this.tagName === "Breaking") { %>
					<div class="wa_featured_tag wa_featured_breaking"><%= this.tagName %></div>
				<% } else if (this.tagName === "Exclusive") { %>
					<div class="wa_featured_tag wa_featured_exclusive"><%= this.tagName %></div>
				<% } %>
				
				<!--The featured picture-->
				<div class="wa_featured_picture" style="background-image:url(<%= this.image %>);"></div>
				
				<!--The featured below content-->
				<div class="wa_featured_content" id="<%= this.name %>"><%= this.title %></div>
			</div>			
		]]>
		</script>

		<!-- Categories template -->
		<script type="text/html" id="wa_template_categories">
		<![CDATA[
			<!--The categories-->
			<div class="wa_popup_window wa_main_popup" id="wa_categories_main">
				<!--The left arrow-->
				<div id="wa_categories_popup-arrow-border"></div>
				<div id="wa_categories_popup-arrow"></div>
				<div id="wa_categories_popup">
					<div id="wa_categories_wrapper">
						<div class="wa_scroller">
							<!--The main categories-->
							<ul>
								<%= this.content %>
							</ul>
						</div>
					</div>
				</div>
			</div>
		]]>
		</script>

		<!-- About template -->
		<script type="text/html" id="wa_template_about">
		<![CDATA[
			<!--About Page-->
			<div id="wa_popup" class="wa_popup_window wa_main_popup">
				<!--X btn-->
				<div id="wa_popup_x" class="wa_retina"></div>
				
				<!--The title-->
				<div id="wa_title">
					<span>About</span>
				</div>
			
				<!--Server-side content-->
				<div id="wa_popup_wrapper">
					<div class="wa_scroller">
						<div id="wa_popup_content">
							<div id="wa_about_grey_logo" class="wa_aligncenter wa_retina"></div>
		
							<%= this.content %>
			
							<!--list of people-->
							<div id="wa_about_people">
								<%= this.people %>
							</div>
						</div>
					</div>
				</div>
			</div>
		]]>
		</script>
		
		<!-- Single post template -->
		<script type="text/html" id="wa_template_article">
		<![CDATA[
		<div id="wa_main_post" class="<%= this.id %>">
				<!--Top bar section-->
				<section>
					<div id="wa_reading_top_padding">
						
						<!--The author image-->
						<div id="wa_reading_author" class="<%= this.authorID %>" style="background-image:url(<%= this.authorImage %>?s=285.jpg)"></div>
					
						<!--The title of the blog post-->
						<a href="<%= this.link %>" id="wa_reading_title" class="<%= this.name %>"><%= this.title %></a>
						
						<!--Post date-->
						<span id="<%= this.date %>" class="wa_post_date" style="display:none;"></span>
						
						<!--Put some spacing below the title and the tags-->
						<div class="wa_break"></div>
						
						<!--The tags-->
						<% if ( this.tags.length > 0 ) { %>
							<div><span id="wa_readings_tags_label">Tags:</span>
							<% for (var i = 0; i < this.tags.length; i++) { %>
							    <a href="#" class="wa_reading_tags" id="<%=this.tags[i].id%>"><%=this.tags[i].name%></a>
							<% } %>
							</div>
						<% } %>
						
						<!--Clear fix-->
						<div class="wa_clearfix"></div>
					
					</div>
				</section>
												
				<!--The main reading content-->
				<div id="wa_reading_section">
					<div id="wa_reading_content" class="wa_allow_text_selection">
						<%= this.content %>			
					</div>		
					
					<!--Add in a clear fix for the floats!-->
					<div class="wa_clearfix" id="wa_posts_spacing"></div>		
					
					<!--About the author-->
					<div id="wa_about_author">
						<div id="wa_about_author_padding">
							<!--Author heading-->
							<div id="wa_about_author_title">About <%= this.authorName %></div>
							
							<!--The author image-->
							<div id="wa_about_author_image" class="wa_alignleft <%= this.authorID %>" style="background-image:url(<%= this.authorImage %>?s=417.jpg)"></div>
							
							<div id="wa_about_author_text">
								<%= this.authorText %>
							</div>
							
							<!--Add in a clear fix for the floats!-->
							<div class="wa_clearfix"></div>		
				
						</div>
					</div>

					<!--Commenting-->
					<div id="wa_commenting">
						<div class="wa_heading wa_heading_darker">Discussion</div>
			
						<!--Yeah, cheap, but it is the line below it!-->
						<div class="wa_heading_line"></div>
						
						<!-- Disqus Commenting System -->
						<div id="disqus_thread"></div>
						<a href="http://disqus.com" class="dsq-brlink">comments powered by <span class="logo-disqus">Disqus</span></a>
		
					</div>
				</div>
			</div>
		]]>
		</script>

	
</body>
</html>
