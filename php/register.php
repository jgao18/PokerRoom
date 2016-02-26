<?php include ("functions.php"); ?>
 <html>
<head>
 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<style type="text/css">
 body {
   color:white;
 font-size:14px;
 }
 .contact {
    text-align:center;
    background: none repeat scroll 0% 0% #A52A2A;
    padding: 20px 10px;
    box-shadow: 1px 2px 1px #8FBF73;
    border-radius: 10px;
 width:520px;
 }
 #name, #username,#password, #mail {
    width: 250px;
    margin-bottom: 15px;
    background: none repeat scroll 0% 0% #AFCF9C;
    border: 1px solid #91B57C;
    height: 30px;
    color: #A52A2A;
    border-radius: 8px;
    box-shadow: 1px 2px 3px;
}
#submit
{
    background:none repeat scroll 0% 0% #8FCB73;
    display: inline-block;
    padding: 5px 10px;
    line-height: 1.05em;
 box-shadow: 1px 2px 3px #8FCB73;
    border-radius: 8px;
    border: 1px solid #8FCB73;
    text-decoration: none;
    opacity: 0.9;
    cursor: pointer;
 color:white;
}
#er {
    color: #F00;
    text-align: center;
    margin: 10px 0px;
    font-size: 17px;
}
</style>
</head>
<body>

<?php
 error_reporting('E_ALL ^ E_NOTICE');
 if(isset($_POST['submit']))
 {
  mysql_connect('localhost','csci3300_poker','8duK8rat2ehuyedR') or die(mysql_error());
  mysql_select_db('csci3300_poker') or die(mysql_error());
  $name=$_POST['name'];
  $username=$_POST['username'];
  $password=password_encrypt($_POST['password']);
  $mail=$_POST['mail'];  
  $query=mysql_query("select * from login where username='".$username."'or mail='".$mail."' ") or die(mysql_error());
  $row=mysql_fetch_row($query);
  if($row>0)
  {
   $er='The username '.$username.' or email '.$mail.' is already present in our database';
  }
  else
  {
   $insert=mysql_query("insert into login values('".$name."','".$username."','".$password."','".$mail."')") or die(mysql_error());
   if($insert)
   {
    $er='Successfully registered.Click on Login.';
   }
   else
   {
    $er='Values are not registered';
   }
  }
 }
?>
<div class="contact">
  <li><a href="login.php">Login</a></li>
<h1>Registration Form</h1>
     <div id="er"><?php echo $er; ?></div>
     <form action="#" method="post">
      <table id="tbl" align="center">
       <tr><td>Full Name:</td><td><input type="text" name="name" id="name"></td></tr>
       <tr><td>UserName:</td><td><input type="text" name="username" id="username"></td></tr>
            <tr><td>Password:</td><td><input type="password" name="password" id="password"></td></tr>
        <tr><td>Email:</td><td><input type="text" name="mail" id="mail"></td></tr>
       <tr><td></td><td><input type="submit" name="submit" id="submit" value="Submit"></td></tr>
      </table>
     </form>
</div>

<script type="text/javascript">
$(document).ready(function() {
$('#submit').click(function() {
var name=document.getElementById('name').value;
var username=document.getElementById('username').value;
var password=document.getElementById('password').value;
var mail=document.getElementById('mail').value;
var chk = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
if(name=='')
{
 $('#er').html('Enter your name');
 return false;
}
if(username=='')
{
 $('#er').html('Enter your username');
 return false;
}
if(password=='')
{
 $('#er').html('Enter your password');
 return false;
}
 if(mail=='')
{
 $('#er').html('Enter your email');
 return false;
}
if(!chk.test(mail))
{
 $('#er').html('Enter valid email');
 return false;
}

});
});
</script>
</body>

</html>
