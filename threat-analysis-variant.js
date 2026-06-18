const composer = document.querySelector(".composer");
const threatSelect = document.querySelector("#threat-select");
const threatPicker = document.querySelector("[data-threat-picker]");
const threatTrigger = document.querySelector("#threat-select-button");
const threatLabel = document.querySelector("[data-threat-label]");
const threatMenu = document.querySelector("#threat-options");
const threatOptions = Array.from(document.querySelectorAll(".threat-option"));
const promptText = document.querySelector("[data-threat-prompt]");
const promptTail = document.querySelector("[data-threat-tail]");
const questionOptions = document.querySelector("#question-options");

function setThreatMenuOpen(isOpen) {
  threatPicker.classList.toggle("is-open", isOpen);
  threatTrigger.setAttribute("aria-expanded", String(isOpen));
  threatMenu.hidden = !isOpen;
}

function focusSelectedThreat() {
  const selectedOption = threatOptions.find((option) => option.getAttribute("aria-selected") === "true");
  (selectedOption || threatOptions[0]).focus();
}

function selectThreat(option) {
  threatSelect.value = option.dataset.value;
  threatLabel.textContent = option.textContent.trim();

  threatOptions.forEach((item) => {
    item.setAttribute("aria-selected", String(item === option));
  });

  setThreatMenuOpen(false);
  updateThreatPrompt();
}

function focusThreatOption(offset) {
  const currentIndex = threatOptions.indexOf(document.activeElement);
  const nextIndex = currentIndex === -1
    ? 0
    : (currentIndex + offset + threatOptions.length) % threatOptions.length;

  threatOptions[nextIndex].focus();
}

function updateThreatPrompt() {
  const hasThreat = threatSelect.value !== "";

  composer.classList.toggle("is-expanded", hasThreat);
  promptText.textContent = hasThreat
    ? "Tell me more about"
    : "Do a deep dive on";
  promptTail.hidden = !hasThreat;
  questionOptions.hidden = !hasThreat;
  questionOptions.disabled = !hasThreat;
}

threatTrigger.addEventListener("click", () => {
  const shouldOpen = threatMenu.hidden;
  setThreatMenuOpen(shouldOpen);

  if (shouldOpen) {
    focusSelectedThreat();
  }
});

threatTrigger.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setThreatMenuOpen(true);
    focusSelectedThreat();
  }
});

threatOptions.forEach((option) => {
  option.addEventListener("click", () => {
    selectThreat(option);
    threatTrigger.focus();
  });

  option.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusThreatOption(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusThreatOption(-1);
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectThreat(option);
      threatTrigger.focus();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setThreatMenuOpen(false);
      threatTrigger.focus();
    }
  });
});

document.addEventListener("click", (event) => {
  if (!threatPicker.contains(event.target)) {
    setThreatMenuOpen(false);
  }
});

composer.addEventListener("submit", (event) => {
  event.preventDefault();
});

updateThreatPrompt();
