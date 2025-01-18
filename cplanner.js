document.addEventListener("DOMContentLoaded", function () {
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const prevDateBtn = document.getElementById('prev-date');
  const nextDateBtn = document.getElementById('next-date');
  const monthYearDisplay = document.getElementById('month-year');
  const dayHeaders = {
    mon: document.getElementById('mon'),
    tue: document.getElementById('tue'),
    wed: document.getElementById('wed'),
    thu: document.getElementById('thu'),
    fri: document.getElementById('fri'),
    sat: document.getElementById('sat'),
    sun: document.getElementById('sun'),
  };
  const cells = document.querySelectorAll('.cell');
  const plannerModal = document.getElementById('planner-modal');
  const closeModalButton = document.getElementById('close-modal');
  const eventForm = document.getElementById('event-form');
  const taskNameInput = document.getElementById('task-name');
  const taskTimeInput = document.getElementById('task-time');
  const taskDetailsInput = document.getElementById('task-details');
  let currentDate = new Date();
  let currentCell = null;

  // Object to store tasks by date and time
  const taskData = {};

  // Helper functions
  const getMonthYearString = (date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDatesForWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = startOfWeek.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust to Monday
    startOfWeek.setDate(startOfWeek.getDate() + mondayOffset);

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    return days.reduce((dates, day, index) => {
      const tempDate = new Date(startOfWeek);
      tempDate.setDate(startOfWeek.getDate() + index);
      dates[day] = tempDate.getDate();
      return dates;
    }, {});
  };

  const getDateKey = (date) =>
    date.toISOString().split('T')[0]; // Format as YYYY-MM-DD for unique keys

  const updateCalendar = () => {
    monthYearDisplay.textContent = getMonthYearString(currentDate);
    const weekDates = getDatesForWeek(currentDate);
    Object.keys(weekDates).forEach(day => {
      dayHeaders[day].textContent = `${day.charAt(0).toUpperCase() + day.slice(1)} (${weekDates[day]})`;
    });

    // Clear current task display
    cells.forEach(cell => (cell.innerHTML = ''));

    // Repopulate tasks from memory
    cells.forEach(cell => {
      const day = cell.getAttribute('data-day'); // Get day (e.g., "mon")
      const time = cell.getAttribute('data-time'); // Get time (e.g., "9:00")
      const dateKey = getDateKey(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), weekDates[day])
      );
      const taskKey = `${dateKey}_${time}`;
      if (taskData[taskKey]) {
        cell.innerHTML = taskData[taskKey]; // Restore task
      }
    });
  };

  const openTaskModal = (cell) => {
    currentCell = cell;
    plannerModal.style.display = 'block';
    taskNameInput.value = '';
    taskTimeInput.value = '';
    taskDetailsInput.value = '';
  };

  const closeTaskModal = () => {
    plannerModal.style.display = 'none';
    currentCell = null;
  };

  const saveTask = (e) => {
    e.preventDefault();
    if (currentCell) {
      const taskName = taskNameInput.value;
      const taskTime = taskTimeInput.value;
      const taskDetails = taskDetailsInput.value;

      const day = currentCell.getAttribute('data-day');
      const time = currentCell.getAttribute('data-time');
      const dateKey = getDateKey(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), getDatesForWeek(currentDate)[day])
      );
      const taskKey = `${dateKey}_${time}`;

      taskData[taskKey] = `
        <div class="task-card">
          <h4>${taskName}</h4>
          <p>${taskTime}</p>
          <p>${taskDetails}</p>
        </div>
      `;

      currentCell.innerHTML = taskData[taskKey]; // Display task
      closeTaskModal();
    }
  };

  // Event Listeners
  cells.forEach(cell => {
    cell.addEventListener('click', () => openTaskModal(cell));
  });

  closeModalButton.addEventListener('click', closeTaskModal);
  eventForm.addEventListener('submit', saveTask);

  window.addEventListener('click', (e) => {
    if (e.target === plannerModal) closeTaskModal();
  });

  // Update Calendar for Month Navigation
  prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
  });

  // Update Calendar for Date Navigation (7 days forward/backward)
  prevDateBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 7); // Move 7 days backward
    updateCalendar();
  });

  nextDateBtn.addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 7); // Move 7 days forward
    updateCalendar();
  });

  // Initialize Calendar
  updateCalendar();
});




document.body.style.userSelect = 'none';