<?php

//function to clean up a string
function clean_string($string) {
	$bad = array("content-type","bcc:","to:","cc:","href");
	return str_replace($bad,"",$string);
}


//add in the needed stuff for reCAPTCHA
require_once('../libs/recaptchalib.php');
$privatekey = "6LeeO8cSAAAAAL47fU3BXYhIpIfjELWt76xsekCr";

//set the reCAPTCHA response variables
$resp = recaptcha_check_answer ($privatekey,
							$_SERVER["REMOTE_ADDR"],
							$_POST["recaptcha_challenge_field"],
							$_POST["recaptcha_response_field"]);


//set the title variable
$title = $_POST['Title']; //the email

//grab the subject
$subject = stripslashes($_POST['Subject']);

//where and from the email is coming from
$email_to = "taylor@techcores.com";
$email_subject = ($title === "Contact") ? 'Tech Cores ' . $title . ' Form - ' . $subject : 'Tech Cores ' . $title . ' Form';

//set the name variable
$from_name = $_POST['Name']; //the email

//set the devlog variable
$devlog = stripslashes($_POST['wai_devLog']); //the email

//set the email variable
$email_from = $_POST['Email']; //the email

//make sure the reCAPTCHA is valid
if(!$resp->is_valid) {
	echo "1";
	die();
}

//the first part of the email message
$email_message = "Hello,\n\nA user has contacted Tech Cores! All of the details are below.\n\n\n";

//loop through the POST array and export the contents
foreach($_POST as $name=>$value){
	if ($name != "recaptcha_challenge_field" && $name != "recaptcha_response_field" && $name != "Title" && $name != "wai_devLog"){
		$email_message .= stripslashes($name . ": " . clean_string($value)."\n\n");
	}
}

//set the user variables
$email_message .= "IP Address: ".clean_string($_SERVER["REMOTE_ADDR"]) . "\n\n"; //the ip of the user
$email_message .= "User Agent: ".clean_string($_SERVER["HTTP_USER_AGENT"]); //the ip of the user

//append the signature
$email_message .= "\n\n\n\nThanks,\nTech Cores Administration\n\n\n";

//declare the regex for the email validation
$email_exp = '/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/';


//check email
if(preg_match($email_exp,$email_from)) {
	//send the email with zend
	set_include_path('/var/www/libs/');
	require_once 'Zend/Mail.php';
	$mail = new Zend_Mail();
	$mail->setSubject($email_subject);
	$mail->setFrom($email_from, $from_name);
	$mail->addTo($email_to);
	$mail->setBodyText($email_message);
	$attachment = $mail->createAttachment($devlog);
	$attachment->filename    = 'devlog.txt';
	$attachment->disposition = Zend_Mime::DISPOSITION_INLINE;
	$attachment->encoding    = Zend_Mime::ENCODING_BASE64;
	$mail->send();
}


//saying the script ran
echo "0";
?>
