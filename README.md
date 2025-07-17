# 🧠 InsightLog CLI

A simple command-line interface (CLI) to post developer logs to [InsightLog](https://github.com/xdSushil/insightlog) — directly from your terminal.

---

## 🚀 Features

- 🔐 Login securely using email/password using insightlog login
- 📝 Create logs with Markdown content and tags
- 🧑‍🤝‍🧑 Post logs to your team using insightlog post
- 🔒 Auth handled via saved token in `.insightlogrc`
- ⚙️ Lightweight, fast, and easy to use
- To log out use insightlog logout

---

## 📦 Installation

> **Note:** Requires Node.js v18+

```bash
npm install -g insightlog-cli
````

---

## 🔧 Usage

```bash
insightlog <command>
```

### 📲 Login

```bash
insightlog login
```

Prompts for your **InsightLog** email and password and securely stores your token locally.

---

### 📝 Post a Log

```bash
insightlog post
```

Prompts for title, content (opens in default editor), and tags.

> You must be part of a team and logged in.

---

### 🔐 Logout

```bash
insightlog logout
```

Clears the saved token and session config.

---

## 📁 Local Config

User session info is saved in your home directory:

```bash
~/.insightlogrc
```

Contents (example):

```json
{
  "token": "JWT_TOKEN",
  "authorId": "user-uuid",
  "teamId": "team-uuid"
}
```

---

## 🛠 Development

Clone and run locally:

```bash
git clone https://github.com/xdSushil/insightlog-cli.git
cd insightlog-cli
npm install
node bin/index.js
```

---

## 📄 License

MIT © [Sushil R](https://github.com/xdSushil)

---

## 🌐 Project Link

Check out the full platform: [InsightLog API & Platform](https://github.com/xdSushil/insightlog)

```
