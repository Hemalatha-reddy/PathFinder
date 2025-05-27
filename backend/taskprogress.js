document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("task-list").addEventListener("change", updateProgress);
});

function addTask() {
    let taskNameInput = document.getElementById("task-name");
    let taskName = taskNameInput.value.trim();
    if (taskName === "") return alert("Task name cannot be empty!");

    let taskContainer = document.getElementById("task-list");

    let taskCard = document.createElement("div");
    taskCard.classList.add("card", "p-3", "shadow-sm", "task-card");

    // Create date and description section
    let taskDetails = document.createElement("div");
    taskDetails.classList.add("task-details", "mb-3");
    
    // Add start date
    let startDateDiv = document.createElement("div");
    startDateDiv.classList.add("mb-2");
    let startDateLabel = document.createElement("label");
    startDateLabel.textContent = "Start Date: ";
    let startDate = document.createElement("input");
    startDate.type = "date";
    startDate.classList.add("form-control", "form-control-sm");
    startDateDiv.appendChild(startDateLabel);
    startDateDiv.appendChild(startDate);

    // Add end date
    let endDateDiv = document.createElement("div");
    endDateDiv.classList.add("mb-2");
    let endDateLabel = document.createElement("label");
    endDateLabel.textContent = "End Date: ";
    let endDate = document.createElement("input");
    endDate.type = "date";
    endDate.classList.add("form-control", "form-control-sm");
    endDateDiv.appendChild(endDateLabel);
    endDateDiv.appendChild(endDate);

    // Add days remaining counter
    let daysRemainingDiv = document.createElement("div");
    daysRemainingDiv.classList.add("mb-2", "text-info");
    daysRemainingDiv.textContent = "Days remaining: -";

    // Update days remaining when dates change
    function updateDaysRemaining() {
        if (startDate.value && endDate.value) {
            const start = new Date(startDate.value);
            const end = new Date(endDate.value);
            const today = new Date();
            const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
            daysRemainingDiv.textContent = `Days remaining: ${daysLeft}`;
            daysRemainingDiv.className = `mb-2 ${daysLeft < 0 ? 'text-danger' : 'text-info'}`;
        }
    }

    startDate.addEventListener("change", updateDaysRemaining);
    endDate.addEventListener("change", updateDaysRemaining);

    // Add description box
    let descriptionDiv = document.createElement("div");
    descriptionDiv.classList.add("mb-2");
    let descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description: ";
    let description = document.createElement("textarea");
    description.classList.add("form-control", "form-control-sm");
    description.rows = "2";
    description.placeholder = "Add task description...";
    descriptionDiv.appendChild(descriptionLabel);
    descriptionDiv.appendChild(description);

    // Add all details to task details section
    taskDetails.appendChild(startDateDiv);
    taskDetails.appendChild(endDateDiv);
    taskDetails.appendChild(daysRemainingDiv);
    taskDetails.appendChild(descriptionDiv);

    let taskHeader = document.createElement("div");
    taskHeader.classList.add("task-header");

    let taskTitle = document.createElement("h5");
    taskTitle.textContent = taskName;

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
    deleteBtn.onclick = function () { taskCard.remove(); updateProgress(); };

    taskHeader.appendChild(taskTitle);
    taskHeader.appendChild(deleteBtn);

    let progressBar = document.createElement("div");
    progressBar.classList.add("progress", "mt-2");
    progressBar.innerHTML = `<div class="progress-bar bg-success" role="progressbar" style="width: 0%;"></div>`;

    let addSubtaskBtn = document.createElement("button");
    addSubtaskBtn.textContent = "Add Subtask";
    addSubtaskBtn.classList.add("btn", "btn-primary", "btn-sm", "mt-2");
    addSubtaskBtn.onclick = function () {
        subtaskInputDiv.classList.toggle("hidden");
    };

    let subtaskInputDiv = createInputField("Enter Subtask", () => addSubtask(taskCard));
    subtaskInputDiv.classList.add("hidden");

    let taskList = document.createElement("ul");

    taskCard.appendChild(taskHeader);
    taskCard.appendChild(taskDetails);
    taskCard.appendChild(progressBar);
    taskCard.appendChild(addSubtaskBtn);
    taskCard.appendChild(subtaskInputDiv);
    taskCard.appendChild(taskList);

    taskContainer.appendChild(taskCard);
    taskNameInput.value = "";
}

// Rest of the functions remain the same
function addSubtask(parentTask) {
    let subtaskInput = parentTask.querySelector(".input-group input");
    let subtaskName = subtaskInput.value.trim();
    if (subtaskName === "") return;

    let subtaskLi = document.createElement("li");
    subtaskLi.classList.add("mt-2");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input", "me-2");
    checkbox.onchange = updateProgress;

    let subtaskText = document.createTextNode(subtaskName);

    let addSubSubtaskBtn = document.createElement("button");
    addSubSubtaskBtn.textContent = "Add Sub-Subtask";
    addSubSubtaskBtn.classList.add("btn", "btn-secondary", "btn-sm", "ms-2");
    addSubSubtaskBtn.onclick = function () {
        subSubtaskInputDiv.classList.toggle("hidden");
    };

    let subSubtaskInputDiv = createInputField("Enter Sub-Subtask", () => addSubSubtask(subtaskLi));
    subSubtaskInputDiv.classList.add("hidden");

    let subSubtaskList = document.createElement("ul");

    subtaskLi.appendChild(checkbox);
    subtaskLi.appendChild(subtaskText);
    subtaskLi.appendChild(addSubSubtaskBtn);
    subtaskLi.appendChild(subSubtaskInputDiv);
    subtaskLi.appendChild(subSubtaskList);

    parentTask.querySelector("ul").appendChild(subtaskLi);
    subtaskInput.value = "";
}

function addSubSubtask(parentSubtask) {
    let subSubtaskInput = parentSubtask.querySelector(".input-group input");
    let subSubtaskName = subSubtaskInput.value.trim();
    if (subSubtaskName === "") return;

    let subSubtaskLi = document.createElement("li");
    subSubtaskLi.classList.add("mt-2");

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("form-check-input", "me-2");
    checkbox.onchange = updateProgress;

    let subSubtaskText = document.createTextNode(subSubtaskName);

    subSubtaskLi.appendChild(checkbox);
    subSubtaskLi.appendChild(subSubtaskText);

    parentSubtask.querySelector("ul").appendChild(subSubtaskLi);
    subSubtaskInput.value = "";
}

function updateProgress() {
    let tasks = document.querySelectorAll(".task-card");

    tasks.forEach(task => {
        let checkboxes = task.querySelectorAll("input[type='checkbox']");
        let progressBar = task.querySelector(".progress-bar");

        let checkedCount = [...checkboxes].filter(cb => cb.checked).length;
        let totalCount = checkboxes.length;

        let progress = totalCount ? (checkedCount / totalCount) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    });
}

function createInputField(placeholder, addFunction) {
    let div = document.createElement("div");
    div.classList.add("input-group", "mt-2");

    let input = document.createElement("input");
    input.type = "text";
    input.classList.add("form-control");
    input.placeholder = placeholder;

    let button = document.createElement("button");
    button.classList.add("btn", "btn-primary");
    button.textContent = "+";
    button.onclick = addFunction;

    div.appendChild(input);
    div.appendChild(button);
    return div;
}
