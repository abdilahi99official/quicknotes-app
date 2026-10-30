// --- TASK 4: Validation, Delete & Count ---
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

let notes = [];

function getFormattedDate() {
    const now = new Date();
    return now.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function render() {
    notesList.textContent = "";

    // Update grammar count message
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    notes.forEach(note => {
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

        // Delete Button implementation
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

function addNote(event) {
    event.preventDefault();
    const text = noteInput.value.trim();
    const category = noteCategory.value;

    // Validation rules
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

    // Clear error on success
    errorMessage.textContent = "";
    errorMessage.classList.add("error-hidden");

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

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    render();
}

noteForm.addEventListener("submit", addNote);
render();
