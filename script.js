const CONFIG = {
  whatsappNumber: "918197727417", // Replace with Antara's real WhatsApp number, country code + number, no + or spaces.
  businessName: "Antara Travel Planner"
};

const state = {
  step: 1,
  answers: {
    destination: "",
    destinationText: "",
    fromCity: "",
    travelDate: "",
    days: "",
    travellers: "",
    travellerCount: 2,
    budget: "",
    needs: [],
    name: "",
    phone: "",
    email: ""
  },
  lastWhatsAppMessage: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const tripForm = $("#tripForm");
const steps = $$(".step");
const nextBtn = $("#nextBtn");
const backBtn = $("#backBtn");
const submitBtn = $("#submitBtn");
const progressBar = $("#progressBar");
const stepLabel = $("#stepLabel");
const progressPercent = $("#progressPercent");

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function updateProgress() {
  const percent = Math.round((state.step / steps.length) * 100);
  stepLabel.textContent = `Step ${state.step} of ${steps.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  steps.forEach(step => step.classList.toggle("active", Number(step.dataset.step) === state.step));
  backBtn.disabled = state.step === 1;

  if (state.step === steps.length) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function saveCurrentInputs() {
  state.answers.destinationText = $("#destinationText")?.value.trim() || "";
  state.answers.fromCity = $("#fromCity")?.value.trim() || "";
  state.answers.travelDate = $("#travelDate")?.value || "";
  state.answers.travellerCount = $("#travellerCount")?.value || "2";
  state.answers.name = $("#name")?.value.trim() || "";
  state.answers.phone = $("#phone")?.value.trim() || "";
  state.answers.email = $("#email")?.value.trim() || "";
  state.answers.needs = $$('input[name="need"]:checked').map(el => el.value);
}

function validateStep() {
  saveCurrentInputs();

  if (state.step === 1) {
    if (!state.answers.destination && !state.answers.destinationText) {
      showToast("Choose a destination option or type a destination.");
      return false;
    }
  }

  if (state.step === 2 && !state.answers.fromCity) {
    showToast("Please enter your city / town.");
    return false;
  }

  if (state.step === 3 && !state.answers.travelDate) {
    showToast("Please choose your departure date.");
    return false;
  }

  if ([4, 5, 6].includes(state.step)) {
    const map = {4:"days", 5:"travellers", 6:"budget"};
    if (!state.answers[map[state.step]]) {
      showToast("Please select one option to continue.");
      return false;
    }
  }

  if (state.step === 7) {
    if (!state.answers.name || !state.answers.phone) {
      showToast("Please enter your name and WhatsApp number.");
      return false;
    }
  }

  return true;
}

function nextStep() {
  if (!validateStep()) return;
  if (state.step < steps.length) {
    state.step++;
    updateProgress();
  }
}

function previousStep() {
  saveCurrentInputs();
  if (state.step > 1) {
    state.step--;
    updateProgress();
  }
}

$$(".choice").forEach(button => {
  button.addEventListener("click", () => {
    const field = button.dataset.field;
    $$(`.choice[data-field="${field}"]`).forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    state.answers[field] = button.dataset.value;
  });
});

$$(".style-card").forEach(card => {
  card.addEventListener("click", () => {
    $$(".style-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    const style = card.dataset.style;
    const messages = {
      Family: "Best family trips from Karnataka → Get a personalised family itinerary.",
      Couple: "Romantic escapes with the right pace → Let Antara shape your couple getaway.",
      Adventure: "More thrill, less routine → Tell Antara how adventurous you want to be.",
      Beach: "Sun, sand and slow mornings → We'll find a beach trip that fits your budget.",
      Nature: "Green, quiet and restorative → Explore nature-first escapes.",
      Solo: "Your pace, your story → Build a flexible solo itinerary around your interests."
    };
    $("#styleResult").innerHTML = `<span>${style} →</span> ${messages[style]}`;
  });
});

$$(".card-link").forEach(button => {
  button.addEventListener("click", () => {
    state.answers.destination = button.dataset.destination;
    $("#destinationText").value = button.dataset.destination;
    state.step = 1;
    updateProgress();
    document.querySelector("#planner").scrollIntoView({behavior:"smooth"});
    showToast(`${button.dataset.destination} selected. Tell us the rest.`);
  });
});

function getLeadStatus() {
  const a = state.answers;
  const hasDates = Boolean(a.travelDate);
  const hasDestination = Boolean(a.destinationText || (a.destination && a.destination !== "Suggest a destination"));
  const hasBudget = Boolean(a.budget);

  if (hasDates && hasDestination && hasBudget) return "HOT";
  if (hasDestination || hasDates || hasBudget) return "WARM";
  return "COLD";
}

function buildMessage() {
  const a = state.answers;
  const destination = a.destinationText || a.destination || "Please suggest a destination";
  const needs = a.needs.length ? a.needs.join(", ") : "Not specified";
  return [
    `Hi Antara! I just submitted a trip request.`,
    ``,
    `Name: ${a.name}`,
    `Destination: ${destination}`,
    `Travelling from: ${a.fromCity || "Not specified"}`,
    `Travel date: ${a.travelDate || "Not specified"}`,
    `Duration: ${a.days || "Not specified"}`,
    `Travelling with: ${a.travellers || "Not specified"}`,
    `Travellers: ${a.travellerCount || "Not specified"}`,
    `Budget: ${a.budget || "Not specified"}`,
    `Need: ${needs}`,
    `WhatsApp: ${a.phone}`,
    `Email: ${a.email || "Not provided"}`,
    ``,
    `Lead status: ${getLeadStatus()}`
  ].join("\n");
}

function openWhatsApp(message) {
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!validateStep()) return;

  const message = buildMessage();
  state.lastWhatsAppMessage = message;
  localStorage.setItem("antaraLastTripRequest", JSON.stringify({
    ...state.answers,
    leadStatus: getLeadStatus(),
    createdAt: new Date().toISOString()
  }));

  const lead = getLeadStatus();
  $("#leadBadge").textContent = `${lead} LEAD`;
  $("#successText").textContent =
    lead === "HOT"
      ? "Your request has strong booking details. Antara can follow up with a quote and next steps."
      : lead === "WARM"
        ? "Your request has useful planning details. Antara can follow up with suggestions and refine the trip."
        : "Your request is saved. Antara can start with destination ideas and general guidance.";

  $("#successModal").classList.remove("hidden");
  $("#successModal").setAttribute("aria-hidden", "false");
});

$("#whatsappAfterSubmit").addEventListener("click", () => openWhatsApp(state.lastWhatsAppMessage));

nextBtn.addEventListener("click", nextStep);
backBtn.addEventListener("click", previousStep);

$("#quizTrigger").addEventListener("click", () => {
  $("#quizModal").classList.remove("hidden");
  $("#quizModal").setAttribute("aria-hidden", "false");
});

$$("[data-close]").forEach(el => {
  el.addEventListener("click", () => {
    const type = el.dataset.close;
    const modal = type === "quiz" ? $("#quizModal") : $("#successModal");
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  });
});

$$("[data-quiz]").forEach(button => {
  button.addEventListener("click", () => {
    const style = button.dataset.quiz;
    const suggestions = {
      Family: "Try Coorg, Wayanad or a relaxed Kerala escape. Want us to build a family itinerary?",
      Adventure: "Try Chikmagalur, Coorg or a Western Ghats adventure.",
      Beach: "Try Goa, Gokarna or coastal Karnataka for a slower beach escape.",
      Nature: "Try Coorg, Wayanad or the hill country around Chikmagalur.",
      Couple: "Try Coorg, Gokarna or a boutique Kerala escape.",
      Solo: "Try Goa, Hampi or a flexible coastal Karnataka trip."
    };
    $("#quizResult").innerHTML = `<strong>${style} traveller?</strong><br>${suggestions[style]}<br><br><button class="btn btn-dark" id="quizPlanBtn">Plan this trip →</button>`;
    $("#quizResult").classList.remove("hidden");
    $("#quizPlanBtn").addEventListener("click", () => {
      $("#quizModal").classList.add("hidden");
      $("#quizResult").classList.add("hidden");
      state.answers.destination = "Suggest a destination";
      state.step = 1;
      updateProgress();
      document.querySelector("#planner").scrollIntoView({behavior:"smooth"});
    });
  });
});

$$("[data-wa]").forEach(button => {
  button.addEventListener("click", () => {
    const option = button.dataset.wa;
    const message = `Hi Antara! I need help with: ${option}.\n\nPlease guide me with the next steps.`;
    openWhatsApp(message);
  });
});

$("#floatingWa").addEventListener("click", () => {
  openWhatsApp("Hi Antara! Thanks for reaching out. I'd like help planning my trip.");
});

$("#menuToggle").addEventListener("click", () => {
  $("#mainNav").classList.toggle("open");
});

$$(".main-nav a").forEach(link => {
  link.addEventListener("click", () => $("#mainNav").classList.remove("open"));
});

// Set a sensible minimum date for the trip planner.
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
$("#travelDate").min = today.toISOString().slice(0,10);

updateProgress();
