document.addEventListener("DOMContentLoaded", () => {
  const categoryList = document.getElementById("category-list");
  const categoryTitle = document.getElementById("category-title");
  const questionsDiv = document.getElementById("questions");
  const toggleSidebarButton = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const assessmentInfo = document.getElementById("assessment-info");

  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const { categories, specificQuestions, commonQuestions } = data;

      populateCategories(categories, categoryList);
      setupEventListeners(specificQuestions, commonQuestions);
    })
    .catch((error) => console.error("Error fetching JSON data:", error));

  function populateCategories(categories, categoryList) {
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

    fetch("data.json")
      .then((response) => response.json())
      .then((data) => {
        const { specificQuestions, commonQuestions } = data;
        if (specificQuestions[process]) {
          specificQuestions[process].forEach((question) => {
            questionsDiv.appendChild(createQuestionElement(question));
          });
        }
        commonQuestions.forEach((question, i) => {
          questionsDiv.appendChild(
            createQuestionElement(`${i + 1}. ${question}`)
          );
        });
      })
      .catch((error) => console.error("Error fetching JSON data:", error));
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

  const responses = ["N", "P", "L", "F", "N.A"];

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
