# Каталог продуктов Matkasym

## Установка и запуск

```bash
# 1. Установи зависимости
npm install

# 2. Запусти локально для проверки
npm run dev

# 3. Собери и задеплой на GitHub Pages
npm run build
npm run deploy
```

## Деплой на GitHub Pages

1. Создай репозиторий на GitHub с названием `products`
2. В папке проекта выполни:

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/matkasym/products.git
git push -u origin main
npm run deploy
```

3. В настройках репозитория GitHub → Settings → Pages → выбери ветку `gh-pages`

4. Сайт будет доступен по адресу:
**https://matkasym.github.io/products/**

## Обновление данных

Данные автоматически читаются из Google Sheets при каждом открытии сайта.
Для обновления фото — добавь ссылки Google Drive в столбец H таблицы.

## Пароль админа

Пароль: `matkasym2024`
Измени его в файле `src/App.jsx` строка `const ADMIN_PASSWORD = 'matkasym2024'`
