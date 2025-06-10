class LibraryApp {
    constructor() {
      this.db = null;
      this.app = null;
      this.booksLoaded = false;
      this.firebaseLoaded = false;
      this.firebaseModules = {};
      this.init();
    }
  
    async init() {
      try {
        // Initialize AOS animation library
        if (typeof AOS !== 'undefined') {
          AOS.init({
            duration: 800,
            once: true,
            offset: 100
          });
        }
  
        // Load Firebase with delay for better performance
        await this.lazyLoadFirebase();
  
        // Setup event listeners
        this.setupEventListeners();
  
        // Load initial data
        await this.loadInitialData();
  
      } catch (error) {
        this.handleError('Initialisierungsfehler', error);
      }
    }
  
    async lazyLoadFirebase() {
      if (this.firebaseLoaded) return;
  
      try {
        // Dynamic import for better performance
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js');
        const { getFirestore, collection, getDocs, doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js');
  
        // Firebase configuration (storageBucket korrigiert!)
        const firebaseConfig = {
          apiKey: "AIzaSyBBGhn-V58ufgbSGsoL6lLONX09QJKm2sE",
          authDomain: "bibliothek-38373.firebaseapp.com",
          projectId: "bibliothek-38373",
          storageBucket: "bibliothek-38373.appspot.com", // KORRIGIERT
          messagingSenderId: "188405615349",
          appId: "1:188405615349:web:715db2a75ea95cc0c6d3bc",
          measurementId: "G-NR98T0L5RW"
        };
  
        this.app = initializeApp(firebaseConfig);
        this.db = getFirestore(this.app);
        this.firebaseModules = { collection, getDocs, doc, getDoc };
  
        this.firebaseLoaded = true;
        console.log('Firebase loaded successfully');
  
      } catch (error) {
        this.handleError('Firebase-Ladefehler', error);
        throw error;
      }
    }
  
    setupEventListeners() {
      // Hier können Event-Listener für Buttons, Formulare etc. hinzugefügt werden
      // Beispiel:
      // document.getElementById('reloadBooksBtn').addEventListener('click', () => this.loadInitialData());
    }
  
    async loadInitialData() {
      // Beispiel: Bücher laden
      try {
        if (!this.db || !this.firebaseModules.collection) return;
        const booksCol = this.firebaseModules.collection(this.db, 'books');
        const booksSnapshot = await this.firebaseModules.getDocs(booksCol);
        const books = [];
        booksSnapshot.forEach(doc => {
          books.push({ id: doc.id, ...doc.data() });
        });
        this.renderBooks(books);
        this.booksLoaded = true;
      } catch (error) {
        this.handleError('Fehler beim Laden der Bücher', error);
      }
    }
  
    renderBooks(books) {
      // Beispiel: Bücherliste im DOM anzeigen
      const booksList = document.getElementById('booksList');
      if (!booksList) return;
      booksList.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} von ${book.author}`;
        booksList.appendChild(li);
      });
    }
  
    handleError(message, error) {
      console.error(message, error);
      alert(`${message}: ${error.message || error}`);
    }
  }

  // Beim Klick auf ein Buch
div.addEventListener('click', () => {
  document.getElementById('bookTitleInput').value = book.title;
  document.getElementById('form-section').style.display = 'block'; // Formular sichtbar machen
  document.getElementById('thankYouMsg').classList.add('hidden'); // Erfolgsmeldung verstecken
  // Optional: Scrollen zum Formular
  document.getElementById('form-section').scrollIntoView({behavior: 'smooth'});
});
  // Initialisierung beim Laden der Seite
  document.addEventListener('DOMContentLoaded', () => {
    window.libraryApp = new LibraryApp();
  });
