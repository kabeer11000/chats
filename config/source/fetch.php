<?php
$client_sw_version = $_GET['client_sw_version'];
$client_release = $_GET['client_release']; // development, production, preview
$available_releases = ['development', 'production', 'preview'];
if (substr($client_sw_version, strlen('2.4')) == '2.4') {
    if (in_array($client_release, $available_releases)) {
        $contents = json_decode(file_get_contents('./configs/2.4.x.'. $client_release .'.json'));
        echo json_encode($contents);
    }
}