// --- TASK 5: Persistence & Search (Final script.js) ---
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const clearAllBtn = document.querySelector("#clear-all-btn");

// Load notes from localStorage or initialize empty array
let notes = JSON.parse(localStorage.getItem("quicknotes")) || [];

function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function render(notesToDisplay = notes) {
    notesList.textContent = "";

    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
        if (clearAllBtn) clearAllBtn.style.display = "none";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
        if (clearAllBtn) clearAllBtn.style.display = "block";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
        if (clearAllBtn) clearAllBtn.style.display = "block";
    }

    // Handle empty search results state
    if (notesToDisplay.length === 0 && notes.length > 0) {
        const emptySearchLi = document.createElement("li");
        emptySearchLi.textContent = "No notes match your search.";
        emptySearchLi.style.padding = "1rem";
        emptySearchLi.style.textAlign = "center";
        emptySearchLi.style.color = "#64748b";
        notesList.appendChild(emptySearchLi);
        return;
    }

    notesToDisplay.forEach(note => {
        const li = document.createElement("li");
        li.className = `note-card category-${note.category}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const textP = document.createElement("p");
        textP.className = "note-text";
        textP.textContent = note.text;

        const metaDiv = document.createElement("div");
        metaDiv.className = "note-meta";

        const badgeSpan = document.createElement("span");
        badgeSpan.className = "note-badge";
        badgeSpan.textContent = note.category;

        const dateSpan = document.createElement("span");
        dateSpan.textContent = note.createdAt;

        metaDiv.appendChild(badgeSpan);
        metaDiv.appendChild(dateSpan);
        contentDiv.appendChild(textP);
        contentDiv.appendChild(metaDiv);

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => deleteNote(note.id));

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        notesList.appendChild(li);
    });
}

// Save to localStorage helper
function saveNotes() {
    localStorage.setItem("quicknotes", JSON.stringify(notes));
}

function addNote(event) {
    event.preventDefault();
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        errorMessage.classList.remove("error-hidden");
        return;
    }

    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        errorMessage.classList.remove("error-hidden");
        return;
    }

    errorMessage.textContent = "";
    errorMessage.classList.add("error-hidden");

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: getFormattedDate()
    };

    notes.unshift(newNote);
    saveNotes(); // Save state
    render();

    noteInput.value = "";
    noteInput.focus();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes(); // Save state

    // Re-apply search filter if user is actively searching
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        handleSearch();
    } else {
        render();
    }
}

// Live search handler
function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
        render(notes);
        return;
    }
    const filtered = notes.filter(note => note.text.toLowerCase().includes(query));
    render(filtered);
}

// Event Listeners
noteForm.addEventListener("submit", addNote);
searchInput.addEventListener("input", handleSearch);

if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
        if (confirm("Delete all notes?")) {
            notes = [];
            saveNotes();
            render();
            searchInput.value = "";
        }
    });
}

// Initial page load render
render();
