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
        </div>
    `;
    
    // Menambahkan event listener untuk tombol "Selesai dibaca" dan "Hapus buku"
    let completeButton = bookElement.querySelector('.green');
    let deleteButton = bookElement.querySelector('.red');

    completeButton.addEventListener('click', function() {
        if (book.isComplete) {
            markAsUncomplete(book); // Ubah menjadi belum selesai
        } else {
            markAsComplete(book); // Ubah menjadi selesai
        }
    });

    deleteButton.addEventListener('click', function() {
        // Hapus buku dari rak
        deleteBook(book);
    });

    // Menambahkan elemen buku ke rak
    shelf.appendChild(bookElement);
}

// Mendapatkan data dari form
let form = document.getElementById('inputBook');
form.addEventListener('submit', function (e) { // Ubah 'bookSubmit' menjadi 'submit'
    e.preventDefault();
    let title = document.getElementById('inputBookTitle').value;
    let author = document.getElementById('inputBookAuthor').value;
    let year = document.getElementById('inputBookYear').value;
    let isComplete = document.getElementById('inputBookIsComplete').checked;
    let book = {
        title,
        author,
        year,
        isComplete
    };

    // Panggil fungsi addBookToShelf di sini
    addBookToShelf(book);

    // Menyimpan buku ke dalam localStorage
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    form.reset();
});

// Fungsi untuk memindahkan buku dari rak "Belum selesai dibaca" ke rak "Selesai dibaca"
function markAsComplete(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let index = books.findIndex(b => b.title === book.title && b.author === book.author && b.year === book.year);
    if (index !== -1) {
        books[index].isComplete = true;
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    }
}

// Fungsi untuk memindahkan buku dari rak "Selesai dibaca" ke rak "Belum selesai dibaca"
function markAsUncomplete(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let index = books.findIndex(b => b.title === book.title && b.author === book.author && b.year === book.year);
    if (index !== -1) {
        books[index].isComplete = false;
        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
    }
}

// Fungsi untuk menghapus buku dari rak
function deleteBook(book) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    books = books.filter(b => b.title !== book.title || b.author !== book.author || b.year !== book.year);
    localStorage.setItem('books', JSON.stringify(books));
    renderBooks();
}

// Fungsi untuk merender ulang rak buku
function renderBooks() {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let incompleteShelf = document.getElementById('incompleteBookshelfList');
    let completeShelf = document.getElementById('completeBookshelfList');
    incompleteShelf.innerHTML = '';
    completeShelf.innerHTML = '';
    books.forEach(book => {
        if (book.isComplete) {
            addBookToShelf(book); // Menambahkan ke rak "Selesai dibaca"
        } else {
            addBookToShelf(book); // Menambahkan ke rak "Belum selesai dibaca"
        }
    });
}

// Fungsi untuk mencari buku berdasarkan judul
function searchBooks(keyword) {
    let books = JSON.parse(localStorage.getItem('books')) || [];
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

// Panggil fungsi renderBooks saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderBooks);
