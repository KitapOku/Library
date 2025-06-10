// admin.js
class AdminPanel {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.selectedBookId = null;
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
      const { 
        getAuth, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged 
      } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js');
      
      const { 
        getFirestore,
        collection,
        addDoc,
        getDocs,
        doc,
        updateDoc,
        deleteDoc,
        serverTimestamp,
        query,
        orderBy,
        Timestamp
      } = await import('https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js');

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
        updateDoc,
        deleteDoc,
        serverTimestamp,
        query,
        orderBy,
        Timestamp
      };

    } catch (error) {
      this.handleError('Firebase konnte nicht geladen werden', error);
    }
  }

  setupEventListeners() {
    // Login-Formular
    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      try {
        await this.firebaseModules.signInWithEmailAndPassword(this.auth, email, password);
      } catch (error) {
        this.handleError('Login fehlgeschlagen', error);
      }
    });

    // Logout-Button
    document.getElementById('logout-btn').addEventListener('click', async () => {
      try {
        await this.firebaseModules.signOut(this.auth);
      } catch (error) {
        this.handleError('Logout fehlgeschlagen', error);
      }
    });

    // Buch hinzufügen
    document.getElementById('book-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        await this.firebaseModules.addDoc(
          this.firebaseModules.collection(this.db, 'books'), 
          {
            title: formData.get('title'),
            author: formData.get('author'),
            cover: formData.get('cover'),
            status: 'available',
            createdAt: this.firebaseModules.serverTimestamp()
          }
        );
        this.loadBooks();
        e.target.reset();
      } catch (error) {
        this.handleError('Buch konnte nicht hinzugefügt werden', error);
      }
    });

    // Status-Formular
    document.getElementById('status-select').addEventListener('change', (e) => {
      document.getElementById('date-picker').style.display = 
        e.target.value === 'availableFrom' ? 'block' : 'none';
    });

    document.getElementById('status-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const updateData = {
          status: document.getElementById('status-select').value
        };

        if (updateData.status === 'availableFrom') {
          const dateValue = document.getElementById('available-date').value;
          if (!dateValue) {
            alert('Bitte Datum auswählen!');
            return;
          }
          updateData.availableFrom = this.firebaseModules.Timestamp.fromDate(new Date(dateValue));
        }

        await this.firebaseModules.updateDoc(
          this.firebaseModules.doc(this.db, 'books', this.selectedBookId),
          updateData
        );
        this.loadBooks();
        e.target.reset();
      } catch (error) {
        this.handleError('Statusaktualisierung fehlgeschlagen', error);
      }
    });
  }

  setupAuthStateListener() {
    this.firebaseModules.onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUser = user;
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        this.loadBooks();
      } else {
        this.currentUser = null;
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
      }
    });
  }

  async loadBooks() {
    try {
      const booksContainer = document.getElementById('books');
      booksContainer.innerHTML = 'Lade Bücher...';

      const q = this.firebaseModules.query(
        this.firebaseModules.collection(this.db, 'books'),
        this.firebaseModules.orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await this.firebaseModules.getDocs(q);
      booksContainer.innerHTML = '';
      
      querySnapshot.forEach(doc => {
        const book = doc.data();
        const bookElement = this.createBookElement(doc.id, book);
        booksContainer.appendChild(bookElement);
      });

    } catch (error) {
      this.handleError('Fehler beim Laden der Bücher', error);
    }
  }

  createBookElement(id, book) {
    const div = document.createElement('div');
    div.className = 'book-item';
    div.dataset.id = id;
    
    const statusBadge = this.getStatusBadge(book);
    
    div.innerHTML = `
      <h3>${book.title}</h3>
      <p>${book.author}</p>
      ${statusBadge}
      <button class="edit-btn">Bearbeiten</button>
      <button class="delete-btn">Löschen</button>
    `;

    div.querySelector('.delete-btn').addEventListener('click', async () => {
      if (confirm('Buch wirklich löschen?')) {
        await this.firebaseModules.deleteDoc(
          this.firebaseModules.doc(this.db, 'books', id)
        );
        this.loadBooks();
      }
    });

    div.querySelector('.edit-btn').addEventListener('click', () => {
      this.selectedBookId = id;
      document.getElementById('status-select').value = book.status;
      if (book.availableFrom) {
        document.getElementById('available-date').value = 
          book.availableFrom.toDate().toISOString().split('T')[0];
      }
      document.getElementById('status-form').scrollIntoView();
    });

    return div;
  }

  getStatusBadge(book) {
    let statusText = '';
    let statusClass = '';
    
    switch (book.status) {
      case 'available':
        statusText = 'Verfügbar';
        statusClass = 'available';
        break;
      case 'reserved':
        statusText = 'Reserviert';
        statusClass = 'reserved';
        break;
      case 'availableFrom':
        const date = book.availableFrom?.toDate().toLocaleDateString();
        statusText = `Verfügbar ab ${date}`;
        statusClass = 'availableFrom';
        break;
      default:
        statusText = 'Unbekannter Status';
        statusClass = 'unknown';
    }

    return `<span class="status-badge ${statusClass}">${statusText}</span>`;
  }

  handleError(message, error) {
    console.error(`${message}:`, error);
    alert(`${message}: ${error.message}`);
  }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
  window.adminPanel = new AdminPanel();
});
