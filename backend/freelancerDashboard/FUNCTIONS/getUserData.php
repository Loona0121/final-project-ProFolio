<?php
// Prevent caching of the page
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");


include_once("../connection/connection.php");
$con=connection();

function getUserData($userID) {
    global $con;

    // SQL query to fetch user data from _user table
    $sql = "SELECT id, CONCAT(first_name, ' ', last_name) AS full_name, email, profile_photo, job_title, summary, first_name
            FROM _user 
            WHERE id = ?";

    if ($stmt = $con->prepare($sql)) {
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($id, $full_name, $email, $profile_photo, $job_title, $summary, $first_name);
            
            if ($stmt->fetch()) {
                return [
                    'id' => $id,
                    'full_name' => $full_name,
                    'email' => $email,
                    'first_name' => $first_name,
                    // Provide default values if fields are empty or null
                    'profile_photo' => !empty($profile_photo) ? $profile_photo : 'default-profile-photo.jpg',
                    'job_title' => !empty($job_title) ? $job_title : '',
                    'summary' => !empty($summary) ? $summary : '',
                ];
            }
        }
    }
    
    return false;
}




?>
