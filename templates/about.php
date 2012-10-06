<?php

/**
Author      : Taylor Jasko
Date        : November 3, 2011 8:36:47 PM EDT
Last Edited : November 3, 2011 8:36:47 PM EDT
Revision    : 1 (released version)
Description : A script written to handle the content on the about page
**/

//function for gathering and returning authors data
function author_data($id) {
	
	//even more...
	$text = '
		<div class="' . wa_about_person . '">
			<div class="' . wa_about_left_content . '">';	
	
				//person's name
				$text .= '<div class="' . wa_about_person_name . '">' . '<a href="' . get_bloginfo ( 'home' ) . "/" . get_the_author_meta('user_login', $id) . '">' . get_user_meta($id, 'first_name', true) . " " . get_user_meta($id, 'last_name', true) . '</a>' .'</div>';
	
				//get user info
				$user_info = get_userdata($id);
	
				//gravatar
				$text .= '<div class="' . wa_about_person_image . '" style="background-image:url(http://0.gravatar.com/avatar/' . md5(strtolower($user_info->user_email)) . '?s=408);"></div></div>';
	
			//short desc
			$text .= '<div class="' . wa_about_shortdesc . ' ' . wa_aligncenter . '">' . esc_attr( get_the_author_meta( 'twowords', $id) ) . '</div>';

			//long bio
			$text .= '<div class="' . wa_about_bio . '">' . esc_attr( get_the_author_meta( 'about', $id) ) . '</div><div class="' . wa_clearfix . '"></div>';

		$text .= '</div><div class="' . wa_clearfix . '"></div>';
	
	//and return it all
	return $text;
}


?>