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
          // Collapse all other categories
          document.querySelectorAll(".category ul").forEach((ul) => {
            if (ul !== sublist) {
              ul.classList.add("hidden");
            }
          });
          // Toggle the selected category
          sublist.classList.toggle("hidden");
        }
      }
    });
  }

  function displayAssessmentInfo() {
    categoryTitle.textContent = "Assessment Information";
    questionsDiv.innerHTML = `
      <div class="question-group">
        <div class="question">
          <label><strong>PAM Name and Version</strong></label>
          <select>
            <option value="ASPICE v3.1">ASPICE v3.1</option>
            <option value="ASPICE v4.0">ASPICE v4.0</option>
          </select>
        </div>
        <div class="question">
          <label><strong>VDA Guideline Version</strong></label>
          <select>
            <option value="VDA Guideline 1.0">VDA Guideline 1.0</option>
            <option value="VDA Guidelines 2.0">VDA Guidelines 2.0</option>
          </select>
        </div>
        <div class="question">
          <label><strong>Assessment Date</strong></label>
          <input type="date">
        </div>
        <div class="question">
          <label><strong>Lead Assessor</strong></label>
          <input type="text" placeholder="Enter lead assessor name">
        </div>
        <div class="question">
          <label><strong>Intacs ID Lead Assessor</strong></label>
          <input type="text" placeholder="Enter Intacs ID lead assessor">
        </div>
        <div class="question">
          <label><strong>Company name/Organization Unit</strong></label>
          <textarea placeholder="Enter company name/organization unit"></textarea>
        </div>
        <div class="question">
          <label><strong>Project Name</strong></label>
          <input type="text" placeholder="Enter project name">
        </div>
        <div class="question">
          <label><strong>Assessed Sites</strong></label>
          <input type="text" placeholder="Enter assessed sites">
        </div>
        <div class="question">
          <label><strong>Unit/Department</strong></label>
          <input type="text" placeholder="Enter unit/department">
        </div>
        <div class="question">
          <label><strong>Address</strong></label>
          <textarea placeholder="Enter address"></textarea>
        </div>
        <div class="question">
          <label><strong>Contact Person</strong></label>
          <input type="text" placeholder="Enter contact person">
        </div>
        <div class="question">
          <label><strong>Assessment Purpose</strong></label>
          <textarea placeholder="Enter assessment purpose"></textarea>
        </div>
        <div class="question">
          <label><strong>Target Capability Level</strong></label>
          <select>
            <option value="Level 3">Level 3</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 1">Level 1</option>
          </select>
        </div>
        <div class="question">
          <label><strong>Assessment Class</strong></label>
          <select>
            <option value="Class 1">Class 1</option>
            <option value="Class 2">Class 2</option>
            <option value="Class 3">Class 3</option>
          </select>
        </div>
        <div class="question">
          <label><strong>Category of Independence</strong></label>
          <select>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>
      </div>
    `;
  }

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
});