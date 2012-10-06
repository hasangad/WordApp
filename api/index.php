<?php
function sanitize_output($buffer){
    $search = array(
        '/\>[^\S ]+/s', //strip whitespaces after tags, except space
        '/[^\S ]+\</s', //strip whitespaces before tags, except space
        '/(\s)+/s',     // shorten multiple whitespace sequences
        '/<!--(.*)-->/Uis'  //remove HTML comments
        );
    $replace = array(
        '>',
        '<',
        '\\1'
        );
    $buffer = preg_replace($search, $replace, $buffer);

    return $buffer;
}

ob_start("sanitize_output");

// Do not load directly
if(empty($_GET) && $_SERVER["PHP_SELF"] != "/index.php"){
	die ('Please do not load the Tech Cores API directly. Thanks!');
}


/**
Author      : Taylor Jasko
Date        : August 12, 2011 5:17:22 PM EDT
Last Edited : August 12, 2011 5:47:57 PM EDT
Revision    : 1 (released version)
Description : A script written to grab data dynamically from the WordPress API, stylize
              them, and return the contents via the AJAX JavaScript function.
**/

//if ($_SERVER["PHP_SELF"] != "/index.php"){
	ob_start();
//}

//amount of posts per page
$POSTS_PER_PAGE = 14;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Max-Age: 3628800');
header('Access-Control-Allow-Methods: GET, POST');

//let's include the WordPress API
include('../../../../wp-load.php');

//include functions
include('functions.php');

		
//set the type of request
$type = $_GET['type'];

//set up the arguments for gathering the posts
$posts_args = array(
	'numberposts'     => $POSTS_PER_PAGE,           //fourteen posts of course!
	'orderby'         => 'post_date',  //organize the posts based upon their date
	'order'           => 'DESC',       //have the order of the posts descending for the list
	'post_type'       => 'post',       //has to be a post! not a page. :P
	'post_status'     => 'publish' );  //make sure the post is published

if ($type === "key") {
	// get the posts
	$posts = get_posts($posts_args);
	
	//the data array
	$data = null;
	
	//initialize the key
	$key = "";
	
	//generate the key by looping through the posts
	foreach( $posts as $post )  {
		$key .= $post->post_modified;
	}
	
	//add the key of the posts
	$data["posts"] = encrypt_key($key);
	
	
	//get the slug of the post
	$requested_slug = $_GET['slug'];
	
	//set the post to something
	$post = null;
	
	//key of the post - if there is one
	$key_post = null;
	
	//test to see if there is a slug or not
	if ($requested_slug != "" && $requested_slug != "!" && $requested_slug != null) {
		//has a slug - load post from slug
		$args=array(
		  'name' => $requested_slug,
		  'post_type' => 'post',
		  'post_status' => 'publish',
		  'showposts' => 1,
		  'caller_get_posts'=> 1
		);
		
		//get the post based on arguements
		$post = get_posts($args);
		
		//strip the data out of the array
		$post = $post[0];
		
		$key_post = $post->post_modified;
	}
	
	//add the key of the single post
	if ($key_post != null) {
		$data["post"] = encrypt_key($key_post);
	} else {
		$data["post"] = "";
	}
	
	//output the JSON data
	echo json_encode($data);
	
	//no need to run more code
	exit(0);
	
}

//for gathering the posts
if ($type === "posts") {
		
	//grab the category
	$category = $_GET['category'];

	//grab the tags
	$tags = $_GET['tags'];

	//grab the page
	$page = $_GET['paged'];

	//grab the search word
	$search = $_GET['search'];

	//grab the author
	$author = $_GET['author'];
			
	//set the category in the arguments array if it's there
	if ($category != NULL || $category != "") $posts_args['category'] = $category;
	
	//set the tags in the arguments array if it's there
	if ($tags != NULL || $tags != "") $posts_args['tag_id'] = $tags;

	//set the tags in the arguments array if it's there
	if ($search != NULL || $search != "") $posts_args['s'] = $search;

	//set the tags in the arguments array if it's there
	if ($author != NULL || $author != "") $posts_args['author'] = $author;
		
	//get the first and last post IDs
	//variable for the first and last post
	$firstPost = 0;
	$lastPost = 0;
	
	//only one post
	$posts_args_other['numberposts'] = 1;
	
	//get oldest post
	$posts_args_other['order'] = 'DSC';
	$firstPost = get_posts(array_merge($posts_args, $posts_args_other));
	$firstPost = $firstPost[0]->ID;
	
	//get newest post
	$posts_args_other['order'] = 'ASC';
	$lastPost = get_posts(array_merge($posts_args, $posts_args_other));
	$lastPost = $lastPost[0]->ID;
	
	//release it
	$posts_args_other = null;
	
	//set the offset if one is there
	if ($page != NULL || $page != "") $posts_args['offset'] = $page * $POSTS_PER_PAGE;
	
	//gather the posts
	$posts = get_posts($posts_args);
	$posts_count = count($posts);	
	
	$content = '';
			
	//set counter
	$counter = 0;
	
	//start of the WordPress loop
	foreach( $posts as $post ) {
	
		setup_postdata($post);
				
//		$time = "";
//		if ( floor( (time()-get_the_time('U')) / 3600) < 24.0) {
			//show hours
//			$time = human_time_diff( get_the_time('U'), current_time('timestamp') ) . ' ago';
//		} else {
			//show normal data
			$time = get_the_time('M jS, Y') . ' ' . get_the_time('g:ia');
//		}
		
		$image = grabImage(get_the_content(),$post->ID, "post");
				
		//set array
		$dataArray[$counter]["url"] = '/' . $post->post_name;
		$dataArray[$counter]["isFirst"] = $first;
		$dataArray[$counter]["key"] = encrypt_key($post->post_modified);
		$dataArray[$counter]["id"] = $post->ID;
		$dataArray[$counter]["image"] =  $image;
		$dataArray[$counter]["seoName"] = $post->post_name;
		$dataArray[$counter]["name"] = get_the_title();
		$dataArray[$counter]["content"] = neat_trim(str_replace('&nbsp;',"",get_the_excerpt()), 270, "...");
		$dataArray[$counter]["author"] = get_the_author();
		$dataArray[$counter]["time"] = $time;		
		
		//add counter
		$counter++;		
	} 
	
	if ($posts_count >= 1) {
		//add in the first and last post info
		$dataArray[$counter]["range"] = $firstPost . "-" . $lastPost;
	} else {
		//$content .= 'nosearchresults';	
		$dataArray[$counter]["range"] = 'nosearchresults';
	}
	
		
	echo json_encode($dataArray);

//end posts query
} else if ($type === "page") { //if it's a page, do this

	//set the page that wants to be returned
	$requested_page = $_GET['page'];
	
	//let's grab that page
	$page_data = get_page_by_title($requested_page);
	
	//set the content
	$content = $page_data->post_content;
	
	//now let's get the page content via it's content class
	//apply the "the_content" filter so it's treated the same way
	$content = apply_filters('the_content', $content);
	
	//if it's the polls, apply the polls selector to it
	if ($requested_page == "Polls") $extra_selector = tc_polls;
	
	//set array
	$dataArray["title"] = $requested_page;
	$dataArray["selector"] = $extra_selector;
	$dataArray["content"] = $content;
	
	echo json_encode($dataArray);

} else if ($type === "categories") { //it'll be the categories content
	//get all the categories
	$categories = get_categories('exclude='.get_category_by_slug('featured')->term_id . ',' . get_category_by_slug('breaking')->term_id . '&echo=0&show_count=0&title_li=&use_desc_for_title=1');
	
	foreach ($categories as $category) {
		$main_categories .= '<li id="cat-' . $category->cat_ID . '">' . $category->cat_name . '</li>' . "\n";
	}
	
	//set array
	$dataArray["content"] = $main_categories;
	
	echo json_encode($dataArray);

} else if ($type === "about") { //it'll be the about content
	
	//set the page that wants to be returned
	$requested_page = "About";
	
	//let's grab that page
	$page_data = get_page_by_title($requested_page);
	
	//set the content
	$contentPage = $page_data->post_content;
	
	//now let's get the page content via it's content class
	//apply the "the_content" filter so it's treated the same way
	$contentPage = apply_filters('the_content', $contentPage);

	//set the page that wants to be returned
	$requested_page = "About Authors";
	
	//let's grab that page
	$page_data = get_page_by_title($requested_page);
	
	//set the content
	$contentAuthors = $page_data->post_content;
	
	//now let's get the page content via it's content class
	//apply the "the_content" filter so it's treated the same way
	$contentAuthors = apply_filters('the_content', $contentAuthors);
				
	//remove first five lines
	$contentAuthors = preg_replace('!/\*.*?\*/!s', "", $contentAuthors);
	
	//set array
	$dataArray["content"] = $contentPage;
	$dataArray["people"] = $contentAuthors;
	
	echo json_encode($dataArray);
	
} else if ($type === "post") { 
	//get the id of the post
	$requested_id = $_GET['id'];
	
	//get the slug of the post
	$requested_slug = $_GET['slug'];
	
	//set the offset of the post
	$offset = $_GET['offset'];
	
	//grab the sent category
	$category = $_GET['category'];
		
	//show the post
	showPost($requested_id,$requested_slug,$offset,$category,  "ajax");
	
} else if ($type === "featured") { //it'll be the featured content 

	//get the theme options
	$theme_options = get_option('tcv3_theme_options');
	
	//array of IDs to exclude
	$excludedIDs = array();
	
	//for tag
	$tagName = "";
	
	//lopp it through three times to gather the data
	for ( $counter = 0; $counter < 3; $counter++) {

		switch ($counter) {
			case 0:
				$option_tag = "featured1_tag";
				$option_cat = "featured1_cat";
				break;
			case 1:
				$option_tag = "featured2_tag";
				$option_cat = "featured2_cat";
				break;
			case 2:
				$option_tag = "featured3_tag";
				$option_cat = "featured3_cat";
				break;
		}
		//get the tag
		$featured_tags = $theme_options[$option_tag];
	
		//get the category
		$featured_cat = $theme_options[$option_cat];
		

		//get ids to exclude
		$idsToExclude = implode(',', $excludedIDs);
		
		//let the tags over-ride the categories
		//also, set the posts
		if ($featured_tags != NULL || $featured_tags != "") {
			$posts = get_posts('category_name=featured&tag=' . $featured_tags . '&numberposts=2&exclude=' . $idsToExclude);
		} else {
			$posts = get_posts('category_name=featured&category=' . $featured_cat . '&numberposts=2&exclude=' . $idsToExclude);
		}
		
		//set up the counter
		$counter2 = 0;
		
		//let's output all the content
		foreach( $posts as $post ) {
			
			setup_postdata($post);

			//add to IDs to exclude
			array_push($excludedIDs, $post->ID);
			
			//set up whether which side it's on
			switch ($counter2) {
				case 0:
					$side = "left";
					break;
				case 1:
					$side = "right";
					break;
			}
			
			//check if there needs to be tags
			if (in_category("breaking")) {
				//echo '<!--Any tags it may have--><div class="' . tc_featured_tag . ' ' .tc_featured_breaking . '">Breaking</div>';
				$tagName = "Breaking";						
			} else if (in_category("exclusive")) {
				//echo '<!--Any tags it may have--><div class="' . tc_featured_tag . ' ' . tc_featured_exclusive  . '">Exclusive</div>';
				$tagName = "Exclusive";					
			} else if (in_category("exclusive") && in_category("featured")) {
				//echo '<!--Any tags it may have--><div class="' . tc_featured_tag . ' ' . tc_featured_exclusive . '">Exclusive</div>';
				$tagName = "Exclusive";					
			}
				
			$image = grabImage(get_the_content(),$post->ID, "featured");
				
			$dataArray[$counter]["post" . $counter2]["side"]	 	= $side;
			$dataArray[$counter]["post" . $counter2]["key"] 		= encrypt_key($post->post_modified);
			$dataArray[$counter]["post" . $counter2]["id"] 		= $post->ID;
			$dataArray[$counter]["post" . $counter2]["tagName"] 	= $tagName;
			$dataArray[$counter]["post" . $counter2]["image"] 	= $image;
			$dataArray[$counter]["post" . $counter2]["name"] 	= $post->post_name;
			$dataArray[$counter]["post" . $counter2]["title"] 	= neat_trim(get_the_title(), 40, "...");

			//add to the counter
			$counter2++;
			
			$tagName = "";
			
		 }
				
		$dataArray[$counter]["catName"] = get_cat_name($featured_cat);
	}
	
	echo json_encode($dataArray);

}


?>