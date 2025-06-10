<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Gemeindebibliothek der DITIB Jugend Kreis Unna - Bücher ausleihen und entdecken">
  <meta name="keywords" content="Bibliothek, DITIB, Jugend, Kreis Unna, Bücher, Ausleihe">
  <meta name="author" content="DITIB Jugend Kreis Unna">
  
  <title>Gemeindebibliothek - DITIB Jugend Kreis Unna</title>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="./styles/critical.css" as="style">
  <link rel="preload" href="./js/app.js" as="script">
  
  <!-- Critical CSS inline -->
  <style>
    /* Critical CSS for above-the-fold content */
    body {
      font-family: 'Arial', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7fafc;
      color: #2d3748;
      line-height: 1.6;
    }
    
    .header {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .header h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0;
    }
    
    .social-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .social-links img {
      width: 2rem;
      height: 2rem;
    }
    
    .loading {
      text-align: center;
      padding: 2rem;
      font-size: 1.1rem;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  </style>
  
  <!-- Progressive Web App Meta -->
  <meta name="theme-color" content="#4F46E5">
  <link rel="manifest" href="./manifest.json">
  <link rel="apple-touch-icon" href="./icons/icon-192x192.png">
  
  <!-- Non-critical CSS -->
  <link rel="preload" href="https:
