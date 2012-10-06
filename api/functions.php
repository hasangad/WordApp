<?php

function encrypt_key($key) {
	//replace all non-numbers with nothing
	$key = ereg_replace("[^0-9]", "", $key);
	
	//MD5 hash it to make it shorter... 
	$key = md5($key);
	
	//return the value
	return $key;
}

function showPost($requested_id,$requested_slug,$offset,$category, $target) {
	
		//set the post to something
		global $post;
		
		//declare post
		$post = null;
		
		//test to see if there is a slug or not
		if ($requested_slug != "" && $requested_slug && "!" && $requested_slug != null) {
			//has a slug - load post from slug
			$args=array(
			  'name' => $requested_slug,
			  'post_type' => 'post',
			  'post_status' => 'publish',
			  'showposts' => 1,
			);
			
			//get the post based on arguements
			$post = get_posts($args);
			
			//strip the data out of the array
			$post = $post[0];
		} else {
			//has an ID - load directly
			$args=array(
			  'showposts' => 1
			);
			
			if (is_preview()) {
				$args["include"] = (int) $requested_id;
				$args["post_type"] = 'any';
				$args["post_status"] = 'any';
			} else {
				$args["p"] = $requested_id;
				$args["post_type"] = 'post';
				$args["post_status"] = 'publish';
			}
			
			//get the post based on arguements
			$post = query_posts($args);
			
			//strip the data out of the array
			$post = $post[0];
		}
		
		if ($offset != "" && $offset != NULL) {
			//get the boolean
			if ($offset == "-1") {
				$offset = true;
			} else {
				$offset = false;
			}
	
			//grab the categories to exclude
			if ($category != NULL && $category != "" && $category != "-1") {
				$categories = get_categories('exclude=' . $category ); 
				$cats = "";
		
				foreach ($categories as $category) {
					$cats .= $category->cat_ID . ',';
				}
				
				//cut off last comma
				$cats = substr($cats,0,-1);
				
				$categoryOn = true;
			} else {
				$cats = "";
				$categoryOn = false;
			}
			
			//set the post
			$post = get_adjacent_post($categoryOn, $cats, $offset);
						
		}
			
	//set the new post ID
	$requested_id =  $post->ID;
	
	//set the gravatar IMAGE
	$gravatarImage = "http://www.gravatar.com/avatar/" . md5(get_the_author_meta('user_email',$post->post_author));
	
	//tags
	$posttags = get_the_tags($requested_id);	
	$tags = "";
	
	if ($posttags) {
		$counter = 0;
		foreach($posttags as $tag) {
			if ($counter <= 4) {
				$tags[$counter]['name'] = $tag->name;
				$tags[$counter]['id'] = $tag->term_id;
			}
			$counter++;
		 }
	}
	
	if (!empty($posttags) && $target == "single") $tags .= '</div>';
	
	
	$content = apply_filters('the_content', $post->post_content);
	$content = str_replace("techcores.com/wp-content/uploads", "cdn.techcores.5tatic.com/wp-content/uploads", $content);
	$content = str_replace(']]>', ']]>', $content); 


	$custom_field_src = trim(get_post_meta($post->ID, 'Source Name(s)', true));
	$custom_field_src_url = trim(get_post_meta($post->ID, 'Source URL(s)', true));

	$array_src = explode(',', $custom_field_src);
	$array_src_url = explode(',', $custom_field_src_url);
	
	$mainblogdir = get_bloginfo('stylesheet_directory');
	
	$sources = "";
	
	if ( ($custom_field_src != "" || $custom_field_src != NULL) && ($custom_field_src_url != "" || $custom_field_src_url != NULL) ) {
		
		
		$counter = 0;
		
		while ($counter < count($array_src)) {
			if ($counter != count($array_src)-1){
				$deliminator = ", ";
			} else {
				$deliminator = "";
			}
			
			$sources .= '<a href="' . $array_src_url[$counter] . '" title="' . trim($array_src[$counter]) . '" target=\"_blank\">' . trim($array_src[$counter]) . '</a>' . $deliminator;
			$counter += 1;
		}
		
	}
	
	$name = get_the_author_meta('display_name',$post->post_author);
	$details = get_the_author_meta('description',$post->post_author);
	$author = get_the_author_meta("ID",$post->post_author);
	$permanlink = get_permalink();
	
	$authortext = "";
	if ($name != "" && $name != null && $details != "" && $details != null) {
		$authortext = '
			<!--About the author-->
			<div id="' . wa_about_author . '">
				<div id="' . wa_about_author_padding . '">
					<!--Author heading-->
					<div id="' . wa_about_author_title . '">About ' . "$name" . '</div>
					
					<!--The author image-->
					<div id="' . wa_about_author_image . ' class="' . "$author" . wa_alignleft . '" style="background-image:url(' . "$gravatarImage" . '?s=417.jpg)"></div>
					
					<div id="' . wa_about_author_text . '">
						' . "$details" . '
					</div>
					
				<!--Add in a clear fix for the floats!-->
				<div class="' . wa_clearfix . '"></div>		
		
				</div>
			</div>';
			
	}
	
	$time = get_the_time('Y/m');
	$encoded_permalink = htmlentities(get_permalink());
	$encoded_title = htmlentities($post->post_title);
		
	if ($target == "single") {
		echo '<div id="' . wa_main_post . '" class="' . "$post->ID" . '">
				<!--Top bar section-->
				<section>
					<div id="' . wa_reading_top_padding . '">
						
						<!--The author image-->
						<div id="' . wa_reading_author . '" class="' . "$author" . '" style="background-image:url(' . "$gravatarImage" . '?s=285.jpg)"></div>
					
						<!--The title of the blog post-->
						<a href="' . "$permanlink" . '" id="' . wa_reading_title . '" class="' . $post->post_name . '">' . "$post->post_title" . '</a>
						
						<span id="' . "$time" . '" class="' . "wa_post_date" . '" style="display:none;"></span>
						<!--Put some spacing below the title and the tags-->
						<div class="' . wa_break . '"></div>
						
						<!--The tags-->
						' . "$tags" . '
						
						<!--Clear fix-->
						<div class="' . wa_clearfix . '"></div>
					
					</div>
				</section>
								
				<!--The bottom gradient/color of the section-->
				<div id="' . wa_reading_top_bar_shade . '"></div>
				
				<!--The main reading content-->
				<div id="' . wa_reading_section . '">
					<div id="' . wa_reading_content . '" class="' . wa_allow_text_selection . '">
						' . "$content" . '			
					</div>		
								
					' . "$sources" . '			
										
					<!--Add in a clear fix for the floats!-->
					<div class="' . wa_clearfix . '" id="' . wa_posts_spacing . '"></div>		
																			
					' . "$authortext" . '
					
					<!--Commenting-->
					<div id="' . wa_commenting . '">
						<div class="' . wa_heading . ' ' . wa_heading_darker . '">Discussion';
			
		echo '</div><!--Yeah, cheap, but it is the line below it!--><div class="' . wa_heading_line . '"></div>';
					
		echo "</div></div>";
		
		//end commenting div
		echo "</div>";
		
		echo '<script type="text/javascript" src="http://techcores.us.intellitxt.com/intellitxt/front.asp?ipid=28596"></script>';
	} else {
		//set array
		$dataArray["id"] = $post->ID;
		$dataArray["authorID"] = $author;
		$dataArray["authorImage"] = $gravatarImage;
		$dataArray["link"] = $permanlink;
		$dataArray["name"] = $post->post_name;
		$dataArray["title"] = $post->post_title;
		$dataArray["date"] = $time;
		$dataArray["tags"] = $tags;
		$dataArray["encodedLink"] = $encoded_permalink;
		$dataArray["encodedTitle"] = $encoded_title;
		$dataArray["content"] = $content;
		$dataArray['sources'] = $sources;
		$dataArray["authorName"] = $name;
		$dataArray["authorText"] = $details;
	
		echo json_encode($dataArray);
	}
	

}


?>