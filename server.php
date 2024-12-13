<?php
$eventsFile = 'events.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $events = file_exists($eventsFile) ? json_decode(file_get_contents($eventsFile), true) : [];
    $data['serverTime'] = date('Y-m-d H:i:s');
    $events[] = $data;
    file_put_contents($eventsFile, json_encode($events));
} else {
    echo file_exists($eventsFile) ? file_get_contents($eventsFile) : json_encode([]);
}
?>
