const categories = [
  {
    name: "Acquisition process group (ACQ)",
    processes: ["ACQ.4 Supplier Monitoring"],
  },
  {
    name: "System engineering process group (SYS)",
    processes: [
      "SYS.1 Requirements Elicitation",
      "SYS.2 System Requirements Analysis",
      "SYS.3 System Architectural Design",
      "SYS.4 System Integration and Integration Verification",
      "SYS.5 System Verification",
    ],
  },
];

const specificQuestions = {
  "ACQ.4 Supplier Monitoring": [
    "ACQ.4.BP1: Agree on and maintain joint activities, joint interfaces, and information to be exchanged.",
    "ACQ.4.BP2: Exchange all agreed information.",
    "ACQ.4.BP3: Review development work products with the supplier. Review development work products with the supplier on the agreed regular basis, covering technical aspects, problems and risks. Track open measures.",
    "ACQ.4.BP4: Review progress of the supplier.",
    "ACQ.4.BP5: Act to correct deviations.",
  ],
};

const commonQuestions = [
  "GP 2.1.1: Identify the objectives and define a strategy for the performance of the process.",
  "GP 2.1.2: Plan the performance of the process.",
  "GP 2.1.3: Determine resource needs.",
  "GP 2.1.4: Identify and make available resources.",
  "GP 2.1.5: Monitor and adjust the performance of the process.",
  "GP 2.1.6: Manage the interfaces between involved parties.",
  "GP 2.2.1: Define the requirements for the work products.",
  "GP 2.2.2: Define the requirements for storage and control of the work products.",
  "GP 2.2.3: Identify, store and control the work products.",
  "GP 2.2.4: Review and adjust work products.",
];

const responses = ["N", "P", "L", "F", "N.A"];

document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("category-list");
  const categoryTitle = document.getElementById("category-title");
  const questionsDiv = document.getElementById("questions");
  const toggleSidebarButton = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const assessmentInfo = document.getElementById("assessment-info");

  populateCategories(categoryList);
  setupEventListeners();

  function populateCategories(categoryList) {
    categories.forEach((category) => {
      const li = createCategoryElement(category);
      categoryList.appendChild(li);
    });
  }

  function createCategoryElement(category) {
    const li = document.createElement("li");
    li.textContent = category.name;
    li.classList.add("category");
    li.appendChild(createProcessList(category.processes));
    return li;
  }

  function createProcessList(processes) {
    const ul = document.createElement("ul");
    ul.classList.add("hidden");
    processes.forEach((process) => {
      const subli = document.createElement("li");
      subli.textContent = process;
      subli.addEventListener("click", (e) =>
        handleProcessClick(e, subli, process)
      );
      ul.appendChild(subli);
    });
    return ul;
  }

  function handleProcessClick(e, subli, process) {
    e.stopPropagation();
    categoryTitle.textContent = process;
    questionsDiv.innerHTML = "";

    // Remove highlight from previously selected process
    const previouslySelected = document.querySelector(".selected-process");
    if (previouslySelected) {
      previouslySelected.classList.remove("selected-process");
    }

    // Highlight the selected process
    subli.classList.add("selected-process");

    if (specificQuestions[process]) {
      specificQuestions[process].forEach((question) => {
        questionsDiv.appendChild(createQuestionElement(question));
      });
    }
    commonQuestions.forEach((question, i) => {
      questionsDiv.appendChild(createQuestionElement(`${i + 1}. ${question}`));
    });
  }

  function setupEventListeners() {
    toggleSidebarButton.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });

    assessmentInfo.addEventListener("click", () => {
      displayAssessmentInfo();
    });

    categoryList.addEventListener("click", (e) => {
      if (e.target.classList.contains("category")) {
        const sublist = e.target.querySelector("ul");
        if (sublist) {
          sublist.classList.toggle("hidden");
        }
      }
    });
  }

  function displayAssessmentInfo() {
    categoryTitle.textContent = "Assessment Information";
    questionsDiv.innerHTML = `
          <div class="question">
              <label><strong>Assessment Title</strong></label>
              <input type="text" placeholder="Enter assessment title">
          </div>
          <div class="question">
              <label><strong>Assessment Date</strong></label>
              <input type="date">
          </div>
          <div class="question">
              <label><strong>Assessor Name</strong></label>
              <input type="text" placeholder="Enter assessor name">
          </div>
          <div class="question">
              <label><strong>Notes</strong></label>
              <textarea placeholder="Enter any notes"></textarea>
          </div>
      `;
  }
});

function createQuestionElement(question) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question";

  const questionLabel = document.createElement("label");
  questionLabel.innerHTML = `<strong>${question}</strong>`;
  questionDiv.appendChild(questionLabel);

  const checkboxGroup = document.createElement("div");
  checkboxGroup.className = "checkbox-group";

  responses.forEach((response) => {
    const label = document.createElement("label");
    label.textContent = response;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = response;
    checkbox.name = question;

    checkbox.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(`input[name="${question}"]`);
      checkboxes.forEach((cb) => {
        if (cb !== this) {
          cb.disabled = this.checked;
        }
      });
    });

    label.appendChild(checkbox);
    checkboxGroup.appendChild(label);
  });

  questionDiv.appendChild(checkboxGroup);

  // Add Strengths, Weaknesses, and Notes fields
  const strengths = document.createElement("textarea");
  strengths.placeholder = "Strengths";
  strengths.className = "long-field";
  questionDiv.appendChild(strengths);

  const weaknesses = document.createElement("textarea");
  weaknesses.placeholder = "Weaknesses";
  weaknesses.className = "long-field";
  questionDiv.appendChild(weaknesses);

  const notes = document.createElement("textarea");
  notes.placeholder = "Notes";
  notes.className = "long-field";
  questionDiv.appendChild(notes);

  return questionDiv;
}
