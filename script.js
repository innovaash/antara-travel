const CONFIG = {
  whatsappNumber: "918197727417",
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


/* =========================
   TOAST
========================= */

function showToast(message) {
  const toast = $("#toast");

  // If toast doesn't exist, don't crash the website
  if (!toast) {
    alert(message);
    return;
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}


/* =========================
   ANTARA COLOUR THEMES
========================= */

const antaraThemes = {
  sunset: {
    background: "#fff7ed",
    text: "#222222",
    accent: "#d97706",
    muted: "#666666"
  },

  ocean: {
    background: "#eff9ff",
    text: "#102a43",
    accent: "#0284c7",
    muted: "#52606d"
  },

  tropical: {
    background: "#f0fdf4",
    text: "#14532d",
    accent: "#16a34a",
    muted: "#52705a"
  },

  lavender: {
    background: "#faf5ff",
    text: "#3b0764",
    accent: "#9333ea",
    muted: "#6b5b73"
  },

  rose: {
    background: "#fff1f2",
    text: "#4c0519",
    accent: "#e11d48",
    muted: "#76515c"
  }
};


function changeAntaraTheme(themeName) {
  const theme = antaraThemes[themeName];

  if (!theme) {
    console.log("Theme not found");
    return;
  }

  const root = document.documentElement;

  root.style.setProperty("--about-bg", theme.background);
  root.style.setProperty("--about-text", theme.text);
  root.style.setProperty("--about-accent", theme.accent);
  root.style.setProperty("--about-muted", theme.muted);
}

changeAntaraTheme("sunset");


/* =========================
   FORM PROGRESS
========================= */

function updateProgress() {
  const percent = Math.round(
    (state.step / steps.length) * 100
  );

  stepLabel.textContent = `Step ${state.step} of ${steps.length}`;
  progressPercent.textContent = `${percent}%`;
  progressBar.style.width = `${percent}%`;

  steps.forEach(step => {
    step.classList.toggle(
      "active",
      Number(step.dataset.step) === state.step
    );
  });

  backBtn.disabled = state.step === 1;

  if (state.step === steps.length) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}


/* =========================
   SAVE FORM INPUTS
========================= */

function saveCurrentInputs() {

  state.answers.destinationText =
    $("#destinationText")?.value.trim() || "";

  state.answers.fromCity =
    $("#fromCity")?.value.trim() || "";

  state.answers.travelDate =
    $("#travelDate")?.value || "";

  state.answers.travellerCount =
    $("#travellerCount")?.value || "2";

  state.answers.name =
    $("#name")?.value.trim() || "";

  state.answers.phone =
    $("#phone")?.value.trim() || "";

  state.answers.email =
    $("#email")?.value.trim() || "";

  state.answers.needs =
    $$('input[name="need"]:checked')
      .map(el => el.value);
}


/* =========================
   VALIDATE CURRENT STEP
========================= */

function validateStep() {

  saveCurrentInputs();

  // STEP 1
  if (state.step === 1) {

    if (
      !state.answers.destination &&
      !state.answers.destinationText
    ) {
      showToast(
        "Choose a destination option or type a destination."
      );

      return false;
    }
  }


  // STEP 2
  if (state.step === 2) {

    if (!state.answers.fromCity) {

      showToast(
        "Please enter your city / town."
      );

      return false;
    }
  }


  // STEP 3
  if (state.step === 3) {

    if (!state.answers.travelDate) {

      showToast(
        "Please choose your departure date."
      );

      return false;
    }
  }


  // STEP 4, 5, 6
  if ([4, 5, 6].includes(state.step)) {

    const map = {
      4: "days",
      5: "travellers",
      6: "budget"
    };

    if (!state.answers[map[state.step]]) {

      showToast(
        "Please select one option to continue."
      );

      return false;
    }
  }


  // STEP 7
  if (state.step === 7) {

    if (
      !state.answers.name ||
      !state.answers.phone
    ) {

      showToast(
        "Please enter your name and WhatsApp number."
      );

      return false;
    }
  }

  return true;
}


/* =========================
   NEXT / BACK
========================= */

function nextStep() {

  if (!validateStep()) return;

  if (state.step < steps.length) {

    state.step++;

    updateProgress();

    window.scrollTo({
      top: document.querySelector("#planner").offsetTop - 80,
      behavior: "smooth"
    });
  }
}


function previousStep() {

  saveCurrentInputs();

  if (state.step > 1) {

    state.step--;

    updateProgress();
  }
}


/* =========================
   CHOICE BUTTONS
========================= */

$$(".choice").forEach(button => {

  button.addEventListener("click", () => {

    const field = button.dataset.field;

    $$(`.choice[data-field="${field}"]`)
      .forEach(item => {
        item.classList.remove("selected");
      });

    button.classList.add("selected");

    state.answers[field] =
      button.dataset.value;
  });

});


/* =========================
   TRAVEL STYLE
========================= */

$$(".style-card").forEach(card => {

  card.addEventListener("click", () => {

    $$(".style-card").forEach(c => {
      c.classList.remove("active");
    });

    card.classList.add("active");

    const style = card.dataset.style;

    const messages = {

      Family:
        "Best family trips from Karnataka → Get a personalised family itinerary.",

      Couple:
        "Romantic escapes with the right pace → Let Antara shape your couple getaway.",

      Adventure:
        "More thrill, less routine → Tell Antara how adventurous you want to be.",

      Beach:
        "Sun, sand and slow mornings → We'll find a beach trip that fits your budget.",

      Nature:
        "Green, quiet and restorative → Explore nature-first escapes.",

      Solo:
        "Your pace, your story → Build a flexible solo itinerary around your interests."
    };

    $("#styleResult").innerHTML =
      `<span>${style} →</span> ${messages[style]}`;
  });

});


/* =========================
   DESTINATION CARDS
========================= */

$$(".card-link").forEach(button => {

  button.addEventListener("click", () => {

    state.answers.destination =
      button.dataset.destination;

    $("#destinationText").value =
      button.dataset.destination;

    state.step = 1;

    updateProgress();

    document
      .querySelector("#planner")
      .scrollIntoView({
        behavior: "smooth"
      });

    showToast(
      `${button.dataset.destination} selected. Tell us the rest.`
    );
  });

});


/* =========================
   LEAD CLASSIFICATION
   INTERNAL ONLY
========================= */

function getLeadStatus() {

  const a = state.answers;

  const hasDates =
    Boolean(a.travelDate);

  const hasDestination =
    Boolean(
      a.destinationText ||
      (
        a.destination &&
        a.destination !== "Suggest a destination"
      )
    );

  const hasBudget =
    Boolean(a.budget);


  if (
    hasDates &&
    hasDestination &&
    hasBudget
  ) {
    return "HOT";
  }


  if (
    hasDestination ||
    hasDates ||
    hasBudget
  ) {
    return "WARM";
  }


  return "COLD";
}


/* =========================
   BUILD WHATSAPP MESSAGE
========================= */

function buildMessage() {

  const a = state.answers;

  const destination =
    a.destinationText ||
    a.destination ||
    "Please suggest a destination";

  const needs =
    a.needs.length
      ? a.needs.join(", ")
      : "Not specified";

  const leadStatus =
    getLeadStatus();


  return [

    `Hi Antara! I just submitted a trip request.`,

    ``,

    `Name: ${a.name}`,

    `Destination: ${destination}`,

    `Travelling from: ${
      a.fromCity || "Not specified"
    }`,

    `Travel date: ${
      a.travelDate || "Not specified"
    }`,

    `Duration: ${
      a.days || "Not specified"
    }`,

    `Travelling with: ${
      a.travellers || "Not specified"
    }`,

    `Travellers: ${
      a.travellerCount || "Not specified"
    }`,

    `Budget: ${
      a.budget || "Not specified"
    }`,

    `Need: ${needs}`,

    `WhatsApp: ${a.phone}`,

    `Email: ${
      a.email || "Not provided"
    }`,

    ``,

    `Lead status: ${leadStatus}`

  ].join("\n");
}


/* =========================
   OPEN WHATSAPP
========================= */

function openWhatsApp(message) {

  const number =
    CONFIG.whatsappNumber.replace(/\D/g, "");

  const url =
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}


/* =========================
   SUBMIT TRIP REQUEST
========================= */

tripForm.addEventListener("submit", (event) => {

  event.preventDefault();

  console.log("Trip form submitted");

  if (!validateStep()) {
    return;
  }


  // Build WhatsApp message
  const message = buildMessage();

  state.lastWhatsAppMessage = message;


  // Save internally
  localStorage.setItem(
    "antaraLastTripRequest",
    JSON.stringify({
      ...state.answers,

      // Lead status is stored internally
      leadStatus: getLeadStatus(),

      createdAt:
        new Date().toISOString()
    })
  );


  /*
    IMPORTANT:
    Lead status is NOT shown to the customer.
    It is only included in the WhatsApp message.
  */


  const successText =
    $("#successText");

  if (successText) {

    successText.textContent =
      "Your request has been prepared. Please open WhatsApp to send it directly to Antara.";
  }


  const successModal =
    $("#successModal");

  if (successModal) {

    successModal.classList.remove("hidden");

    successModal.setAttribute(
      "aria-hidden",
      "false"
    );

  } else {

    // Fallback if success modal is missing
    openWhatsApp(message);
  }

});


/* =========================
   WHATSAPP AFTER SUBMIT
========================= */

const whatsappAfterSubmit =
  $("#whatsappAfterSubmit");

if (whatsappAfterSubmit) {

  whatsappAfterSubmit.addEventListener(
    "click",
    () => {

      openWhatsApp(
        state.lastWhatsAppMessage
      );

    }
  );
}


/* =========================
   NEXT / BACK BUTTONS
========================= */

nextBtn.addEventListener(
  "click",
  nextStep
);

backBtn.addEventListener(
  "click",
  previousStep
);


/* =========================
   QUIZ
========================= */

const quizTrigger =
  $("#quizTrigger");

if (quizTrigger) {

  quizTrigger.addEventListener(
    "click",
    () => {

      $("#quizModal")
        .classList.remove("hidden");

      $("#quizModal")
        .setAttribute(
          "aria-hidden",
          "false"
        );
    }
  );
}


/* =========================
   MODAL CLOSE
========================= */

$$("[data-close]").forEach(el => {

  el.addEventListener("click", () => {

    const type =
      el.dataset.close;

    const modal =
      type === "quiz"
        ? $("#quizModal")
        : $("#successModal");

    if (!modal) return;

    modal.classList.add("hidden");

    modal.setAttribute(
      "aria-hidden",
      "true"
    );
  });

});


/* =========================
   QUIZ OPTIONS
========================= */

$$("[data-quiz]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const style =
        button.dataset.quiz;

      const suggestions = {

        Family:
          "Try Coorg, Wayanad or a relaxed Kerala escape. Want us to build a family itinerary?",

        Adventure:
          "Try Chikmagalur, Coorg or a Western Ghats adventure.",

        Beach:
          "Try Goa, Gokarna or coastal Karnataka for a slower beach escape.",

        Nature:
          "Try Coorg, Wayanad or the hill country around Chikmagalur.",

        Couple:
          "Try Coorg, Gokarna or a boutique Kerala escape.",

        Solo:
          "Try Goa, Hampi or a flexible coastal Karnataka trip."
      };


      $("#quizResult").innerHTML = `

        <strong>${style} traveller?</strong>

        <br>

        ${suggestions[style]}

        <br><br>

        <button
          class="btn btn-dark"
          id="quizPlanBtn">
          Plan this trip →
        </button>
      `;


      $("#quizResult")
        .classList.remove("hidden");


      $("#quizPlanBtn")
        .addEventListener(
          "click",
          () => {

            $("#quizModal")
              .classList.add("hidden");

            $("#quizResult")
              .classList.add("hidden");

            state.answers.destination =
              "Suggest a destination";

            state.step = 1;

            updateProgress();

            document
              .querySelector("#planner")
              .scrollIntoView({
                behavior: "smooth"
              });
          }
        );

    }
  );

});


/* =========================
   WHATSAPP QUICK OPTIONS
========================= */

$$("[data-wa]").forEach(button => {

  button.addEventListener(
    "click",
    () => {

      const option =
        button.dataset.wa;

      const message =
        `Hi Antara! I need help with: ${option}.\n\nPlease guide me with the next steps.`;

      openWhatsApp(message);

    }
  );

});


/* =========================
   FLOATING WHATSAPP
========================= */

const floatingWa =
  $("#floatingWa");

if (floatingWa) {

  floatingWa.addEventListener(
    "click",
    () => {

      openWhatsApp(
        "Hi Antara! Thanks for reaching out. I'd like help planning my trip."
      );

    }
  );

}


/* =========================
   MOBILE MENU
========================= */

const menuToggle =
  $("#menuToggle");

if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      $("#mainNav")
        .classList.toggle("open");

    }
  );
}


$$(".main-nav a").forEach(link => {

  link.addEventListener(
    "click",
    () => {

      $("#mainNav")
        .classList.remove("open");

    }
  );

});


/* =========================
   MINIMUM TRAVEL DATE
========================= */

const travelDate =
  $("#travelDate");

if (travelDate) {

  const today =
    new Date();

  today.setMinutes(
    today.getMinutes() -
    today.getTimezoneOffset()
  );

  travelDate.min =
    today.toISOString().slice(0, 10);
}


/* =========================
   INITIALISE
========================= */

updateProgress();

console.log(
  "Antara Travel Planner loaded successfully."
);
