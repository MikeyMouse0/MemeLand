'use strict';

// Простая маршрутизация с использованием hash
function router() {
  const hash = window.location.hash || '#memes';
  if (hash === '#memes') {
    renderMemes();
  } else if (hash === '#profile') {
    renderProfile();
  } else if (hash === '#post') {
    renderPostForm();
  } else {
    document.getElementById('content').innerHTML = '<h2>Страница не найдена</h2>';
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

// Функции для работы с Local Storage ("имитация базы данных")
function getMemes() {
  return JSON.parse(localStorage.getItem('memes')) || [];
}

function saveMeme(meme) {
  const memes = getMemes();
  memes.push(meme);
  localStorage.setItem('memes', JSON.stringify(memes));
}

function getUser() {
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    // Инициализируем базовые данные пользователя, если их нет
    user = {
      username: 'User',
      nickname: 'Nickname',
      description: 'Описание пользователя'
    };
    localStorage.setItem('user', JSON.stringify(user));
  }
  return user;
}

// Рендеринг страницы "Мемы"
function renderMemes() {
  const memes = getMemes();
  let html = '<h2 class="mt-3">Мемы</h2>';
  if (memes.length === 0) {
    html += '<p>Нет мемов. Добавьте первый!</p>';
  } else {
    memes.forEach(m => {
      html += `<div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${m.title}</h5>
          <p class="card-text">${m.description}</p>
          ${m.image ? `<img src="${m.image}" class="img-fluid" alt="Мем">` : '' }
          <p class="text-muted" style="font-size: 0.8em;">Опубликовано: ${new Date(m.createdAt).toLocaleString()}</p>
        </div>
      </div>`;
    });
  }
  document.getElementById('content').innerHTML = html;
}

// Рендеринг страницы "Профиль"
function renderProfile() {
  const user = getUser();
  const html = `<h2 class="mt-3">Профиль</h2>
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">${user.nickname}</h5>
        <p class="card-text"><strong>Username:</strong> ${user.username}</p>
        <p class="card-text"><strong>Описание:</strong> ${user.description}</p>
      </div>
    </div>`;
  document.getElementById('content').innerHTML = html;
}

// Рендеринг формы для постинга мемов
function renderPostForm() {
  const html = `<h2 class="mt-3">Постинг мемов</h2>
  <form id="postForm">
    <div class="form-group">
      <label for="title">Заголовок</label>
      <input type="text" class="form-control" id="title" required>
    </div>
    <div class="form-group">
      <label for="description">Описание</label>
      <textarea class="form-control" id="description" rows="3"></textarea>
    </div>
    <div class="form-group">
      <label for="image">URL изображения (опционально)</label>
      <input type="url" class="form-control" id="image">
    </div>
    <button type="submit" class="btn btn-primary">Опубликовать мем</button>
  </form>`;
  document.getElementById('content').innerHTML = html;
  
  document.getElementById('postForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const meme = { title, description, image, createdAt: new Date().toISOString() };
    saveMeme(meme);
    window.location.hash = '#memes'; // После публикации перенаправляем на раздел "Мемы"
  });
}
