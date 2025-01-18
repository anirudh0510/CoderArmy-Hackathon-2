// Text Editor Toolbar Functionality
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', () => {
      const command = button.getAttribute('data-command');
      const value = button.getAttribute('data-value') || null;
  
      if (command === 'createLink') {
        const url = prompt('Enter the link URL:', 'https://');
        if (url) {
          document.execCommand(command, false, url);
        }
      } else {
        document.execCommand(command, false, value);
      }
    });
  });
  
  // To-Do List Dropdown Functionality
  const todoToggle = document.getElementById('todo-toggle');
  const todoBox = document.getElementById('todo-box');
  todoToggle.addEventListener('click', () => {
    todoBox.classList.toggle('hidden');
  });
  
  // Add To-Do Functionality
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const addTodo = document.getElementById('add-todo');
  
  addTodo.addEventListener('click', () => {
    const task = todoInput.value.trim();
    if (task) {
      const li = document.createElement('li');
      li.innerHTML = `${task} <button class="delete-task">X</button>`;
      todoList.appendChild(li);
      todoInput.value = '';
  
      // Delete task functionality
      li.querySelector('.delete-task').addEventListener('click', () => {
        li.remove();
      });
    }
  });
  
  // Save Button Error Handling
  document.getElementById('save-button').addEventListener('click', () => {
    // Simulating a backend error
    alert('Error: Unable to save. Backend is not implemented yet.');
  });
  
  // Editor Formatting Menu
  const editor = document.querySelector(".editor");
  const formatMenu = document.getElementById("format-menu");
  
  editor.addEventListener("mouseup", (e) => {
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
  
      formatMenu.style.top = `${rect.top + window.scrollY - 50}px`;
      formatMenu.style.left = `${rect.left + window.scrollX}px`;
      formatMenu.classList.remove("hidden");
    } else {
      formatMenu.classList.add("hidden");
    }
  });
  
  document.addEventListener("click", (e) => {
    if (!formatMenu.contains(e.target) && !editor.contains(e.target)) {
      formatMenu.classList.add("hidden");
    }
  });
  
  function applyStyle(style) {
    document.execCommand(style);
  }
  
  // Font Menu Functions
  function changeTextColor(event) {
    const color = event.target.value;
    if (color) {
      document.execCommand("foreColor", false, color); // Changes text color
    }
  }
  
  function changeFontSize(event) {
    const fontSize = event.target.value;
    if (fontSize) {
      document.execCommand("fontSize", false, "7"); // Temporary size
      const fontElements = document.querySelectorAll("font[size='7']");
      fontElements.forEach((font) => {
        font.removeAttribute("size");
        font.style.fontSize = fontSize;
      });
    }
  }
  
  function changeFontFamily(event) {
    const fontFamily = event.target.value;
    if (fontFamily) {
      document.execCommand("fontName", false, fontFamily);
    }
  }
  
  function applyStyle(style) {
    document.execCommand(style, false, null); // Handles bold, italic, underline
  }
  
  

  document.body.style.userSelect = 'none';

  