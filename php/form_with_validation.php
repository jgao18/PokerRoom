<?php
  include("validation_functions.php");
  
  //session_start();
if(isset($_POST['submit']))
{
  $connection= mysqli_connect('localhost','root','poker','db_user') ;
 if(mysqli_connect_errno()) {
    die("Database connection failed: " . 
         mysqli_connect_error() . 
         " (" . mysqli_connect_errno() . ")"
    );
  }
 $username=$_POST['username'];
 $password=$_POST['password'];
 if($username!=''&&$password!='')
 {
   $query="select * from login where username='".$username."' and password='".$password."'";
  $search=mysqli_query($connection,$query);
   $res=mysqli_fetch_row($search);
   if($res)
   {
    $_SESSION['username']=$username;
    redirect_to("lobby.php");

    }else{
          echo "Username/password not found.";
    //echo'You entered username or password is incorrect';
   }
 }
 else
 {
  echo'Enter both username and password';
 }
}
?>
