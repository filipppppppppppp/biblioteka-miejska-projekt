// --- ZMIENNE ELEMENTÓW ---
const btnContrast = document.getElementById("btn-contrast");
const btnFont = document.getElementById("btn-font");
const btnSpeech = document.getElementById("btn-speech");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsDiv = document.getElementById("search-results");

// --- 1. WYSOKI KONTRAST ---
btnContrast.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
  btnContrast.classList.toggle("active");
});

// --- 2. POWIĘKSZANIE CZCIONKI ---
btnFont.addEventListener("click", () => {
  document.body.classList.toggle("large-font");
  btnFont.classList.toggle("active");
});

// --- 3. LEKTOR ---
let isSpeaking = false;
btnSpeech.addEventListener("click", () => {
  if (!("speechSynthesis" in window)) {
    alert("Twoja przeglądarka nie obsługuje funkcji czytania.");
    return;
  }
  if (isSpeaking) {
    window.speechSynthesis.cancel();
    isSpeaking = false;
    btnSpeech.textContent = "🔊 Czytaj stronę";
    btnSpeech.classList.remove("active");
  } else {
    window.speechSynthesis.cancel();
    const textToRead = document.querySelector("main").innerText;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = "pl-PL";
    utterance.rate = 1;
    utterance.onend = () => {
      isSpeaking = false;
      btnSpeech.textContent = "🔊 Czytaj stronę";
      btnSpeech.classList.remove("active");
    };
    window.speechSynthesis.speak(utterance);
    isSpeaking = true;
    btnSpeech.textContent = "⏹ Zatrzymaj czytanie";
    btnSpeech.classList.add("active");
  }
});

// --- 4. WYSZUKIWARKA (BAZA DANYCH) ---

// Nasza "baza danych" książek
const libraryDatabase = [
  {
    title: "Pan Tadeusz",
    author: "Adam Mickiewicz",
    type: "Książka",
    status: "Dostępna",
  },
  {
    title: "Dziady cz. III",
    author: "Adam Mickiewicz",
    type: "E-book",
    status: "Dostępna online",
  },
  {
    title: "Konrad Wallenrod",
    author: "Adam Mickiewicz",
    type: "Audiobook",
    status: "Wypożyczona",
  },
  {
    title: "Balladyna",
    author: "Juliusz Słowacki",
    type: "Książka",
    status: "Dostępna",
  },
  {
    title: "Kordian",
    author: "Juliusz Słowacki",
    type: "E-book",
    status: "Dostępna online",
  },
  {
    title: "Lalka",
    author: "Bolesław Prus",
    type: "Książka",
    status: "Dostępna",
  },
  {
    title: "Potop",
    author: "Henryk Sienkiewicz",
    type: "Audiobook",
    status: "Dostępna",
  },
  {
    title: "Quo Vadis",
    author: "Henryk Sienkiewicz",
    type: "Książka",
    status: "Wypożyczona",
  },
  {
    title: "Ogniem i Mieczem",
    author: "Henryk Sienkiewicz",
    type: "E-book",
    status: "Dostępna online",
  },
];

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim().toLowerCase();

  if (query.length === 0) {
    alert("Proszę wpisać frazę do wyszukania.");
    return;
  }

  // Filtrowanie bazy danych
  // Sprawdzamy czy tytuł LUB autor zawiera wpisaną frazę
  const results = libraryDatabase.filter(
    (item) =>
      item.title.toLowerCase().includes(query) ||
      item.author.toLowerCase().includes(query)
  );

  resultsDiv.style.display = "block";

  if (results.length > 0) {
    // Jeśli znaleziono książki
    let htmlContent = `<h3>Wyniki wyszukiwania dla: "${searchInput.value}"</h3><ul style="list-style: none; padding: 0;">`;

    results.forEach((book) => {
      // Kolor paska zależy od typu (tylko wizualny bajer)
      let borderColor = "#004a8f";
      if (book.type === "Audiobook") borderColor = "#e6b800";
      if (book.type === "E-book") borderColor = "#28a745";

      htmlContent += `
                <li style="background:rgba(255,255,255,0.1); padding:10px; margin-bottom:5px; border-left:4px solid ${borderColor}; border-bottom: 1px solid #eee;">
                    <strong>${book.type}:</strong> "${book.title}" - ${book.author} <br>
                    <small>Status: ${book.status}</small>
                </li>
            `;
    });

    htmlContent += `</ul>`;
    resultsDiv.innerHTML = htmlContent;
  } else {
    // Jeśli NIC nie znaleziono (np. wpisano "dupa")
    resultsDiv.innerHTML = `
            <h3>Wyniki wyszukiwania dla: "${searchInput.value}"</h3>
            <div style="padding: 15px; background: #ffe6e6; border-left: 4px solid #cc0000; color: #cc0000;">
                <strong>Brak wyników.</strong> <br>
                Niestety, nie posiadamy tej pozycji w naszych zbiorach.
                Sprawdź pisownię lub spróbuj wpisać innego autora (np. Mickiewicz, Sienkiewicz).
            </div>
        `;
  }

  // Przenieś fokus (dla czytników ekranu)
  resultsDiv.focus();
});

// --- 5. OBSŁUGA MODALI ---
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    modal.querySelector("button, input").focus();
  }
}
function closeModal(modalElement) {
  modalElement.classList.remove("open");
}
const btnEvent = document.getElementById("btn-event-details");
const btnContact = document.getElementById("btn-open-contact");
if (btnEvent)
  btnEvent.addEventListener("click", () => openModal("modal-event"));
if (btnContact)
  btnContact.addEventListener("click", () => openModal("modal-contact"));

document.querySelectorAll(".close-modal").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const modal = e.target.closest(".modal-overlay");
    closeModal(modal);
  });
});
document.querySelectorAll(".modal-overlay").forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });
});
const contactForm = document.getElementById("real-contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Wiadomość została wysłana! Dziękujemy.");
    const modal = document.getElementById("modal-contact");
    closeModal(modal);
    contactForm.reset();
  });
}
