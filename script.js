// --- TASK 3: Core Setup & Rendering ---
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");

// In-memory notes array
let notes = [];

// Helper to generate a readable timestamp
function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Render notes to the DOM securely
function render() {
    notesList.textContent = "";

    notes.forEach(note => {
        const li = document.createElement("li");
        li.className = `note-card category-${note.category}`;

        const contentDiv = document.createElement("div");
        contentDiv.className = "note-content";

        const textP = document.createElement("p");
        textP.className = "note-text";
        textP.textContent = note.text; // Safe from XSS

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

        li.appendChild(contentDiv);
        notesList.appendChild(li);
    });
}

// Add note event handler
function addNote(event) {
    event.preventDefault();
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: getFormattedDate()
    };

    notes.unshift(newNote);
    render();

    noteInput.value = "";
    noteInput.focus();
}

noteForm.addEventListener("submit", addNote);
render();
