<?php

function connection(){ 

$host = "sql204.byethost16.com"; // ByetHost MySQL Host
$username = "b16_39001542";       // Your ByetHost MySQL Username
$password = "@l0n@231";   // Your ByetHost MySQL Password
$database = "b16_39001542_profolio";  // Your ByetHost MySQL Database name

$con = new mysqli ($host, $username, $password, $database);

if($con->connect_error){
    echo $con->connect_error;
}
else{
    return $con;
}
}
