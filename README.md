# Timers

![timer](timer.png)

Это клиент-серверное приложение для установки таймеров. Здесь реализованна авторизация и аутентификация, для общения с сервером используется WebSockets, а для хранения данных используется MongoDB.

- authorization/authentication
- Используется WebSockets server/client
- База данных MongoDB

## По умолчанию создается админ

- `LOGIN` : `admin`
- `PASSWORD` : `pwd007`

## Install

```bash
npm install
```

```bash
npm run dev
```

## DEV

Важный момент: для того чтобы избежать конфликта между синтаксисом Vue и Nunjucks последние настроены так, что для серверных шаблонов вместо фигурных скобок используются квадратные:

```js
  tags: {
    blockStart: "[%",
    blockEnd: "%]",
    variableStart: "[[",
    variableEnd: "]]",
    commentStart: "[#",
    commentEnd: "#]",
  },
```
