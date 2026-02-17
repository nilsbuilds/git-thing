# git-thing

A streamlined CLI tool to handle the heavy lifting of feature branch workflows.
Stop typing long Git commands and let `git-thing` manage your branching, switching, and rebasing.

## Description

`git-thing` is a simple utility designed to automate the repetitive parts of a Git-based workflow. It allows you to:

- **Create** new feature branches instantly.
- **Switch** between active tasks without friction.
- **Rebase** your work against the main branch to keep your history clean.

---

## Installation

To use `git-thing` as a permanent command on your machine without using `npx` every time, install it globally:

    npm install -g git-thing

## How to Update

When a new version is published to NPM, sync your local copy by running:

    npm update -g git-thing

## How to Uninstall

If you no longer need the tool, remove it with:

    npm uninstall -g git-thing

---

## Setting up an Alias (e.g., gt)

If `git-thing` is too long to type, you can set up a shorter alias like `gt`.

### macOS and Linux (Zsh or Bash)

1. Open your configuration file (usually `~/.zshrc` or `~/.bashrc`):

   nano ~/.zshrc

2. Add this line at the end:

   alias gt='git-thing'

3. Save, exit, and reload your shell:

   source ~/.zshrc

### Windows (PowerShell)

1. Open your PowerShell profile:

   notepad $PROFILE

2. Add this line:

   Set-Alias -Name gt -Value git-thing

3. Save and restart your PowerShell terminal.

---

## Usage

Once installed (and optionally aliased), you can run the tool from any directory:

    git-thing

    # OR, if aliased:
    gt
