<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$counterFile = 'counter.json';

if (!file_exists($counterFile)) {
    file_put_contents($counterFile, json_encode(['count' => 31]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents($counterFile), true);
    $data['count']++;
    $data['last_updated'] = date('c');
    
    file_put_contents($counterFile, json_encode($data));
    
    echo json_encode([
        'success' => true,
        'count' => $data['count']
    ]);
} else {
    $data = json_decode(file_get_contents($counterFile), true);
    
    echo json_encode([
        'count' => $data['count'],
        'last_updated' => $data['last_updated'] ?? date('c')
    ]);
}
?>
