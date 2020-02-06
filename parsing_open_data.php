<?php
/**
 * Created by PhpStorm.
 * User: Paolo
 * Date: 04/02/2020
 * Time: 17:01
 */

# URL traffico di Torino
const URL_TRAFFIC_TORINO = "http://opendata.5t.torino.it/get_fdt";

function get_download(){
    $xml = file_get_contents("http://yoursite.com/yourxml.xml");
}

$xml = simplexml_load_file($_POST[namefile]);
$tagXML=array();
if($xml ===  FALSE)
    echo json_encode($tagXML);
else{
    $tagXML[]=(string)$xml->header;
    $tagXML[]=(string)$xml->body->file;
    $tagXML[]=(string)$xml->digestHeader;
    $tagXML[]=(string)$xml->digestFile;
    echo json_encode($tagXML);
}
?>