const STORAGE_KEY = 'BOOKSHELF_APPS';
const RENDER_EVENT = 'render-books';
const ADD_EVENT = 'add-book';

// Mendefinisikan fungsi addBookToShelf di luar event listener form
function addBookToShelf(book) {
    let shelfName = book.isComplete ? 'completeBookshelfList' : 'incompleteBookshelfList';
    let shelf = document.getElementById(shelfName);
    
    // Membuat elemen untuk buku
    let bookElement = document.createElement('article');
    bookElement.classList.add('book_item');
    bookElement.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div class="action">
            <button class="green">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
            <button class="red">Hapus buku</button>
        </div>`;
    
    // Menambahkan event listener untuk tombol "Selesai dibaca" dan "Hapus buku"
    let completeButton = bookElement.querySelector('.green');
    let deleteButton = bookElement.querySelector('.red');

    completeButton.addEventListener('click', function() {
        if (book.isComplete) {
            markAsUncomplete(book); // Ubah menjadi belum selesai
        } else {
            markAsComplete(book); // Ubah menjadi selesai
        }
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    deleteButton.addEventListener('click', function() {
        // Hapus buku dari rak
        deleteBook(book.id);
        document.dispatchEvent(new Event(RENDER_EVENT));
    });

    // Menambahkan elemen buku ke rak
    shelf.appendChild(bookElement);
}  

// Fungsi untuk mendapatkan data dari localStorage
function getBooksFromLocalStorage() {
    let booksData = localStorage.getItem(STORAGE_KEY);
    return booksData ? JSON.parse(booksData) : [];
}

// Fungsi untuk menyimpan data ke localStorage
function saveBooksToLocalStorage(books, event) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(event));
}


// Fungsi untuk menambahkan buku baru

function addBook(title, author, year, isComplete) {
    let books = getBooksFromLocalStorage();
    let newBook = {
        id: +new Date(),
        title,
        author,
        year: parseInt(year),
        isComplete
    };
    books.push(newBook);
    saveBooksToLocalStorage(books, ADD_EVENT); 
    renderBooks();
}


// Fungsi untuk menghapus buku berdasarkan ID
function deleteBook(bookId) {
    let books = getBooksFromLocalStorage();
    books = books.filter(book => book.id !== bookId);
    saveBooksToLocalStorage(books, RENDER_EVENT);
    renderBooks();
}

// Fungsi untuk memperbarui status isComplete buku berdasarkan ID
function updateBookStatus(bookId, isComplete) {
    let books = getBooksFromLocalStorage();
    let index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index].isComplete = isComplete;
        saveBooksToLocalStorage(books , RENDER_EVENT);
    }
    renderBooks();
}

// Fungsi untuk merender ulang rak buku
function renderBooks() {
    let books = getBooksFromLocalStorage();
    let incompleteShelf = document.getElementById('incompleteBookshelfList');
    let completeShelf = document.getElementById('completeBookshelfList');
    incompleteShelf.innerHTML = '';
    completeShelf.innerHTML = '';
    books.forEach(book => {
        if (book.isComplete) {
            addBookToShelf(book); 
        } else {
            addBookToShelf(book); 
        }
    });
}

// Fungsi untuk mencari buku berdasarkan judul
function searchBooks(keyword) {
    let books = getBooksFromLocalStorage();
    let searchResult = books.filter(book =>
        book.title.toLowerCase().includes(keyword.toLowerCase())
    );

    if (searchResult.length > 0) {
        renderSearchResult(searchResult);
    } else {
        alert('Buku tidak ditemukan!');
    }
}

// Fungsi untuk merender hasil pencarian
function renderSearchResult(books) {
    let searchResultContainer = document.getElementById('searchResult');
    if (!searchResultContainer) return; // Tambahkan ini untuk menangani jika elemen tidak ditemukan

    searchResultContainer.innerHTML = '';

    books.forEach(book => {
        let bookElement = document.createElement('div');
        bookElement.innerHTML = `
            <h3>${book.title}</h3>
            <p>Penulis: ${book.author}</p>
            <p>Tahun: ${book.year}</p>
        `;
        searchResultContainer.appendChild(bookElement);
    });
}

// Event listener untuk form pencarian
let searchForm = document.getElementById('searchBook');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let searchInput = document.getElementById('searchBookTitle').value;
    searchBooks(searchInput);
});

// Event listener untuk form tambah buku
let addForm = document.getElementById('inputBook');
addForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let title = document.getElementById('inputBookTitle').value;
    let author = document.getElementById('inputBookAuthor').value;
    let year = document.getElementById('inputBookYear').value;
    let isComplete = document.getElementById('inputBookIsComplete').checked;
    
    addBook(title, author, year, isComplete);
    renderBooks();

    addForm.reset();
});

// Panggil fungsi renderBooks saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderBooks);

// Mendefinisikan fungsi untuk cek localStorage
function isStorageExist() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

// Fungsi utama untuk memastikan localStorage tersedia
function main() {
    if (isStorageExist()) {
        return;
    }
}

// Fungsi untuk menandai buku sebagai selesai dibaca
function markAsComplete(book) {
    updateBookStatus(book.id, true);
}

// Fungsi untuk menandai buku sebagai belum selesai dibaca
function markAsUncomplete(book) {
    updateBookStatus(book.id, false);
}

// Panggil fungsi utama
main();
