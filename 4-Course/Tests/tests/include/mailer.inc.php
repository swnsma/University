<?php

$mailers['Standard (mailto:)']     = "mailto:";
// $mailers['Outlook (mailto:)']     = "mailto:";
// $mailers['Thunderbird (mailto:)'] = "mailto:";
$mailers['gmail']     = "https://mail.google.com/mail/?fs=1&amp;view=cm&amp;shva=1&amp;to=";
$mailers['yahoo']     = "http://compose.mail.yahoo.com/?to=";
$mailers['hotmail']   = "http://www.hotmail.msn.com/secure/start?action=compose&amp;to=";

function getMailer() {
	 
	global $mailers;
	
	if(isset($mailers[getPref('mailer')])) {
		return $mailers[getPref('mailer')];
	} else {
		return "mailto:";
	}
}

function getMailerDelim() {
	 
	global $mailers;
	
	if(   isset($mailers[getPref('mailer')]) 
	   && getPref('mailer') == 'Thunderbird (mailto:)') {
		return ",";
	} else {
		return ";";
	}
}
?>
