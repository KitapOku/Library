rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Standard-Regel: Alle Zugriffe sind standardmäßig gesperrt
    match /{document=**} {
      allow read, write: if false;
    }
    
    // Bücher-Collection
    match /books/{bookId} {
      // Jeder kann Bücher lesen
      allow read: if true;
      
      // Nur authentifizierte Admins können Bücher schreiben/ändern/löschen
      allow write: if request.auth != null && 
                   exists(/databases/$(database)/documents/admins/$(request.auth.uid));
      
      // Validierung der Buchdaten
      allow create: if request.auth != null && 
                    exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
                    validateBookData(request.resource.data);
      
      allow update: if request.auth != null && 
                    exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
                    validateBookData(request.resource.data);
      
      allow delete: if request.auth != null && 
                    exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }
    
    // Site-Einstellungen
    match /settings/{settingId} {
      // Jeder kann Einstellungen lesen
      allow read: if true;
      
      // Nur authentifizierte Admins können Einstellungen ändern
      allow write: if request.auth != null && 
                   exists(/databases/$(database)/documents/admins/$(request.auth.uid)) &&
                   validateSettingsData(request.resource.data);
    }
    
    // Admin-Benutzer (zum Überprüfen der Admin-Berechtigung)
    match /admins/{userId} {
      // Nur der entsprechende Admin kann seine eigenen Daten lesen
      allow read: if request.auth != null && request.auth.uid == userId;
      
      // Admins können nicht über die App erstellt werden (nur über Firebase Console)
      allow write: if false;
    }
    
   
