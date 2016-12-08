<?php

include ("include/dbconnect.php");
include ("include/format.inc.php");

$resultsnumber = 0;
if ($id) {

   $sql = "SELECT * FROM $base_from_where AND $table.id='$id'";
   $result = mysql_query($sql, $db);
   $r = mysql_fetch_array($result);

   $resultsnumber = mysql_numrows($result);
}

if( ($resultsnumber == 0 && !isset($all)) || (!$id && !isset($all))) {
   ?><title>Address book <?php echo ($group_name != "" ? "($group_name)":""); ?></title><?php
   include ("include/header.inc.php");
} else {
   ?><title><?php echo $r["firstname"]." ".$r["lastname"]." ".($group_name != "" ? "($group_name)":"")."\n"; ?></title><?php
   if( !isset($_GET["print"]))
   {
     include ("include/header.inc.php");
   } else {
     echo '</head><body>';
     // echo '</head><body onload="javascript:window.setTimeout(window.print(self), 1000)";>';
   }
}
?>
 <h1><?php echo ucfmsg('EDIT_ADD_ENTRY'); ?></h1> 
<?php
if($submit)
{

if(! $read_only)
{
	//
	// Primitiv filter against spam on "sourceforge.net".
	//
	if($_SERVER['SERVER_NAME'] == "php-addressbook.sourceforge.net") {
		
	   $spam_test = $firstname.$lastname.$address.$home.$mobile.$work.$email.$email2.$bday.$bmonth.$byear.$address2.$phone2;
     $blacklist = array( 'viagra', 'seroquel', 'zovirax', 'ultram', 'mortage', 'loan'
                       , 'accutane', 'ativan', 'gun', 'sex', 'porn', 'arachidonic'
                       , 'recipe', 'comment1'
                       , 'naked', 'gay', 'fetish', 'domina', 'fakes', 'drugs'
                       , 'methylphenidate', 'nevirapine', 'viramune' );
     foreach( $blacklist as $blackitem ) {
	      if(strpos(strtolower($spam_test), $blackitem) !== FALSE ) {
	        exit;
	      }
	   }
	   if(   preg_match('/\D{3,}/', $home) > 0
	      || preg_match('/\D{3,}/', $mobile) > 0) {
	      	exit;
	   }
	   if(   strlen($home)   > 15 
	      || strlen($mobile) > 15) {
	      	exit;
	   }
	 }
	 
	$sql = "INSERT INTO $table (firstname, lastname, address, home, mobile, work, email, email2, bday, bmonth, byear, address2, phone2) VALUES ('$firstname','$lastname','$address','$home','$mobile','$work','$email','$email2','$bday','$bmonth','$byear', '$address2', '$phone2')";
	$result = mysql_query($sql);
	
	if(isset($table_groups) and $table_groups != "" ) {
		if( !$is_fix_group ) {
			$g_name = $new_group;
	  } else {
	  	$g_name = $group_name;
	  }
		$sql = "INSERT INTO $table_grp_adr SELECT LAST_INSERT_ID() id, group_id FROM $table_groups WHERE group_name = '$g_name'";
		$result = mysql_query($sql);
	
		echo "<br /><div class='msgbox'>Information entered into address book.";
		echo "<br /><i><a href='edit$page_ext'>add next</a> or return to <a href='index$page_ext'>home page</a>.</i></div>";
	}

} else
  echo "<br /><div class='msgbox'>Editing is disabled.</div>\n";

}
else if($update)
{
  if(! $read_only)
  {
	$sql="SELECT * FROM $base_from_where AND $table.id='$id'";
	$result = mysql_query($sql);
	$resultsnumber = mysql_numrows($result);

	if($resultsnumber > 0)
	{
		$sql = "UPDATE $table SET firstname='$firstname',lastname='$lastname',address='$address',home='$home',mobile='$mobile',work='$work',email='$email',email2='$email2',bday='$bday',bmonth='$bmonth',byear='$byear',address2 = '$address2', phone2 = '$phone2' WHERE id='$id'";
		$result = mysql_query($sql);

		// header("Location: view?id=$id");		

		echo "<br /><div class='msgbox'>".ucfmsg('ADDRESS_BOOK')." ".msg('UPDATED')."<br /><i>return to <a href='index$page_ext'>home page</a></i></div>";
	} else {
		echo "<br /><div class='msgbox'>".ucfmsg('INVALID')." ID.<br /><i>return to <a href='index$page_ext'>home page</a></i></div>";
		echo "";  
	}
  } else
    echo "<br /><div class='msgbox'>Editing is disabled.</div>\n";
}
else if($id)
{
  if(! $read_only)
  {
$result = mysql_query("SELECT * FROM $base_from_where AND $table.id=$id",$db);
$myrow = mysql_fetch_array($result);
?>
	<form accept-charset="utf-8" method="post" action="edit<?php echo $page_ext; ?>">

		<input type="hidden" name="id" value="<?php echo $myrow['id']?>" />
		<label><?php echo ucfmsg("FIRSTNAME") ?>:</label>
		<input type="text" name="firstname" size="35" value="<?php echo $myrow['firstname']?>" /><br />

		<label><?php echo ucfmsg("LASTNAME") ?>:</label>
		<input type="text" name="lastname" size="35" value="<?php echo $myrow['lastname']?>" /><br />

		<label><?php echo ucfmsg("ADDRESS") ?>:</label>
		<textarea name="address" rows="5" cols="35"><?php echo $myrow["address"]?></textarea><br />

		<label><?php echo ucfmsg("TELEPHONE") ?></label><br /><br class="clear" />

		<label><?php echo ucfmsg("PHONE_HOME") ?>:</label>
		<input type="text" name="home" value="<?php echo $myrow['home']?>" /><br />

		<label><?php echo ucfmsg("PHONE_MOBILE") ?>:</label>
		<input type="text" name="mobile" value="<?php echo $myrow['mobile']?>" /><br />

		<label><?php echo ucfmsg("PHONE_WORK") ?>:</label>
		<input type="text" name="work" value="<?php echo $myrow['work']?>" /><br />

		<label><?php echo ucfmsg("EMAIL") ?>:</label>
		<input type="text" name="email" size="35" value="<?php echo $myrow['email']?>" /><br />

		<label><?php echo ucfmsg("EMAIL") ?>2:</label>
		<input type="text" name="email2" size="35" value="<?php echo $myrow['email2']?>" /><br />

		<label><?php echo ucfmsg("BIRTHDAY") ?>:</label>
        <select name="bday">
			<option value="<?php echo $myrow['bday']?>" selected="selected"><?php echo ($myrow["bday"] == 0?"-":$myrow["bday"]) ?></option>
          <option value="0">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
        </select>
        <select name="bmonth">
          <option value="<?php echo $myrow['bmonth'] ?>" selected="selected"><?php echo ucfmsg(strtoupper($myrow["bmonth"])); ?></option>
          <option value="-">-</option>
          <option value="January"><?php echo ucfmsg("JANUARY") ?></option>
          <option value="February"><?php echo ucfmsg("FEBRUARY") ?></option>
          <option value="March"><?php echo ucfmsg("MARCH") ?></option>
          <option value="April"><?php echo ucfmsg("APRIL") ?></option>
          <option value="May"><?php echo ucfmsg("MAY") ?></option>
          <option value="June"><?php echo ucfmsg("JUNE") ?></option>
          <option value="July"><?php echo ucfmsg("JULY") ?></option>
          <option value="August"><?php echo ucfmsg("AUGUST") ?></option>
          <option value="September"><?php echo ucfmsg("SEPTEMBER") ?></option>
          <option value="October"><?php echo ucfmsg("OCTOBER") ?></option>
          <option value="November"><?php echo ucfmsg("NOVEMBER") ?></option>
          <option value="December"><?php echo ucfmsg("DECEMBER") ?></option>
        </select>
        <input type="text" name="byear" size="4" maxlength="4" value="<?php echo $myrow['byear']?>" /><br />

<?php
/* Group handling on change
      <label><?php echo ucfmsg("GROUP") ?>:</label>
				<?php      	
				if(isset($table_groups) and $table_groups != "" and !$is_fix_group) { ?>
				<select name="new_group">
				<?php
					if($group_name != "") 
					{
						echo "<option>$group_name</option>\n";
					}
					$sql = "SELECT group_name FROM $table_groups ORDER BY lower(group_name) ASC";
					$result_groups = mysql_query($sql);
					$result_gropup_snumber = mysql_numrows($result_groups);
					
					while ($myrow_group = mysql_fetch_array($result_groups))
					{
						echo "<option>".$myrow_group["group_name"]."</option>\n";
					}
				?>
				</select>
				<?php } ?>
			<br />
 */ ?>
		<br />
		<label><b><?php echo ucfmsg("SECONDARY") ?></b></label><br /><br class="clear" />

		<label><?php echo ucfmsg("ADDRESS") ?>:</label>
		<textarea name="address2" rows="5" cols="35"><?php echo $myrow["address2"]?></textarea><br />

		<label><?php echo ucfmsg("PHONE_HOME") ?>:</label>
		<input type="text" name="phone2" value="<?php echo $myrow['phone2']?>" /><br /><br /><br />

    	<input type="submit" name="update" value="<?php echo ucfmsg('UPDATE') ?>" />
  </form>
  <form method="get" action="delete<?php echo $page_ext; ?>">
		<input type="hidden" name="id" value="<?php echo $myrow['id']?>" />
		<input type="submit" name="update" value="<?php echo ucfmsg('DELETE') ?>" />
  </form>
<?php
	} else
		echo "<br /><div class='msgbox'>Editing is disabled.</div>";
	}
	else {
		if(! $read_only) {
?>
  <form accept-charset="utf-8" method="post" action="edit<?php echo $page_ext; ?>">

		<input type="hidden" name="id" value="<?php echo $myrow['id']?>" />
		<label><?php echo ucfmsg("FIRSTNAME") ?>:</label>
		<input type="text" name="firstname" size="35" /><br />

		<label><?php echo ucfmsg("LASTNAME") ?>:</label>
		<input type="text" name="lastname" size="35" /><br />

		<label><?php echo ucfmsg("ADDRESS") ?>:</label>
		<textarea name="address" rows="5" cols="35"></textarea><br />

		<label><?php echo ucfmsg("TELEPHONE") ?></label><br /><br class="clear" />

		<label>Home:</label>
		<input type="text" name="home" size="35" /><br />

		<label><?php echo ucfmsg("PHONE_MOBILE") ?>:</label>
		<input type="text" name="mobile" size="35" /><br />

		<label><?php echo ucfmsg("PHONE_WORK") ?>:</label>
		<input type="text" name="work" size="35" /><br />

		<label>&nbsp;</label><br /><br class="clear" />

		<label><?php echo ucfmsg("EMAIL") ?>:</label>
		<input type="text" name="email" size="35" /><br />

		<label><?php echo ucfmsg("EMAIL") ?>2:</label>
		<input type="text" name="email2" size="35" /><br />

		<label><?php echo ucfmsg("BIRTHDAY") ?>:</label>
        <select name="bday">
          <option value="0" selected="selected">-</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
          <option value="21">21</option>
          <option value="22">22</option>
          <option value="23">23</option>
          <option value="24">24</option>
          <option value="25">25</option>
          <option value="26">26</option>
          <option value="27">27</option>
          <option value="28">28</option>
          <option value="29">29</option>
          <option value="30">30</option>
          <option value="31">31</option>
        </select>
        <select name="bmonth">
          <option value="-" selected="selected">-</option>
          <option value="January"><?php echo ucfmsg("JANUARY") ?></option>
          <option value="February"><?php echo ucfmsg("FEBRUARY") ?></option>
          <option value="March"><?php echo ucfmsg("MARCH") ?></option>
          <option value="April"><?php echo ucfmsg("APRIL") ?></option>
          <option value="May"><?php echo ucfmsg("MAY") ?></option>
          <option value="June"><?php echo ucfmsg("JUNE") ?></option>
          <option value="July"><?php echo ucfmsg("JULY") ?></option>
          <option value="August"><?php echo ucfmsg("AUGUST") ?></option>
          <option value="September"><?php echo ucfmsg("SEPTEMBER") ?></option>
          <option value="October"><?php echo ucfmsg("OCTOBER") ?></option>
          <option value="November"><?php echo ucfmsg("NOVEMBER") ?></option>
          <option value="December"><?php echo ucfmsg("DECEMBER") ?></option>
        </select>
        <input type="text" name="byear" size="4" maxlength="4" /><br />

		<?php      	
    if(isset($table_groups) and $table_groups != "" and !$is_fix_group) { ?>

	<label><?php echo ucfmsg("GROUP") ?>:</label>
				<select name="new_group">
				<?php
					if($group_name != "") 
					{
						echo "<option>$group_name</option>\n";
					} ?>
          <option value="[none]">[<?php echo msg("NONE"); ?>]</option>
          <?php
					$sql="SELECT group_name FROM $table_groups ORDER BY lower(group_name) ASC";
					$result_groups = mysql_query($sql);
					$result_gropup_snumber = mysql_numrows($result_groups);
					
					while ($myrow_group = mysql_fetch_array($result_groups))
					{
						echo "<option>".$myrow_group["group_name"]."</option>\n";
					}
				?>
				</select><br />
		<?php } ?>
		
		<br />
		<label><b><?php echo ucfmsg("SECONDARY") ?></b></label><br /><br class="clear" />

		<label><?php echo ucfmsg("ADDRESS") ?>:</label>
		<textarea name="address2" rows="5" cols="35"></textarea><br />

		<label><?php echo ucfmsg("PHONE_HOME") ?>:</label>
		<input type="text" name="phone2" size="35" /><br /><br /><br />

		<input type="submit" name="submit" value="<?php echo ucfmsg('ENTER') ?>" />
  </form>
<?php
  } else
    echo "<br /><div class='msgbox'>Editing is disabled.</div>";
}

include ("include/footer.inc.php"); ?>
