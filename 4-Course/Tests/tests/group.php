<?php

include ("include/dbconnect.php");
include ("include/format.inc.php");
echo "<title>Groups | Address Book</title>";
include ("include/header.inc.php");


echo "<h1>".ucfmsg('GROUPS')."</h1>";

if($submit) {
	if(! $read_only) {
		$sql = "INSERT INTO $table_groups (group_name, group_header, group_footer) VALUES ('$group_name','$group_header','$group_footer')";
		$result = mysql_query($sql);

		echo "<br /><div class='msgbox'>A new group has been entered into the address book.<br /><i>return to the <a href='group$page_ext'>group page</a></i></div>";
	} else
		echo "<br /><div class='msgbox'>Editing is disabled.<br /><i>return to the <a href='group$page_ext'>group page</a></i></div>";
	}
// -- Add people to a group
else if($new) {
	if(! $read_only) {
?>
  <form accept-charset="utf-8" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
    <label>Group name:</label>
	<input type="text" name="group_name" size="35" /><br />

    <label>Group header (Logo):</label>
	<textarea name="group_header" rows="10" cols="40"></textarea><br />

    <label>Group footer (Comment):</label>
	<textarea name="group_footer" rows="10" cols="40"></textarea><br /><br />
    <input type="submit" name="submit" value="Enter information" />
  </form>
<?php
	} else
		echo "<br /><div class='msgbox'>Editing is disabled.</div>\n";
	} else if($delete) {
	// Remove the groups
	foreach($selected as $group_id)
	{
		// Delete links between addresses and groups
		$sql = "delete from $table_grp_adr where group_id = $group_id";
		$result = mysql_query($sql);

		// Delete groups
		$sql = "delete from $table_groups  where group_id = $group_id";
		$result = mysql_query($sql);
	}
	echo "<div class='msgbox'>Group has been removed.<br /><i>return to the <a href='group$page_ext'>group page</a></i></div>";	
}
else if($add)
{
	// Lookup for the group_id
	$sql = "select * from $table_groups where group_name = '$to_group'";

	$result = mysql_query($sql);
	// $resultsnumber = mysql_numrows($result);

	$myrow = mysql_fetch_array($result);
	$group_id   = $myrow["group_id"];
	$group_name = $myrow["group_name"];

	// Add people to the group, who are not alread in the group!
	foreach($selected as $user_id)
	{
		
		$sql = "insert into $table_grp_adr (id, group_id) values ($user_id, $group_id)";
		$result = mysql_query($sql);
	}
	
	echo "<div class='msgbox'>Users added.<br /><i>Go to <a href='./?group=$group_name'>group page \"$group_name\"</a>.</i></div>";
}
// -- Remove people from a group
else if($remove)
{
	// Lookup for the group_id
	$sql = "select * from $table_groups where group_name = '$group'";

	$result = mysql_query($sql);
	// $resultsnumber = mysql_numrows($result);

	$myrow = mysql_fetch_array($result);
	$group_id   = $myrow["group_id"];
	$group_name = $myrow["group_name"];

	// Remove people from the group, who are not alread in the group!
	foreach($selected as $user_id)
	{
		
		$sql = "delete from $table_grp_adr where id = $user_id AND group_id = $group_id";
		$result = mysql_query($sql);
	}
	
	echo "<div class='msgbox'>Users removed. <br /><i>return to <a href='./?group=$group_name'>group page \"$group_name\"</a>.</i></div>";
}
else if($update)
{
  if(! $read_only)
  {
	$sql="SELECT * FROM $table_groups WHERE group_id=$id";
	$result = mysql_query($sql);
	$resultsnumber = mysql_numrows($result);

	if($resultsnumber > 0)
	{
		$sql = "UPDATE $table_groups SET group_name='$group_name'
                                               , group_header='$group_header' 
                                               , group_footer='$group_footer' 
                                             WHERE group_id=$id";
		$result = mysql_query($sql);

		// header("Location: view?id=$id");		

		echo "<br /><div class='msgbox'>Group record has been updated.<br /><i>return to the <a href='group$page_ext'>group page</a></i></div>";
	} else {
		echo "<br /><div class='msgbox'>Invalid ID.<br /><i>return to the <a href='group$page_ext'>group page</a></i></div>"; 
	}
  } else
    echo "<br /><div class='msgbox'>Editing is disabled.</div>";
}
// Open for Editing
else if($edit || $id)
{
  if($edit) $id = $selected[0];
  if(! $read_only)
  {

$result = mysql_query("$select_groups WHERE groups.group_id=$id",$db);
$myrow = mysql_fetch_array($result);

?>
	<form accept-charset="utf-8" method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
        <input type="hidden" name="id" value="<?php echo $myrow['group_id']?>" />

		<label><?php echo ucfmsg('GROUP_NAME'); ?></label>
		<input type="text" name="group_name" size="35" value="<?php echo $myrow['group_name']?>" /><br />

		<label><?php echo ucfmsg('GROUP_HEADER'); ?>:</label>
		<textarea name="group_header" rows="10" cols="40"><?php echo $myrow["group_header"]?></textarea><br />

		<label><?php echo ucfmsg('GROUP_FOOTER'); ?>:</label>
		<textarea name="group_footer" rows="10" cols="40"><?php echo $myrow["group_footer"]?></textarea><br /><br />
		<input type="submit" name="update" value="<?php echo ucfmsg('UPDATE'); ?>" />
	</form>
    <br />
  <?php

  } else
    echo "<br /><div class='msgbox'>Editing is disabled.</div>\n";
}
else
{

	$result = mysql_query($select_groups." ORDER BY groups.group_name");
	$resultsnumber = mysql_numrows($result);

?>
<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">
<input type="submit" name="new" value="<?php echo ucfmsg('NEW_GROUP'); ?>" />
</form>
<hr />
<form method="post" action="<?php echo $_SERVER['PHP_SELF'];?>">

<?php
	while ($myrow = mysql_fetch_array($result)) {
		echo "<input type='checkbox' name='selected[]' value='".$myrow['group_id']."' title='Select (".$myrow['group_name'].")'/>";
		if($myrow['parent_name'] != "") {
			echo $myrow['group_name']." <i>(".$myrow['parent_name'].")</i><br />";
		} else {
			echo $myrow['group_name']."<br />";
		}
	}	
?>
<br />
	<input type="submit" name="delete" value="<?php echo ucfmsg('DELETE_GROUPS'); ?>" />
	<input type="submit" name="edit" value="<?php echo ucfmsg('EDIT_GROUP'); ?>" />
</form>
<?php 
}
include ("include/footer.inc.php");
?>
