const STORAGE_KEY = 'fiz-progress-state-v1';

const defaultState = {
  students: [
    { id: 'stu-1', name: 'Александр Петров', group: 'ФП-101', course: 2, note: 'Стабильная успеваемость', createdAt: '2026-11-01' },
    { id: 'stu-2', name: 'Мария Семёнова', group: 'ФП-101', course: 2, note: 'Отсутствует 2 недели', createdAt: '2026-11-02' },
    { id: 'stu-3', name: 'Дмитрий Васильев', group: 'ФП-202', course: 3, note: 'Индивидуальная программа', createdAt: '2026-11-03' },
    { id: 'stu-4', name: 'Екатерина Ильина', group: 'ФП-202', course: 3, note: 'Подготовка к ГТО', createdAt: '2026-11-04' },
    { id: 'stu-5', name: 'Иван Кузнецов', group: 'ФП-303', course: 1, note: 'Начальный цикл', createdAt: '2026-11-05' }
  ],
  results: [
    { id: 'res-1', studentId: 'stu-1', test: 'Бег 100 м', date: '2026-11-08', value: 13.7, unit: 'с' },
    { id: 'res-2', studentId: 'stu-2', test: 'Прыжок в длину', date: '2026-11-09', value: 196, unit: 'см' },
    { id: 'res-3', studentId: 'stu-3', test: 'Подтягивания', date: '2026-11-11', value: 11, unit: 'раз' },
    { id: 'res-4', studentId: 'stu-4', test: 'Отжимания', date: '2026-11-12', value: 24, unit: 'раз' },
    { id: 'res-5', studentId: 'stu-5', test: 'Приседания', date: '2026-11-13', value: 35, unit: 'раз' }
  ],
  tables: [
    {
      id: 'tbl-1',
      name: 'Ведомость посещаемости',
      category: 'Посещаемость',
      columns: ['Дата', '1', '2', '3'],
      rows: [
        { id: 'row-1', values: ['2026-11-10', '+', '+', '+'] },
        { id: 'row-2', values: ['2026-11-11', '+', '-', '+'] }
      ]
    }
  ],
  gtoRecords: [
    { id: 'gto-1', studentId: 'stu-1', ageStep: '6', gender: 'мужской', exercise: 'Бег 100 м', date: '2026-11-12', value: 13.4, unit: 'с', status: 'Проверка по нормативам не задана' },
    { id: 'gto-2', studentId: 'stu-4', ageStep: '6', gender: 'женский', exercise: 'Прыжок в длину', date: '2026-11-12', value: 172, unit: 'см', status: 'Проверка по нормативам не задана' }
  ]
};

const state = loadState();

const refs = {
  navItems: document.querySelectorAll('.nav-item'),
  pageName: document.getElementById('pageName'),
  overviewCards: document.getElementById('overviewCards'),
  recentResultsList: document.getElementById('recentResultsList'),
  overviewSummary: document.getElementById('overviewSummary'),
  studentsTableBody: document.getElementById('studentsTableBody'),
  studentSearch: document.getElementById('studentSearch'),
  studentGroupFilter: document.getElementById('studentGroupFilter'),
  addStudentBtn: document.getElementById('addStudentBtn'),
  studentFormCard: document.getElementById('studentFormCard'),
  studentForm: document.getElementById('studentForm'),
  studentFormTitle: document.getElementById('studentFormTitle'),
  closeStudentForm: document.getElementById('closeStudentForm'),
  studentId: document.getElementById('studentId'),
  studentName: document.getElementById('studentName'),
  studentGroup: document.getElementById('studentGroup'),
  studentCourse: document.getElementById('studentCourse'),
  studentNote: document.getElementById('studentNote'),
  resultsTableBody: document.getElementById('resultsTableBody'),
  addResultBtn: document.getElementById('addResultBtn'),
  resultFormCard: document.getElementById('resultFormCard'),
  resultForm: document.getElementById('resultForm'),
  resultFormTitle: document.getElementById('resultFormTitle'),
  closeResultForm: document.getElementById('closeResultForm'),
  resultId: document.getElementById('resultId'),
  resultStudent: document.getElementById('resultStudent'),
  resultTest: document.getElementById('resultTest'),
  resultDate: document.getElementById('resultDate'),
  resultValue: document.getElementById('resultValue'),
  resultUnit: document.getElementById('resultUnit'),
  tablesList: document.getElementById('tablesList'),
  tableEditorContainer: document.getElementById('tableEditorContainer'),
  tablesEmptyState: document.getElementById('tablesEmptyState'),
  tableFormCard: document.getElementById('tableFormCard'),
  tableForm: document.getElementById('tableForm'),
  tableName: document.getElementById('tableName'),
  tableCategory: document.getElementById('tableCategory'),
  newTableBtn: document.getElementById('newTableBtn'),
  closeTableForm: document.getElementById('closeTableForm'),
  excelFileInput: document.getElementById('excelFileInput'),
  importExcelBtn: document.getElementById('importExcelBtn'),
  exportExcelBtn: document.getElementById('exportExcelBtn'),
  gtoList: document.getElementById('gtoList'),
  gtoSummary: document.getElementById('gtoSummary'),
  addGtoBtn: document.getElementById('addGtoBtn'),
  gtoFormCard: document.getElementById('gtoFormCard'),
  gtoForm: document.getElementById('gtoForm'),
  gtoStudentSelect: document.getElementById('gtoStudentSelect'),
  gtoExercise: document.getElementById('gtoExercise'),
  gtoDate: document.getElementById('gtoDate'),
  gtoValue: document.getElementById('gtoValue'),
  gtoUnit: document.getElementById('gtoUnit'),
  gtoAgeStep: document.getElementById('gtoAgeStep'),
  gtoGender: document.getElementById('gtoGender'),
  closeGtoForm: document.getElementById('closeGtoForm'),
  toast: document.getElementById('toast')
};

let currentSection = 'overview';
let selectedTableId = state.tables[0]?.id || null;

init();

function init() {
  bindEvents();
  updateStudentFilterOptions();
  updateStudentSelects();
  renderOverview();
  renderStudents();
  renderResults();
  renderTables();
  renderGto();
  showSection(currentSection);
}

function bindEvents() {
  refs.navItems.forEach((item) => {
    item.addEventListener('click', () => {
      currentSection = item.dataset.target;
      showSection(currentSection);
    });
  });

  refs.studentSearch.addEventListener('input', renderStudents);
  refs.studentGroupFilter.addEventListener('change', renderStudents);

  refs.addStudentBtn.addEventListener('click', () => openStudentForm());
  refs.closeStudentForm.addEventListener('click', () => refs.studentFormCard.classList.add('hidden'));
  refs.studentForm.addEventListener('submit', handleStudentSubmit);
  refs.studentForm.addEventListener('reset', () => {
    refs.studentForm.reset();
    refs.studentId.value = '';
    refs.studentFormTitle.textContent = 'Добавить студента';
  });

  refs.addResultBtn.addEventListener('click', () => openResultForm());
  refs.closeResultForm.addEventListener('click', () => refs.resultFormCard.classList.add('hidden'));
  refs.resultForm.addEventListener('submit', handleResultSubmit);

  refs.newTableBtn.addEventListener('click', () => {
    refs.tableFormCard.classList.remove('hidden');
    refs.tableForm.reset();
  });
  refs.closeTableForm.addEventListener('click', () => refs.tableFormCard.classList.add('hidden'));
  refs.tableForm.addEventListener('submit', handleTableSubmit);
  refs.importExcelBtn.addEventListener('click', () => refs.excelFileInput.click());
  refs.exportExcelBtn.addEventListener('click', exportAllDataExcel);
  refs.excelFileInput.addEventListener('change', handleExcelImport);

  refs.addGtoBtn.addEventListener('click', () => openGtoForm());
  refs.closeGtoForm.addEventListener('click', () => refs.gtoFormCard.classList.add('hidden'));
  refs.gtoForm.addEventListener('submit', handleGtoSubmit);
  refs.gtoAgeStep.addEventListener('change', renderGto);
  refs.gtoGender.addEventListener('change', renderGto);
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaultState);

    return {
      students: Array.isArray(saved.students) ? saved.students : structuredClone(defaultState.students),
      results: Array.isArray(saved.results) ? saved.results : structuredClone(defaultState.results),
      tables: Array.isArray(saved.tables) ? saved.tables : structuredClone(defaultState.tables),
      gtoRecords: Array.isArray(saved.gtoRecords) ? saved.gtoRecords : structuredClone(defaultState.gtoRecords)
    };
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showSection(sectionName) {
  refs.navItems.forEach((item) => {
    const isActive = item.dataset.target === sectionName;
    item.classList.toggle('active', isActive);
  });

  const sections = document.querySelectorAll('.panel');
  sections.forEach((section) => {
    section.classList.toggle('hidden', section.id !== sectionName);
  });

  refs.pageName.textContent = getSectionLabel(sectionName);
}

function getSectionLabel(sectionName) {
  const labels = {
    overview: 'Обзор',
    students: 'Студенты',
    results: 'Результаты',
    tables: 'Таблицы',
    gto: 'ГТО'
  };
  return labels[sectionName] || 'Обзор';
}

function renderOverview() {
  const totalStudents = state.students.length;
  const resultCount = state.results.length;
  const lastUpdated = getLastUpdatedDate();
  const summary = {
    activeToday: state.results.filter((result) => result.date === getTodayISO()).length,
    groups: new Set(state.students.map((student) => student.group)).size,
    averagePerStudent: totalStudents ? Math.round(resultCount / totalStudents) : 0
  };

  refs.overviewCards.innerHTML = [
    { label: 'Студенты', value: totalStudents, meta: `${summary.groups} групп` },
    { label: 'Записи', value: resultCount, meta: `${summary.activeToday} внесено сегодня` },
    { label: 'Средне', value: `${summary.averagePerStudent}`, meta: 'результата на студента' },
    { label: 'Актуальность', value: lastUpdated, meta: 'последнее обновление' }
  ].map((item) => `
    <div class="stat-card">
      <span class="label">${item.label}</span>
      <span class="value">${item.value}</span>
      <span class="meta">${item.meta}</span>
    </div>
  `).join('');

  const recentResults = [...state.results].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  refs.recentResultsList.innerHTML = recentResults.length
    ? recentResults.map((item) => {
        const student = findStudent(item.studentId);
        return `
          <li>
            <div>
              <strong>${student ? student.name : 'Неизвестный студент'}</strong>
              <span>${item.test}</span>
            </div>
            <span>${formatDate(item.date)} · ${item.value} ${item.unit}</span>
          </li>
        `;
      }).join('')
    : '<li><span>Нет записей</span></li>';

  refs.overviewSummary.innerHTML = `
    <div class="metric"><strong>Подтверждено записей</strong><span>${resultCount}</span></div>
    <div class="metric"><strong>Группы</strong><span>${summary.groups}</span></div>
    <div class="metric"><strong>Суммарно</strong><span>${state.gtoRecords.length} ГТО записей</span></div>
  `;
}

function renderStudents() {
  const searchValue = refs.studentSearch.value.trim().toLowerCase();
  const groupValue = refs.studentGroupFilter.value;

  const filteredStudents = state.students.filter((student) => {
    const matchesSearch = !searchValue || `${student.name} ${student.group}`.toLowerCase().includes(searchValue);
    const matchesGroup = groupValue === 'all' || student.group === groupValue;
    return matchesSearch && matchesGroup;
  });

  refs.studentsTableBody.innerHTML = filteredStudents.length
    ? filteredStudents.map((student) => {
        const count = state.results.filter((result) => result.studentId === student.id).length;
        const latest = [...state.results].filter((result) => result.studentId === student.id).sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return `
          <tr>
            <td><strong>${student.name}</strong></td>
            <td>${student.group}</td>
            <td>${student.course}</td>
            <td>${count}</td>
            <td>${latest ? `${latest.value} ${latest.unit}` : '—'}</td>
            <td>
              <div class="cell-action-group">
                <button class="small-btn" type="button" data-edit-student="${student.id}">Изменить</button>
                <button class="danger-btn" type="button" data-delete-student="${student.id}">Удалить</button>
              </div>
            </td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="6"><div class="empty-state"><p>Студенты не найдены.</p></div></td></tr>';

  refs.studentsTableBody.querySelectorAll('[data-edit-student]').forEach((button) => {
    button.addEventListener('click', () => openStudentForm(button.dataset.editStudent));
  });

  refs.studentsTableBody.querySelectorAll('[data-delete-student]').forEach((button) => {
    button.addEventListener('click', () => deleteStudent(button.dataset.deleteStudent));
  });
}

function updateStudentFilterOptions() {
  const uniqueGroups = [...new Set(state.students.map((student) => student.group))];
  const currentValue = refs.studentGroupFilter.value || 'all';
  refs.studentGroupFilter.innerHTML = '<option value="all">Все группы</option>' + uniqueGroups.map((group) => `<option value="${group}">${group}</option>`).join('');
  refs.studentGroupFilter.value = uniqueGroups.includes(currentValue) || currentValue === 'all' ? currentValue : 'all';
}

function updateStudentSelects() {
  const options = state.students.map((student) => `<option value="${student.id}">${student.name} · ${student.group}</option>`).join('');
  refs.resultStudent.innerHTML = options;
  refs.gtoStudentSelect.innerHTML = options;
}

function openStudentForm(studentId = null) {
  refs.studentFormCard.classList.remove('hidden');
  refs.studentForm.reset();

  if (studentId) {
    const student = state.students.find((item) => item.id === studentId);
    if (!student) return;
    refs.studentId.value = student.id;
    refs.studentName.value = student.name;
    refs.studentGroup.value = student.group;
    refs.studentCourse.value = student.course;
    refs.studentNote.value = student.note || '';
    refs.studentFormTitle.textContent = 'Редактировать студента';
  } else {
    refs.studentId.value = '';
    refs.studentFormTitle.textContent = 'Добавить студента';
  }
}

function handleStudentSubmit(event) {
  event.preventDefault();

  const id = refs.studentId.value || generateId('stu');
  const student = {
    id,
    name: refs.studentName.value.trim(),
    group: refs.studentGroup.value.trim(),
    course: Number(refs.studentCourse.value),
    note: refs.studentNote.value.trim(),
    createdAt: new Date().toISOString().slice(0, 10)
  };

  if (!student.name || !student.group || !student.course) {
    showToast('Заполните обязательные поля студента.', 'error');
    return;
  }

  const existingIndex = state.students.findIndex((item) => item.id === id);
  if (existingIndex >= 0) {
    state.students[existingIndex] = student;
  } else {
    state.students.push(student);
  }

  persistState();
  updateStudentFilterOptions();
  updateStudentSelects();
  renderOverview();
  renderStudents();
  renderResults();
  renderGto();
  refs.studentFormCard.classList.add('hidden');
  refs.studentForm.reset();
  showToast('Студент сохранён.', 'success');
}

function deleteStudent(studentId) {
  const student = findStudent(studentId);
  if (!student) return;

  const confirmed = window.confirm(`Удалить студента ${student.name}?`);
  if (!confirmed) return;

  state.students = state.students.filter((item) => item.id !== studentId);
  state.results = state.results.filter((item) => item.studentId !== studentId);
  state.gtoRecords = state.gtoRecords.filter((item) => item.studentId !== studentId);

  persistState();
  updateStudentFilterOptions();
  updateStudentSelects();
  renderOverview();
  renderStudents();
  renderResults();
  renderGto();
  showToast('Студент удалён.', 'success');
}

function renderResults() {
  const rows = [...state.results].sort((a, b) => new Date(b.date) - new Date(a.date));
  refs.resultsTableBody.innerHTML = rows.length
    ? rows.map((result) => {
        const student = findStudent(result.studentId);
        return `
          <tr>
            <td>${student ? student.name : '—'}</td>
            <td>${result.test}</td>
            <td>${formatDate(result.date)}</td>
            <td>${result.value}</td>
            <td>${result.unit}</td>
            <td>
              <div class="cell-action-group">
                <button class="small-btn" type="button" data-edit-result="${result.id}">Изменить</button>
                <button class="danger-btn" type="button" data-delete-result="${result.id}">Удалить</button>
              </div>
            </td>
          </tr>
        `;
      }).join('')
    : '<tr><td colspan="6"><div class="empty-state"><p>Нет результатов.</p></div></td></tr>';

  refs.resultsTableBody.querySelectorAll('[data-edit-result]').forEach((button) => {
    button.addEventListener('click', () => openResultForm(button.dataset.editResult));
  });

  refs.resultsTableBody.querySelectorAll('[data-delete-result]').forEach((button) => {
    button.addEventListener('click', () => deleteResult(button.dataset.deleteResult));
  });
}

function openResultForm(resultId = null) {
  refs.resultFormCard.classList.remove('hidden');
  refs.resultForm.reset();

  updateStudentSelects();

  if (resultId) {
    const result = state.results.find((item) => item.id === resultId);
    if (!result) return;

    refs.resultId.value = result.id;
    refs.resultStudent.value = result.studentId;
    refs.resultTest.value = result.test;
    refs.resultDate.value = result.date;
    refs.resultValue.value = result.value;
    refs.resultUnit.value = result.unit;
    refs.resultFormTitle.textContent = 'Редактировать результат';
  } else {
    refs.resultId.value = '';
    refs.resultFormTitle.textContent = 'Добавить результат';
    refs.resultDate.value = getTodayISO();
    refs.resultUnit.value = 'с';
  }
}

function handleResultSubmit(event) {
  event.preventDefault();

  const data = {
    id: refs.resultId.value || generateId('res'),
    studentId: refs.resultStudent.value,
    test: refs.resultTest.value.trim(),
    date: refs.resultDate.value,
    value: Number(refs.resultValue.value),
    unit: refs.resultUnit.value.trim() || 'с'
  };

  if (!data.studentId || !data.test || !data.date || Number.isNaN(data.value)) {
    showToast('Заполните обязательные поля записи.', 'error');
    return;
  }

  const existingIndex = state.results.findIndex((item) => item.id === data.id);
  if (existingIndex >= 0) {
    state.results[existingIndex] = data;
  } else {
    state.results.push(data);
  }

  persistState();
  renderOverview();
  renderResults();
  refs.resultFormCard.classList.add('hidden');
  refs.resultForm.reset();
  showToast('Результат сохранён.', 'success');
}

function deleteResult(resultId) {
  const result = state.results.find((item) => item.id === resultId);
  if (!result) return;

  const confirmed = window.confirm(`Удалить запись ${result.test}?`);
  if (!confirmed) return;

  state.results = state.results.filter((item) => item.id !== resultId);
  persistState();
  renderOverview();
  renderResults();
  showToast('Запись удалена.', 'success');
}

function renderTables() {
  refs.tablesEmptyState.classList.toggle('hidden', state.tables.length > 0);
  refs.tablesList.innerHTML = state.tables.length
    ? state.tables.map((table) => `
        <div class="table-item ${table.id === selectedTableId ? 'active' : ''}" data-table-item="${table.id}">
          <div class="table-item-meta">
            <strong>${table.name}</strong>
            <span>${table.category}</span>
          </div>
          <div class="cell-action-group">
            <button class="small-btn" type="button" data-open-table="${table.id}">Открыть</button>
            <button class="danger-btn" type="button" data-delete-table="${table.id}">Удалить</button>
          </div>
        </div>
      `).join('')
    : '';

  refs.tablesList.querySelectorAll('[data-open-table]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedTableId = button.dataset.openTable;
      renderTables();
    });
  });

  refs.tablesList.querySelectorAll('[data-delete-table]').forEach((button) => {
    button.addEventListener('click', () => deleteTable(button.dataset.deleteTable));
  });

  const table = state.tables.find((item) => item.id === selectedTableId) || state.tables[0];
  selectedTableId = table ? table.id : null;

  if (!table) {
    refs.tableEditorContainer.innerHTML = '<div class="empty-state"><p>Таблицы отсутствуют.</p></div>';
    return;
  }

  refs.tableEditorContainer.innerHTML = `
    <div class="table-layout">
      <div class="table-tools">
        <h3>${table.name}</h3>
        <div class="button-group">
          <button class="small-btn" type="button" id="addTableRowBtn">Добавить строку</button>
        </div>
      </div>
      <div class="table-editor">
        <table>
          <thead>
            <tr>
              ${table.columns.map((column, index) => `<th>${column || `Колонка ${index + 1}`}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${table.rows.length ? table.rows.map((row) => `
              <tr>
                ${table.columns.map((column, colIndex) => `
                  <td>
                    <input data-row-id="${row.id}" data-col-index="${colIndex}" value="${(row.values[colIndex] || '').replace(/"/g, '&quot;')}" />
                  </td>
                `).join('')}
              </tr>
            `).join('') : '<tr><td colspan="'+table.columns.length+'">Нет строк</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>
  `;

  refs.tableEditorContainer.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', (event) => {
      const rowId = event.target.dataset.rowId;
      const colIndex = Number(event.target.dataset.colIndex);
      const row = table.rows.find((item) => item.id === rowId);
      if (!row) return;
      row.values[colIndex] = event.target.value;
      persistState();
    });
  });

  const addRowBtn = document.getElementById('addTableRowBtn');
  if (addRowBtn) {
    addRowBtn.addEventListener('click', () => addTableRow(table.id));
  }
}

function handleTableSubmit(event) {
  event.preventDefault();
  const newTable = {
    id: generateId('tbl'),
    name: refs.tableName.value.trim() || 'Новая ведомость',
    category: refs.tableCategory.value,
    columns: ['Дата', 'Студент', 'Результат'],
    rows: [{ id: generateId('row'), values: ['', '', ''] }]
  };

  state.tables.push(newTable);
  selectedTableId = newTable.id;
  persistState();
  renderTables();
  refs.tableForm.reset();
  refs.tableFormCard.classList.add('hidden');
  showToast('Ведомость создана.', 'success');
}

function addTableRow(tableId) {
  const table = state.tables.find((item) => item.id === tableId);
  if (!table) return;

  table.rows.push({ id: generateId('row'), values: Array(table.columns.length).fill('') });
  persistState();
  renderTables();
}

function deleteTable(tableId) {
  const table = state.tables.find((item) => item.id === tableId);
  if (!table) return;

  if (!window.confirm(`Удалить ведомость ${table.name}?`)) return;
  state.tables = state.tables.filter((item) => item.id !== tableId);
  selectedTableId = state.tables[0]?.id || null;
  persistState();
  renderTables();
  showToast('Ведомость удалена.', 'success');
}

function handleExcelImport(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    try {
      const data = loadEvent.target?.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

      if (!rows.length) {
        throw new Error('Файл пустой');
      }

      const importedTable = {
        id: generateId('tbl'),
        name: file.name.replace(/\.[^/.]+$/, '') || 'Импортированная ведомость',
        category: 'Произвольная',
        columns: Object.keys(rows[0]).map((key) => String(key)),
        rows: rows.map((row) => ({
          id: generateId('row'),
          values: Object.keys(row).map((key) => String(row[key]))
        }))
      };

      state.tables.push(importedTable);
      selectedTableId = importedTable.id;
      persistState();
      renderTables();
      showToast('Excel успешно загружен.', 'success');
    } catch (error) {
      showToast('Не удалось импортировать Excel. Проверьте файл и формат данных.', 'error');
    } finally {
      refs.excelFileInput.value = '';
    }
  };

  reader.readAsArrayBuffer(file);
}

function exportAllDataExcel() {
  try {
    const workbook = XLSX.utils.book_new();
    const studentsSheet = XLSX.utils.json_to_sheet(state.students.map((student) => ({
      'Студент': student.name,
      'Группа': student.group,
      'Курс': student.course,
      'Примечание': student.note || ''
    })));
    const resultsSheet = XLSX.utils.json_to_sheet(state.results.map((result) => ({
      'Студент': findStudent(result.studentId)?.name || '',
      'Тест': result.test,
      'Дата': result.date,
      'Значение': result.value,
      'Ед. изм.': result.unit
    })));
    const tablesSheet = XLSX.utils.json_to_sheet(state.tables.map((table) => ({
      'Название': table.name,
      'Категория': table.category,
      'Колонки': table.columns.join(' | '),
      'Строки': table.rows.length
    })));

    XLSX.utils.book_append_sheet(workbook, studentsSheet, 'Студенты');
    XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Результаты');
    XLSX.utils.book_append_sheet(workbook, tablesSheet, 'Ведомости');
    XLSX.writeFile(workbook, 'fiz-progress-export.xlsx');
    showToast('Файл Excel экспортирован.', 'success');
  } catch (error) {
    showToast('Ошибка экспорта данных.', 'error');
  }
}

function renderGto() {
  const ageStep = refs.gtoAgeStep.value;
  const gender = refs.gtoGender.value;

  const exerciseList = [
    'Бег 100 м',
    'Прыжок в длину',
    'Подтягивания',
    'Отжимания',
    'Силовой комплекс',
    'Медленный бег'
  ];

  const records = state.gtoRecords.filter((item) => item.ageStep === ageStep && item.gender === gender);

  refs.gtoList.innerHTML = exerciseList.map((exercise) => {
    const record = records.find((item) => item.exercise === exercise);
    return `
      <div class="gto-item">
        <div>
          <strong>${exercise}</strong>
          <span>${record ? `${formatDate(record.date)} · ${record.value} ${record.unit}` : 'Данных нет'}</span>
        </div>
        <span>${record ? record.status : 'Не внесено'}</span>
      </div>
    `;
  }).join('');

  const summary = [
    { label: 'Всего записей', value: `${records.length}` },
    { label: 'Пол', value: gender },
    { label: 'Ступень', value: getAgeStepLabel(ageStep) }
  ];

  refs.gtoSummary.innerHTML = summary.map((item) => `
    <div class="metric"><strong>${item.label}</strong><span>${item.value}</span></div>
  `).join('');
}

function openGtoForm() {
  refs.gtoFormCard.classList.remove('hidden');
  refs.gtoForm.reset();
  updateStudentSelects();
  refs.gtoDate.value = getTodayISO();
  refs.gtoUnit.value = 'с';
}

function handleGtoSubmit(event) {
  event.preventDefault();
  const data = {
    id: generateId('gto'),
    studentId: refs.gtoStudentSelect.value,
    ageStep: refs.gtoAgeStep.value,
    gender: refs.gtoGender.value,
    exercise: refs.gtoExercise.value.trim(),
    date: refs.gtoDate.value,
    value: Number(refs.gtoValue.value),
    unit: refs.gtoUnit.value.trim() || 'с',
    status: 'Проверка по нормативам не задана'
  };

  if (!data.studentId || !data.exercise || !data.date || Number.isNaN(data.value)) {
    showToast('Заполните поля ГТО.', 'error');
    return;
  }

  state.gtoRecords.push(data);
  persistState();
  renderGto();
  refs.gtoFormCard.classList.add('hidden');
  refs.gtoForm.reset();
  showToast('Результат ГТО сохранён.', 'success');
}

function findStudent(studentId) {
  return state.students.find((student) => student.id === studentId) || null;
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const parsed = new Date(dateString + 'T00:00:00');
  return Number.isNaN(parsed.getTime()) ? dateString : parsed.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function generateId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function getAgeStepLabel(value) {
  const labels = {
    '1': '6–8 лет',
    '2': '9–10 лет',
    '3': '11–12 лет',
    '4': '13–15 лет',
    '5': '16–17 лет',
    '6': '18–29 лет',
    '7': '30–39 лет',
    '8': '40–49 лет',
    '9': '50–59 лет',
    '10': '60+ лет'
  };
  return labels[value] || value;
}

function getLastUpdatedDate() {
  const allDates = [
    ...state.results.map((item) => item.date),
    ...state.gtoRecords.map((item) => item.date)
  ];
  if (!allDates.length) return '—';
  return formatDate(allDates.sort().at(-1));
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function showToast(message, type = 'success') {
  refs.toast.textContent = message;
  refs.toast.classList.add('show');
  refs.toast.style.background = type === 'error' ? 'rgba(158, 45, 54, 0.95)' : 'rgba(15, 29, 53, 0.94)';
  clearTimeout(showToast.timerId);
  showToast.timerId = setTimeout(() => refs.toast.classList.remove('show'), 2200);
}

window.addEventListener('storage', () => {
  const saved = loadState();
  if (saved) {
    Object.assign(state, saved);
    renderOverview();
    renderStudents();
    renderResults();
    renderTables();
    renderGto();
  }
});

window.addEventListener('load', () => {
  showSection(currentSection);
});
