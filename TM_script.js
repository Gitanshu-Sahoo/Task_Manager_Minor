const taskInput =
document.getElementById("taskInput");

const priority =
document.getElementById("priority");

const dueDate =
document.getElementById("dueDate");

const addBtn =
document.getElementById("addBtn");

const taskList =
document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
}

function loadTasks() {

    const savedTasks =
    localStorage.getItem("tasks");

    if(savedTasks){

        taskList.innerHTML =
        savedTasks;

        addTaskEventListeners();
        updateCounters();

        document.querySelectorAll("#taskList li span")
        .forEach(span => {

            let text =
            span.textContent;

            text =
            text.replace("URGENT!", "");

            text =
            text.replace("OVERDUE!!", "");

            const match =
            text.match(/\d{4}-\d{2}-\d{2}/);

            if(match){

                const date =
                match[0];

                span.innerHTML =
                text + " " +
                getTaskStatus(date);
            }
        });
    }
}

function addTaskEventListeners() {
    document.querySelectorAll(".completeBtn").forEach(button => {
        button.onclick = function() {
            const li = this.parentElement.parentElement;
            li.classList.toggle("completed");
            updateCounters();
            saveTasks();
        };
    });

    document.querySelectorAll(".deleteBtn").forEach(button => {
        button.onclick = function() {
            this.parentElement.parentElement.remove();
            updateCounters();
            saveTasks();
        };
    });
}

function getTaskStatus(dueDate){

    const today = new Date();
    today.setHours(0,0,0,0);

    const taskDate = new Date(dueDate + "T00:00:00");
    taskDate.setHours(0,0,0,0);

    const difference = (taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    console.log(dueDate, difference);
    if(difference < 0){
        return '<span class="overdue">OVERDUE!!</span>';
    }

    if(difference <= 1){
        return '<span class="urgent">URGENT!</span>';
    }

    return "";
}

addBtn.addEventListener("click", () => {

    const task =
    taskInput.value.trim();

    if(task === ""){
        alert("Please enter a task");
        return;
    }

    const li =
    document.createElement("li");
    li.classList.add(priority.value.toLowerCase());

    li.innerHTML = `
        <span>
            ${task}
            |
            ${priority.value}
            |
            ${dueDate.value}
            ${getTaskStatus(dueDate.value)}
        </span>

        <div>

            <button class="completeBtn">
                Done!
            </button>

           <button class="deleteBtn">
                Remove
            </button>

        </div>
    `;

    const completeBtn =
    li.querySelector(".completeBtn");

    const deleteBtn =
    li.querySelector(".deleteBtn");

    completeBtn.onclick= () => {

    li.classList.toggle("completed");

    updateCounters();

    saveTasks();
};

    deleteBtn.onclick= () => {

    li.remove();

    updateCounters();

    saveTasks();
};

    taskList.appendChild(li);
    saveTasks();
    updateCounters();

    taskInput.value = "";
});

function updateCounters(){

    const allTasks =
    document.querySelectorAll("#taskList li");

    const completedTasks =
    document.querySelectorAll("#taskList li.completed");

    document.getElementById("pendingCount").textContent =
    allTasks.length - completedTasks.length;

    document.getElementById("completedCount").textContent =
    completedTasks.length;
}

loadTasks();