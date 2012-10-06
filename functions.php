<?php

//JASOB OBFUSCATION CONSTANTS
//<JasobNamesBag/>

//adding menu support for mobile
add_theme_support( 'menus' );

//function to add a [raw][/raw] formatter to let WordPress to not edit the content
function my_formatter($content) {
	$new_content = '';
	$pattern_full = '{(\[raw\].*?\[/raw\])}is';
	$pattern_contents = '{\[raw\](.*?)\[/raw\]}is';
	$pieces = preg_split($pattern_full, $content, -1, PREG_SPLIT_DELIM_CAPTURE);
	
	foreach ($pieces as $piece) {
		if (preg_match($pattern_contents, $piece, $matches)) {
			$new_content .= $matches[1];
		} else {
			$new_content .= wptexturize(wpautop($piece));
		}
	}

	return $new_content;
}
remove_filter('the_content', 'wpautop');
remove_filter('the_content', 'wptexturize');
add_filter('the_content', 'my_formatter', 99);


//function to add OEmbed to Tech Cores
add_filter( 'oembed_result', 'slt_wmode_opaque', 10, 3 );
function slt_wmode_opaque( $html, $url, $args ) {
	if ( strpos( $html, '<param name="movie"' ) !== false )
		$html = preg_replace( '|</param>|', '</param><param name="wmode" value="opaque"></param>', $html, 1 );
	if ( strpos( $html, '<embed' ) !== false )
		$html = str_replace( '<embed', '<embed wmode="opaque"', $html );
	return $html;
}
function new_excerpt_length($length) {
	return 145;
}
add_filter('excerpt_length', 'new_excerpt_length');



//function to rewrite the more string of the excerpt
function new_excerpt_more($more) {
	return '';
}
add_filter('excerpt_more', 'new_excerpt_more');



//function to handle trimming a string in a neat fashion
function neat_trim($string, $max_length, $ending){
	if (strlen($string) > $max_length){
		$string = substr($string, 0, $max_length);
		$pos = strrpos($string, " ");
		if($pos === false) {
				return removeExtras(substr($string, 0, $max_length)).$ending;
		}
			return removeExtras(substr($string, 0, $pos)).$ending;
	}else{
		return removeExtras($string);
	}
	
}


//function to check if the last char is an extra
function removeExtras($str) {
	$lastChar = substr($str, -1);
	
	if ($lastChar === "," || $lastChar === ":" || $lastChar === "|" || $lastChar === " ") $str = substr_replace($str ,"",-1);
	
	return $str;
}

//fuction to exlcude categories from the listing
function the_excluded_category($excludedcats = array()){
	$count = 0;
	$categories = get_the_category();
	
	$content = '';
	
	foreach($categories as $category) {
		$count++;
		if ( !in_array($category->category_nicename, $excludedcats) ) {
		//			echo '<a href="' . get_category_link( $category->term_id ) . '" title="' . sprintf( __( "View all posts filed under %s" ), $category->name ) . '" ' . '>' . $category->name.'</a>';

			$content .= $category->name;

			if( $count != count($categories) ){
				$content .= ", ";
			}

		}
	}
	
	return $content;
}


//function to allow contributors to upload
function allow_contributor_uploads() {
	$contributor = get_role('contributor');
	$contributor->add_cap('upload_files');
}
if ( current_user_can('contributor') && !current_user_can('upload_files') )
	add_action('admin_init', 'allow_contributor_uploads');




//function to grab the thumbnail of a post using TimThumb
function grabImage($content,$id,$type) {
	$custom_field_image = "";
	$mainblogdir = get_bloginfo('stylesheet_directory');
	$path2 = "http://cdn.techcores.com/wp-content/themes/techcores_v2";
	
	if ($type == "post") {
		//post item
		$imgsize_x = 90;
		$imgsize_y = 90;
		$custom_field_image = get_post_meta($id, 'Replace Main Image', true);
	} else {
		//featured item
		$imgsize_x = 280;
		$imgsize_y = 123;
		$custom_field_image = get_post_meta($id, 'Replace Featured Image', true);
	}
	
	if ( $custom_field_image != "" || $custom_field_image != NULL ) {
		$imgsrc = $path2 . "/images/thumbnail.php?w=" . $imgsize_x . '&amp;h=' . $imgsize_y . "&amp;zc=1&amp;src=". $custom_field_image;
	} else {
	
		// get the first image out of content, prevent double image display
		$path = ""; // teaser image path
		
		// grab fist image (teaser thumb) by pattern
		$frst_image = preg_match_all( '|<img.*?src=[\'"](.*?)[\'"].*?>|i', $content, $matches );
		
		// any image there?
		if( $frst_image > 0 ) {
			$path = $matches[ 1 ][ 0 ]; // we need the first one only!
			// replace with empty string in order to avoid duplicates
			$content = preg_replace( '|<img.*?src=[\'"](' . $path . ')[\'"].*?>|i', '', $content );
		}
		
		$search_word = "techcores.com";
		
		if(strstr($path,$search_word) == false) {
			$path = false;
		}
		
		//stip any occurance of CDN
		$path = str_replace("cdn.","", $path);
		
		if ($path){
			//$path2 = str_replace('techcores.com', 'cdn.techcores.com', $mainblogdir);
		
			$imgsrc = $path2 . '/images/thumbnail.php?w=' . $imgsize_x . '&amp;h=' . $imgsize_y . '&amp;zc=1&amp;src=' .  $path;
			
		} else {
			return null;
		}
	}
	
	return $imgsrc;
}


?>
