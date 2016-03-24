<?php 
include ("init.php");
include("header.php");
include ("authenticate.php");

$roomList = array(); // This needs to pull from the database

if (isset($_POST['addRoom'])) // This needs to update the database
{
  $roomName = trim($_POST['roomName']);
  $roomIP = trim($_POST['roomIP']);
  
  $newRoom = array($roomName, $roomIP);
  
  array_push($roomList, $newRoom);
}

if (isset($_POST['removeRoom'])) // This needs to update the database
{
  $roomName = trim($_POST['removeRoomName']);
  
}

if (isset($_POST['refresh'])) // This needs to pull from the database
{
  header("Refresh:0");
}
?>

<div id="main">
  <div id="navigation">
    &nbsp;
  </div>
  <div id="page">
    <h2>Texas Hold'em Rooms</h2>
    <p>Public Rooms:</p>
    <ul>
      <p>
      <form  method="post">
	<?php
	  foreach($roomList as $roomInfo)
	  {
	    echo "<li><a href='$roomInfo[1]'>$roomInfo[0]</a></li>";
	  }
	?>
	<p></p>
	
	<input type="submit" name="refresh" id="refresh" value="Refresh Room List">
      </form>
      </p>
    </ul>
    
    <div id="page2">
      <h2>Admin Access: Create Room</h2>
      <form  method="post">
	<p>
	<label for="roomName">Room Name:</label>
	<input type="text" name="roomName" id="roomName"/>
	</p>
	
	<p>
	<label for="roomIP">Room IP Address:</label>
	<input type="text" name="roomIP" id="roomIP"/>
	</p>
	
	<input type="submit" name="addRoom" id="addRoom" value="Add Room">
      </form>
    </div>
    
    <div id="page2">
      <h2>Admin Access: Remove Room</h2>
      <form  method="post">
	<p>
	<label for="removeRoomName">Room Name:</label>
	<input type="text" name="removeRoomName" id="removeRoomName"/>
	</p>
	
	<input type="submit" name="removeRoom" id="removeRoom" value="Add Room">
      </form>
    </div>
    
  </div>
</div>


