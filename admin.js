class AdminPanel {
    constructor() {
      this.auth = null;
      this.db = null;
      this.currentUser = null;
      this.editingBookId = null;
      this.firebaseModules = {};
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
            storageBucket: "bibliothek-38373.appspot.com",
            messagingSenderId: "188405615349",
            appId: "1:188405615349:web:715db2a75ea95cc0c6d3bc",
            measurementId: "G-NR98T0L5RW"
        };
  
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
  
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
  
        console.log('Firebase geladen');
      } catch (error) {
        this.handleError('Firebase konnte nicht geladen werden', error);
      }
    }
  
    setupEventListeners() {
      // Beispiel: Login-Formular
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const email = loginForm.elements['email'].value;
          const password = loginForm.elements['password'].value;
          try {
            await this.firebaseModules.signInWithEmailAndPassword(this.auth, email, password);
          } catch (error) {
            this.handleError('Login fehlgeschlagen', error);
          }
        });
      }
  
      // Beispiel: Logout-Button
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
          try {
            await this.firebaseModules.signOut(this.auth);
          } catch (error) {
            this.handleError('Logout fehlgeschlagen', error);
          }
        });
      }
  
      // Weitere Event-Listener für CRUD-Operationen hier ergänzen...
    }
  
    setupAuthStateListener() {
      this.firebaseModules.onAuthStateChanged(this.auth, (user) => {
        this.currentUser = user;
        if (user) {
          console.log('Angemeldet als:', user.email);
          this.loadBooks();
          // UI anpassen: Admin-Bereich anzeigen
        } else {
          console.log('Nicht angemeldet');
          // UI anpassen: Login-Formular anzeigen
        }
      });
    }


  
    async loadBooks() {
      try {
        const q = this.firebaseModules.query(
          this.firebaseModules.collection(this.db, 'books'),
          this.firebaseModules.orderBy('createdAt', 'desc')
        );
        const querySnapshot = await this.firebaseModules.getDocs(q);
        const books = [];
        querySnapshot.forEach((doc) => {
          books.push({ id: doc.id, ...doc.data() });
        });
        this.renderBooks(books);
      } catch (error) {
        this.handleError('Bücher konnten nicht geladen werden', error);
      }
    }
  
    async addBook(bookData) {
      try {
        await this.firebaseModules.addDoc(
          this.firebaseModules.collection(this.db, 'books'),
          { ...bookData, createdAt: this.firebaseModules.serverTimestamp() }
        );
        this.loadBooks();
      } catch (error) {
        this.handleError('Buch konnte nicht hinzugefügt werden', error);
      }
    }
  
    async updateBook(bookId, bookData) {
      try {
        const bookRef = this.firebaseModules.doc(this.db, 'books', bookId);
        await this.firebaseModules.updateDoc(bookRef, bookData);
        this.loadBooks();
      } catch (error) {
        this.handleError('Buch konnte nicht aktualisiert werden', error);
      }
    }
  
    async deleteBook(bookId) {
      try {
        const bookRef = this.firebaseModules.doc(this.db, 'books', bookId);
        await this.firebaseModules.deleteDoc(bookRef);
        this.loadBooks();
      } catch (error) {
        this.handleError('Buch konnte nicht gelöscht werden', error);
      }
    }

// Status-Formular Logik
const statusForm = document.getElementById('status-form');
const statusSelect = document.getElementById('status-select');
const datePicker = document.getElementById('date-picker');
const availableDate = document.getElementById('available-date');

// Datumsauswahl anzeigen/verstecken
statusSelect.addEventListener('change', () => {
  datePicker.style.display = statusSelect.value === 'availableFrom' 
    ? 'block' 
    : 'none';
});

// Buchstatus aktualisieren
statusForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const selectedStatus = statusSelect.value;
  const updateData = {
    status: selectedStatus
  };

  if (selectedStatus === 'availableFrom') {
    if (!availableDate.value) {
      alert('Bitte ein Datum auswählen!');
      return;
    }
    updateData.availableFrom = firebase.firestore.Timestamp.fromDate(
      new Date(availableDate.value)
    );
  } else {
    updateData.availableFrom = null;
  }

  try {
    await updateDoc(doc(db, 'books', selectedBookId), updateData);
    loadBooks(); // Bücherliste neu laden
    statusForm.reset();
  } catch (error) {
    console.error('Fehler beim Status-Update:', error);
  }
});


    
    renderBooks(books) {
      // Beispiel: Bücherliste im DOM anzeigen
      const booksList = document.getElementById('booksList');
      if (!booksList) return;
      booksList.innerHTML = '';
      books.forEach(book => {
        const li = document.createElement('li');
        li.textContent = `${book.title} von ${book.author}`;
        // Buttons für Bearbeiten/Löschen ergänzen...
        booksList.appendChild(li);
      });
    }

function renderBooks(books) {
  booksContainer.innerHTML = '';
  
  books.forEach(book => {
    const statusBadge = getStatusBadge(book);
    const bookCard = `
      <div class="book-card" data-id="${book.id}">
        <h3>${book.title}</h3>
        <p>${book.author}</p>
        ${statusBadge}
        <button class="edit-status">Status bearbeiten</button>
      </div>
    `;
    booksContainer.innerHTML += bookCard;
  });

  // Event-Listener für Bearbeiten-Buttons
  document.querySelectorAll('.edit-status').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedBookId = btn.closest('.book-card').dataset.id;
      // Hier könntest du das Formular mit aktuellen Werten vorausfüllen
    });
  });
}

function getStatusBadge(book) {
  const statusConfig = {
    available: { text: 'Verfügbar', color: 'green' },
    reserved: { text: 'Reserviert', color: 'orange' },
    availableFrom: { 
      text: `Verfügbar ab ${book.availableFrom?.toDate().toLocaleDateString()}`, 
      color: 'blue' 
    }
  };

  const config = statusConfig[book.status] || {};
  return `<span class="status-badge" style="background:${config.color}">
    ${config.text}
  </span>`;
}

    handleError(message, error) {
      console.error(message, error);
      alert(`${message}: ${error.message || error}`);
    }
  }
  
  // Initialisierung beim Laden der Seite
  document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
  });
