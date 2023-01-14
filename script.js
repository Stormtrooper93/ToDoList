// оголошуємо змінні, з якими будемо працювати

const form = document.querySelector('.create-task-block');
const taskList = document.querySelector('.collection');
const filter = document.querySelector('.filter-input');
const clearBtn = document.querySelector('.clear-tasks');
const taskInput = document.querySelector('.task-input');


// CRUD - update, delete

//read
document.addEventListener('DOMContentLoaded', loadTasks);
form.addEventListener('submit', createTask);
taskList.addEventListener('click', removeTask);
taskList.addEventListener('click', editTask);
clearBtn.addEventListener('click', removeAllTasks);
filter.addEventListener('keyup', filterItems);

function loadTasks() {

    //оголошуємо змінну, яка буде використовуватись для списку завдань
    let tasks;

    //перевіряємо, чи є у локал строриджі вже якісь дані завдань
    if(localStorage.getItem('tasks') !== null) {

        //якщо є, то присвоюємо змінній
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
    else {
        //якщо немає, то присвоюємо змінній значення порожнього масиву
        tasks = []
    };

    //для кожної задачі, яка є
    tasks.forEach(function(task, index) {

        //створюємо елемент списку
        const li = document.createElement('li');

        //додаємо елементу клас
        li.className = 'collection-item';

        //додаємо індекс до елементу в DOM
        li.dataset.id = index;

        //всередині елементу списку створюємо текстову ноду з описом завдання
        li.appendChild(document.createTextNode(task));

        const updateElement = document.createElement('span');
        updateElement.className = 'update-item';
        updateElement.innerHTML = '  <i class="fa fa-edit"></i>';
        li.appendChild(updateElement);

        const deleteElement = document.createElement('span');
        deleteElement.className = 'delete-item';
        deleteElement.innerHTML = '  <i class="fa fa-remove"></i>';
        li.appendChild(deleteElement);

        //запихаємо елемент в список
        taskList.appendChild(li);
    });
};

// Не обовʼязкова функція. Простіше отримувати всі завдання
function getAllTasks() {
    return JSON.parse(localStorage.getItem('tasks'));
}

//create

function createTask(event) {

    //якщо значення в інпуті порожнє, то не додаємо нове завдання і не даємо виконатись дефолтній поведінці
    if (taskInput.value.trim() === '') {
        event.preventDefault();
        return null;
    }
    const tasks = getAllTasks();
    const li = document.createElement('li');
    li.className = 'collection-item';
    
    //даємо новому елементу id tasks.length, тому що додаємо в кінець списку 
    //і на даний момент останній ID буде length - 1. 
    //Тому наступний елемент буде мати порядковий номер length
    li.dataset.id = tasks.length;

    //застовуємо створення для значення таскінпуту
    li.appendChild(document.createTextNode(taskInput.value)); 
    taskList.appendChild(li);

    //викликаємо функцію, яка буде додавати завдання в локалсторидж
    storeTaskInLocalStorage(taskInput.value);

    const updateElement = document.createElement('span');
    updateElement.className = 'update-item';
    updateElement.innerHTML = '  <i class="fa fa-edit"></i>';
    li.appendChild(updateElement);

    const deleteElement = document.createElement('span');
    deleteElement.className = 'delete-item';
    deleteElement.innerHTML = '<i class="fa fa-remove"></i>';
    li.appendChild(deleteElement);

    //очищуємо вміст інпуту для створення завдання
    taskInput.value = '';
    
    //блокуємо дефолтну поведінку сабміта
    event.preventDefault();
};

function storeTaskInLocalStorage(task) {

    //оголошуємо змінну, яка буде використовуватись для списку завдань
    let tasks;

    //перевіряємо, чи є у локал строриджі вже якісь дані завдань
    if(localStorage.getItem('tasks')!== null) {

        //якщо є, то присвоюємо змінній
        tasks = getAllTasks();
    }
    else {
        tasks = []
    };

    //додаємо до списку нове завдання
    tasks.push(task);

    //зберігаємо список завдань в локалсторидж
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

//update some task
function editTask(event) {

    //вивантажуємо список тасків з локалсториджа в змінну
    let tasks = getAllTasks();

    //присвоюємо змінну для іконки
    let iconContainer = event.target.parentElement;

    //присвоюємо змінну для визначення айді
    let id = iconContainer.parentElement.dataset.id;

    
    if(iconContainer.classList.contains('update-item')) {
        //присвоюємо змінну для вікна з інпутом редагування таски + повторюємо значення старої таски
        let updatedTask = window.prompt('редагувати задачу', tasks[id]);

        //виділяємо конкретну першу ноду для редагування, бо в нас текст завжди йде першим
        //це для того, щоб редагований текст не витер все в списку, а залишив кнопки-іконки
        iconContainer.parentElement.childNodes[0].nodeValue = updatedTask;

        //оновлюємо елемент в локал сториджі
        tasks[id] = updatedTask;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
}; 


//delete some task
function removeTask(event) {
    let iconContainer = event.target.parentElement;
    //якщо клікнули по хрестику - тоді
    if(iconContainer.classList.contains('delete-item')) { 
        //пересвідчимось, чи юзер справді хоче видалити елемент
        if(confirm('Do you really want to remove task?')) {
            //видаляємо цей елемент списку
            iconContainer.parentElement.remove();

            //отримуємо id елемента З DOM дерева
            let id = iconContainer.parentElement.dataset.id;
            //викликаємо функцію, яка буде додавати завдання в локалсторидж
            removeTaskFromLocalStorage(id);
        };
    };
};

//передаємо індекс id, як параметр для функції видалення з локал сториджа
function removeTaskFromLocalStorage(id) {
    //оголошуємо змінну, яка буде використовуватись для списку завдань
    let tasks;

    //перевіряємо, чи є у локал сториджі вже якісь дані завдань
    if(localStorage.getItem('tasks')!== null) {

        //якщо є, то присвоюємо змінній
        tasks = getAllTasks();
    }
    else {
        tasks = []
    };
    //видаляємо елемент з індексом id
    tasks.splice(id, 1);

    localStorage.setItem('tasks', JSON.stringify(tasks));
};

//delete all tasks

function removeAllTasks() {
    if(confirm('Do you really want to remove all tasks?')) {
        //видаляємо весь контент всередині списку
        taskList.innerHTML = '';
    };
    //видалити всі елементи з ЛокалСторидж
    removeaAllTasksFromLocalStorage();
};

function removeaAllTasksFromLocalStorage () {
    localStorage.clear();
};

// search on tasks
function filterItems(event) {
    // оголосимо змінну, яка буде в себе приймати значення, по якому юзер фільтрує
    const filterQuery = event.target.value.toLowerCase();
    // знайти всі елементи на сторінці 
    document.querySelectorAll('.collection-item').forEach(function(taskHTMLElement){
        // знаходимо текст всередині li
        const taskText = taskHTMLElement.firstChild.textContent.toLowerCase();
        // якщо пошукова строка є в складі тексту з li 
        if(taskText.includes(filterQuery)) {
            // показуємо цей елемент списку
            taskHTMLElement.style.display = 'block';
        } else {
            // якщо немає, непоказуємо цей елемент списку
            taskHTMLElement.style.display = 'none';
        };
    });
};