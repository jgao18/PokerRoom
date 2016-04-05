<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once ("db_connect.php");
require_once ("authenticate.php");

$roomList = array(); 
$sql = 'SELECT roomName, roomIP FROM holdemRooms';
$stmt = $db->prepare($sql);
$stmt->execute();

if ($stmt->rowCount() > 0){
  //output data of each row
  while($row = $stmt->fetchAll()){
 //   print_r($row);
    $roomList =$row;
  }
  }else{
     "";
  }
$errors =[];
if (isset($_POST['addRoom'])) // This needs to update the database
{
  $expected = ['roomName', 'roomIP'];
    // Assign $_POST variables to simple variables and check all fields have values
    foreach ($_POST as $key => $value) {
        if (in_array($key, $expected)) {
            $$key = trim($value);
            if (empty($$key)) {
                $errors[$key] = 'This field requires a value.';
            }
        }
      }

if (!$errors){
  // Check that the roomName hasn't already been registered
  $sql = 'SELECT COUNT(*) FROM holdemRooms WHERE roomName = :roomName';
  $stmt = $db->prepare($sql);
  $stmt->bindParam(':roomName', $roomName);
  $stmt->execute();
  if ($stmt->fetchColumn() !=0){
    $errors['failed'] = "$roomName already exists.";
  }else {
    try {
      // Generate a random 8-character user key and insert values into the database
                    $id = hash('crc32', microtime(true) . mt_rand() . $roomName);
                    $sql = 'INSERT INTO holdemRooms (id, roomName, roomIP)
                            VALUES (:id, :roomName, :roomIP)';
                    $stmt = $db->prepare($sql);
                    $stmt->bindParam(':id', $id);
                    $stmt->bindParam(':roomName', $roomName);
                    $stmt->bindparam(':roomIP', $roomIP);
                    $stmt->execute();
                } catch (\PDOException $e) {
                    if (0 === strpos($e->getCode(), '23')) {
                        // If the user key is a duplicate, regenerate, and execute INSERT statement again
                        $user_key = hash('crc32', microtime(true) . mt_rand() . $roomName);
                        if (!$stmt->execute()) {
                            throw $e;
                        }
                      }
                    }
                }
              }

  }

if (isset($_POST['removeRoom'])) // This needs to update the database
{
  $dirtyRoomName = trim($_POST['removeRoomName']);
  $password = substr($dirtyRoomName, 0, 8);
  $roomName = substr($dirtyRoomName, 8);
  //validations
  $field_required = "removeRoomName";
  $value = trim($_POST[$field_required]);
  
  if (empty($value)) {
    $errors[$field_required] = 'This field requires a value.';
  } else if ($password != "adminpwd") {
    $errors['notadmin'] = 'You are not an admin!';
    } else {
      // Check that if room exists
      $sql = 'SELECT COUNT(*) FROM holdemRooms WHERE roomName = :removeRoomName';
      $stmt = $db->prepare($sql);
      $stmt->bindParam(':removeRoomName', $roomName);
      $stmt->execute();
      if ($stmt->fetchColumn()==0){
	$errors['notfound'] = "$roomName does not exist.";
      } else {
	$sql = 'DELETE FROM holdemRooms WHERE roomName=:removeRoomName';
	$stmt = $db->prepare($sql);
	$stmt->bindParam(':removeRoomName',$roomName);
	$stmt->execute();
      }
  }
}
if (isset($_POST['refresh'])) // This needs to pull from the database
{
  header("Refresh:0");
}

if (isset($_POST['join_server'])) 
{
  header('Location: ../link.php/');
  
  $ip = $_POST['servers'];

  setcookie('server_cookie', $ip , time() + (86400*30), '/');
}


?>
<style>
  html, body {
    width: 100%;
    height: 100%;
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    color: #444;
    -webkit-font-smoothing: antialiased;
    background: #f0f0f0;
}
#container {
    position: fixed;
    width: 340px;
    height: 280px;
    top: 50%;
    left: 50%;
    margin-top: -140px;
    margin-left: -170px;
  background: #fff;
    border-radius: 3px;
    border: 1px solid #ccc;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .1);
  
}
form {
    margin: 0 auto;
    margin-top: 10px;
}
label {
    color: #555;
    display: inline-block;
    margin-left: 18px;
    padding-top: 10px;
    font-size: 12px;
}
input {
    font-family: "Helvetica Neue", Helvetica, sans-serif;
    font-size: 10px;
    outline: none;
}
input[type=text] {
    color: #777;
    padding-left: 10px;
    margin: 10px;
    margin-top: 12px;
    margin-left: 18px;
    width: 200px;
    height: 25px;
  border: 1px solid #c7d0d2;
    border-radius: 2px;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .4), 0 0 0 5px #f5f7f8;
-webkit-transition: all .4s ease;
    -moz-transition: all .4s ease;
    transition: all .4s ease;
  }
input[type=text]:hover{
    border: 1px solid #b6bfc0;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .7), 0 0 0 5px #f5f7f8;
}
input[type=text]:focus{
    border: 1px solid #a8c9e4;
    box-shadow: inset 0 1.5px 3px rgba(190, 190, 190, .4), 0 0 0 5px #e6f2f9;
}
#lower {
    background: #ecf2f5;
    width: 100%;
    height: 69px;
    margin-top: 20px;
    box-shadow: inset 0 1px 1px #fff;
    border-top: 1px solid #ccc;
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
}

input[type=submit] {
    float: center;
    margin-right: 20px;
    margin-top: 20px;
    width: 80px;
    height: 30px;
font-size: 14px;
    font-weight: bold;
    color: #fff;
    background-color: #acd6ef; /*IE fallback*/
    background-image: -webkit-gradient(linear, left top, left bottom, from(#acd6ef), to(#6ec2e8));
    background-image: -moz-linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    background-image: linear-gradient(top left 90deg, #acd6ef 0%, #6ec2e8 100%);
    border-radius: 30px;
    border: 1px solid #66add6;
    box-shadow: 0 1px 2px rgba(0, 0, 0, .3), inset 0 1px 0 rgba(255, 255, 255, .5);
    cursor: pointer;
}
input[type=submit]:hover {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#b6e2ff), to(#6ec2e8));
    background-image: -moz-linear-gradient(top left 90deg, #b6e2ff 0%, #6ec2e8 100%);
    background-image: linear-gradient(top left 90deg, #b6e2ff 0%, #6ec2e8 100%);
}
input[type=submit]:active {
    background-image: -webkit-gradient(linear, left top, left bottom, from(#6ec2e8), to(#b6e2ff));
    background-image: -moz-linear-gradient(top left 90deg, #6ec2e8 0%, #b6e2ff 100%);
    background-image: linear-gradient(top left 90deg, #6ec2e8 0%, #b6e2ff 100%);
}
</style>

<div id="main">
  <div id="navigation">
    </div>
  <div id="page">
    <h2>Texas Hold'em Rooms</h2>
    <ul>
      <form  method="post">
	<select id ="servers" name="servers" onchange="document.getElementById('selected_text').value=this.options[this.selectedIndex].text">
	  <?php
	    foreach($roomList as $roomInfo)
	    {  ?>
	      <option value=<?php echo $roomInfo[1] ?> > <?php echo $roomInfo[0]?> </option>
	    <?php
	      }
	  ?>
	</select>
	<input type="hidden" name="selected_text" id="selected_text" value="" />
	<input type="submit" name="join_server" id="join_server" value="Enter">
	<p></p>
	<input type="submit" name="refresh" id="refresh" value="Refresh">
      </form>
    </ul>
    <h2> <br> </h2>
    <div id="page2">
      <p>Create Custom Rooms</p>
      <form  method="post">
	<p>
	<label for="roomName"> Room Name:</label>
	<input type="text" name="roomName" id="roomName"/>
   <?php
        if (isset($errors['roomName'])) {
            echo $errors['roomName'];
        }elseif (isset($errors['failed'])) {
            echo $errors['failed'];
        }
        ?>
	</p>
	
	<p>
	<label for="roomIP"> IP Address: </label>
	<input type="text" name="roomIP" id="roomIP"/>
   <?php
        if (isset($errors['roomIP'])) {
            echo $errors['roomIP'];
        }
        ?>
	</p>
	
	<input type="submit" name="addRoom" id="addRoom" value="Add">
      </form>
    </div>
    
    <h2> <br> </h2>
    
    <div id="page2">
      <p>Remove Rooms (Admins only)</h2>
      <form  method="post">
	<p>
	<label for="removeRoomName">Room Name:</label>
	<input type="text" name="removeRoomName" id="removeRoomName"/>
   <?php
        if (isset($errors['removeRoomName'])) {
            echo $errors['removeRoomName'];
        } elseif (isset($errors['notfound'])) {
            echo $errors['notfound'];
        } elseif (isset($errors['notadmin'])) {
	    echo $errors['notadmin'];
	}
        ?>
  
	</p>
	
	<input type="submit" name="removeRoom" id="removeRoom" value="Remove">
      </form>
    </div>
    
  </div>
</div>


