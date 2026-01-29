<?php
// Prevent PHP warnings/errors from breaking JSON output
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');

// Helper response function
function jsonResponse($success, $data = [], $status = 200)
{
    http_response_code($status);
    $response = ['success' => $success];
    if ($success) {
        $response = array_merge($response, $data);
    } else {
        $response['error'] = $data;
    }
    echo json_encode($response);
    exit;
}

// 1. Check Request Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Method not allowed', 405);
}

// 2. Check File
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(false, 'No file uploaded or upload error', 400);
}

$file = $_FILES['file'];

// 3. Validate Size (Max 10MB)
// 10MB = 10 * 1024 * 1024 bytes
if ($file['size'] > 10 * 1024 * 1024) {
    jsonResponse(false, 'File too large. Max 10MB.', 400);
}

// 4. Validate Type
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mimeType = $finfo->file($file['tmp_name']);
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

if (!in_array($mimeType, $allowedTypes)) {
    jsonResponse(false, 'Invalid file type. Allowed: JPG, PNG, GIF, WEBP', 400);
}

// 5. Prepare Upload Directory
$uploadDir = __DIR__ . '/uploads/avatars/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// 6. Generate Filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'avatar-' . time() . '-' . bin2hex(random_bytes(4)) . '.' . $extension;
$targetPath = $uploadDir . $filename;

// 7. Compress & Optimize (Lossless-ish)
// We use GD for basic optimization (stripping metadata, optimizing quality slightly)
// For true lossless on PHP without exec(), options are limited, but we can do a good job.

try {
    $sourceImage = null;
    switch ($mimeType) {
        case 'image/jpeg':
            $sourceImage = @imagecreatefromjpeg($file['tmp_name']);
            break;
        case 'image/png':
            $sourceImage = @imagecreatefrompng($file['tmp_name']);
            // Preserve transparency for PNG
            imagealphablending($sourceImage, false);
            imagesavealpha($sourceImage, true);
            break;
        case 'image/gif':
            $sourceImage = @imagecreatefromgif($file['tmp_name']);
            break;
        case 'image/webp':
            $sourceImage = @imagecreatefromwebp($file['tmp_name']);
            break;
    }

    if ($sourceImage) {
        // We will save it back.
        // For JPEG: Quality 90 (High)
        // For PNG: Compression 9 (Max compression level, lossless standard for PNG in GD)
        // For WebP: Quality 90

        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($sourceImage, $targetPath, 90);
                break;
            case 'image/png':
                // png quality is 0-9 in GD (compression level), 0 is no compression. 9 is max.
                // It is lossless compression of the data.
                imagepng($sourceImage, $targetPath, 8);
                break;
            case 'image/gif':
                imagegif($sourceImage, $targetPath);
                break;
            case 'image/webp':
                imagewebp($sourceImage, $targetPath, 90);
                break;
        }
        imagedestroy($sourceImage);
    } else {
        // If GD fails to load (or is missing), fallback to simple move_uploaded_file
        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            jsonResponse(false, 'Failed to save file.', 500);
        }
        chmod($targetPath, 0644);
    }

} catch (Exception $e) {
    // Fallback if image processing crashes
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        jsonResponse(false, 'Failed to save file.', 500);
    }
    chmod($targetPath, 0644);
}

// 8. Return Success URL
$publicUrl = '/uploads/avatars/' . $filename;
jsonResponse(true, ['url' => $publicUrl]);
