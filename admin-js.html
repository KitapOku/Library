// Admin Panel JavaScript with enhanced security and functionality
class AdminPanel {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.editingBookId = null;
    
    this.init();
  }

  async init() {
    try {
      await this.loadFirebase();
      this.setupEventListeners();
      this.setupAuthStateListener();
    } catch (error) {
      this.handleError('Initialisierungsfehler', error);
    }
  }

  async loadFirebase() {
    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js');
      const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js');
      const { getFirestore, collection, addDoc, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js');

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
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      
      // Store Firebase modules for use throughout the class
      this.firebaseModules = {
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
        collection,
        addDoc,
        getDocs,
        doc,
        getDoc,
        setDoc,
        updateDoc,
        deleteDoc,
        serverTimestamp,
        query,
        orderBy
      };

      console.log('Firebase loaded successfully');
    } catch (
