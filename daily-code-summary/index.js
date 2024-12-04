#!/usr/bin/env node

const simpleGit = require("simple-git");
const git = simpleGit();

const { Command } = require("commander");
const program = new Command();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const API_KEY_FOR_GEMINI="your_key"
const genAI = new GoogleGenerativeAI(API_KEY_FOR_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function getUncommittedChanges() {
  try {
    const diff = await git.diff(); // Get diff of uncommitted changes
    if (!diff.trim()) {
      console.log(chalk.green("No uncommitted changes found."));
      return null;
    }

    // Use AI to summarize the changes
    const prompt = `Summarize the following code changes:\n${diff}`;
    const result = await model.generateContent(prompt);
    return {
      title: "Uncommitted Changes",
      content: result.response.text(),
    };
  } catch (error) {
    console.error(chalk.red("Error fetching uncommitted changes:", error));
    return [];
  }
}
async function getCommittedChanges() {
  try {
     const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
     const log = await git.raw([
       "log",
       `--since=${today}`,
       "--pretty=format:%H %s", // Commit hash and message
     ]);
 
     if (!log.trim()) {
       console.log(chalk.green("No commits found for today."));
       return [];
     }

    const summaries = await Promise.all(
      log.all.map(async (commit) => {
          const diff = await git.show([commit.hash]); 
        const prompt = `Summarize the following commit:\n${commit.message}\nDiff: ${diff}`;
        const result = await model.generateContent(prompt);
        return {
          commit: commit.message,
          summary: result.response.text(),
        };
      })
    );

    return summaries;
  } catch (error) {
    console.error(chalk.red("Error fetching committed changes:", error));
    return [];
  }
}
async function getPushedChanges() {
  try {
    const today = new Date().toISOString().split('T')[0];  // Get today's date in YYYY-MM-DD format

    // Get the current branch name
    const currentBranch = await git.revparse(['--abbrev-ref', 'HEAD']);
    console.log(chalk.blue(`Fetching commits for the current branch: ${currentBranch}`));

    // Fetch latest changes from remote
    await git.fetch();

    // Get log of all commits since the start of today on the remote branch
    const log = await git.log([
      '--since', `${today} 00:00:00`, // Use the correct date format
      `origin/${currentBranch}` // Get commits from the current branch
    ]);
    if (log.total === 0) {
      console.log(chalk.green('No commits found for today.'));
      return [];
    }

    const summaries = await Promise.all(
      log.all.map(async (commit) => {
        const prompt = `Summarize the following commit:\n${commit.message}\nDiff: ${await git.show([commit.hash])}`;
        const result = await model.generateContent(prompt);
        return {
          commit: commit.message,
          summary: result.response.text(),
        };
      })
    );

    return summaries;
  } catch (error) {
    console.error(chalk.red('Error fetching committed changes:', error));
    return [];
  }
}
async function generateReport() {
  console.log("Hello...It's daily summary here");
  console.log(chalk.blue("Generating daily code summary..."));

  const uncommitted = await getUncommittedChanges();
  const committed = await getCommittedChanges();
  const pushed= await getPushedChanges();
  const report = `
 # Daily Code Summary
 
 ## Uncommitted Changes
 ${uncommitted ? uncommitted.content : "No uncommitted changes."}
 
 ## Committed Changes
 ${
   committed.length > 0
     ? committed.map((c) => `- ${c.commit}: ${c.summary}`).join("\n")
     : "No commits found."
 }
 
 ## Pushed Changes
 ${
  pushed.length > 0
  ? pushed.map((c) => `- ${c.commit}: ${c.summary}`).join("\n")
  : "No commits found."
 }
 ---
 
 Generated on ${new Date().toLocaleString()}
 `;

  // Save the report
  const filePath = path.join(process.cwd(), "daily-summary.md");
  fs.writeFileSync(filePath, report);

  console.log(chalk.green(`Report generated: ${filePath}`));
}


program
  .command("generate")
  .description("Generate a daily code summary report")
  .action(() => {
    generateReport();
  });

program.parse(process.argv);
