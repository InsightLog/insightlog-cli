#!/usr/bin/env node

import fs from "fs-extra";
import os from "os";
import path from "path";
import axios from "axios";
import inquirer from "inquirer";
import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

// Config
const API_BASE_URL = process.env.BASE_URL
const configPath = path.join(os.homedir(), ".insightlogrc");

// Save config locally
async function saveConfig(data) {
  await fs.writeJSON(configPath, data, { spaces: 2 });
  console.log(chalk.green("✅ Configuration completed and saved to .insightlogrc"));
}

// Load config
async function loadConfig() {
  if (await fs.pathExists(configPath)) {
    return fs.readJSON(configPath);
  }
  throw new Error("❌ Not logged in. Please run `insightlog login` first.");
}

// Login Command
async function login() {
  const { email, password } = await inquirer.prompt([
    { name: "email", message: "Email:", type: "input" },
    { name: "password", message: "Password:", type: "password", mask: "*" },
  ]);

  try {
    const res = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });

    const { token, user } = res.data;

    if (!user.teamId) {
      console.log(chalk.yellow("⚠️ You are not part of any team yet."));
    }

    await saveConfig({
      token,
      authorId: user.id,
      teamId: user.teamId || null,
    });
  } catch (err) {
    console.error(chalk.red("❌ Login failed:"), err?.response?.data || err.message);
  }
}

// Post Log Command
async function postLog() {
  try {
    const config = await loadConfig();

    const answers = await inquirer.prompt([
      { name: "title", message: "Log Title:" },
      { name: "content", message: "Log Content (Markdown):", type: "editor" },
      { name: "tags", message: "Comma-separated tags:" },
    ]);

    const { title, content, tags } = answers;
    const trimmedTitle = title.trim();
    const res = await axios.post(
      `${API_BASE_URL}/logs`,
      {
        title: trimmedTitle,
        content,
        tags: tags.split(",").map((t) => t.trim()),
        teamId: config.teamId,
        authorId: config.authorId
      },
      {
        headers: {
          Authorization: `Bearer ${config.token}`,
        },
      }
    );

    console.log(chalk.green("✅ Log created successfully!"));
    console.log("Log ID:", res.data.log.id);
  } catch (err) {
    console.error(chalk.red("❌ Failed to create log:"), err?.response?.data || err.message);
  }
}

async function logout() {
  try {
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
      console.log(chalk.green("✅ Logged out successfully."));
    } else {
      console.log(chalk.yellow("⚠️ Not logged in."));
    }
  } catch (err) {
    console.error(chalk.red("❌ Logout failed:"), err.message);
  }
}

// CLI Entry
const [,, command] = process.argv;

(async () => {
  switch (command) {
    case "login":
      await login();
      break;
    case "post":
      await postLog();
      break;
    case "logout":
      await logout();
      break;
    default:
      console.log(chalk.blueBright("InsightLog CLI"));
      console.log("Usage:");
      console.log("  insightlog login       # Log in to your InsightLog account");
      console.log("  insightlog post        # Post a new log");
      console.log("  insightlog logout      # Log out and remove credentials");
      break;
  }
})();
