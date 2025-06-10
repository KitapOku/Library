// Main Application JavaScript with optimizations
class LibraryApp {
  constructor() {
    this.db = null;
    this.app = null;
    this.booksLoaded = false;
    this.firebaseLoaded = false;
    
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
      
      // Firebase configuration
      const firebaseConfig = {
        apiKey: "AIzaSyBBGhn-V58ufgbSGsoL6lLONX09QJKm2sE",
        authDomain: "bibliothek-38373.firebaseapp.com",
        projectId: "bibliothek-38373",
        storageBucket: "bibliothek-38373.firebasestorage.app",
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
      this.handleError('Firebase-Ladehfehler', error);
      throw error;
    
