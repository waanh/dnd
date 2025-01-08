const state = JSON.parse(localStorage.getItem('board')) || {
    columns: [
      { id: 1, name: 'To Do', cards: [] },
      { id: 2, name: 'In Progress', cards: [] },
      { id: 3, name: 'Done', cards: [] },
    ],
  };
  
  let draggedCard = null;
  let sourceColumnId = null;
  let sourceCardIndex = null;
  
  export function initializeApp() {
    renderBoard();
  }
  
  function renderBoard() {
    const boardContainer = document.getElementById('board');
    boardContainer.innerHTML = ''; // Очистка доски
  
    state.columns.forEach((column) => {
      const columnEl = createColumn(column);
      boardContainer.appendChild(columnEl);
    });
  }
  
  function createColumn(column) {
    const columnEl = document.createElement('div');
    columnEl.className = 'column';
    columnEl.innerHTML = `
      <h2>${column.name}</h2>
      <div class="cards" data-column-id="${column.id}">
        ${column.cards
          .map(
            (card, index) => `
            <div class="card" 
                 draggable="true" 
                 data-column-id="${column.id}" 
                 data-card-index="${index}">
              ${card.text}
              <button class="delete-card">✖</button>
            </div>
          `
          )
          .join('')}
      </div>
      <button class="add-card">Add another card</button>
    `;
  
    const addCardButton = columnEl.querySelector('.add-card');
    addCardButton.addEventListener('click', () => addCard(column.id));
  
    const deleteButtons = columnEl.querySelectorAll('.delete-card');
    deleteButtons.forEach((button, index) => {
      button.addEventListener('click', () => deleteCard(column.id, index));
    });
  
    const cardsContainer = columnEl.querySelector('.cards');
    cardsContainer.addEventListener('dragover', handleDragOver);
    cardsContainer.addEventListener('drop', handleDrop);
  
    const cards = columnEl.querySelectorAll('.card');
    cards.forEach((card) => {
      card.addEventListener('dragstart', handleDragStart);
    });
  
    return columnEl;
  }
  
  function addCard(columnId) {
    const column = state.columns.find((col) => col.id === columnId);
    const text = prompt('Enter card text:');
    if (text) {
      column.cards.push({ text });
      saveState();
      renderBoard();
    }
  }
  
  function deleteCard(columnId, cardIndex) {
    const column = state.columns.find((col) => col.id === columnId);
    column.cards.splice(cardIndex, 1);
    saveState();
    renderBoard();
  }
  
  function handleDragStart(event) {
    draggedCard = event.target;
    sourceColumnId = +draggedCard.dataset.columnId;
    sourceCardIndex = +draggedCard.dataset.cardIndex;
    event.dataTransfer.effectAllowed = 'move';
  }
  
  function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }
  
  function handleDrop(event) {
    event.preventDefault();
  
    const targetColumnId = +event.target.closest('.cards').dataset.columnId;
    const targetColumn = state.columns.find((col) => col.id === targetColumnId);
  
    const [movedCard] = state.columns
      .find((col) => col.id === sourceColumnId)
      .cards.splice(sourceCardIndex, 1);
  
    targetColumn.cards.push(movedCard);
  
    saveState();
    renderBoard();
  }
  
  function saveState() {
    localStorage.setItem('board', JSON.stringify(state));
  }
  