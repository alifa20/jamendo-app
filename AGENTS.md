# Repository Guidelines

This document describes how to work effectively in this repository. It applies to all code under the root unless overridden by a more specific `AGENTS.md` deeper in the tree.

## Project Structure & Modules

- App entry points live under `apps/` (e.g. mobile or web clients).
- Shared libraries and utilities live under `packages/`.
- Documentation, specs, and design notes live under `docs/` and `spec/`.
- iOS assets and screenshots are under `ios-screenshots/` and `@@ios-screenshots/`.

When adding new code, prefer extending existing packages/apps instead of creating new top-level folders.

## Build, Test & Development

- `pnpm install` – install all workspace dependencies.
- `pnpm dev` – run the main app(s) in development mode.
- `pnpm test` – run the test suite.
- `pnpm lint` – run linters/formatting checks.

Use `turbo.json` tasks as the source of truth for app- or package-specific commands.

## Coding Style & Naming

- Use the existing language and framework patterns in the surrounding files (TypeScript/JavaScript, React Native/React).
- Prefer explicit, descriptive names (`useJamendoTracks`, `JamendoPlayerScreen`) over abbreviations.
- Keep files focused: one primary component, hook, or module per file.
- Follow any existing ESLint/Prettier configuration; run `pnpm lint` before opening a PR.

## Testing Guidelines

- Co-locate tests near implementation where practical (e.g. `*.test.ts[x]` alongside source), or follow existing patterns in `spec/`.
- Write tests for new features and bug fixes; keep coverage at least consistent with nearby modules.
- Ensure `pnpm test` passes before pushing.

## Commit & Pull Requests

- Write clear, imperative commit messages (e.g. `Add Jamendo track search screen`, `Fix player pause bug`).
- Keep commits logically scoped; avoid mixing unrelated changes.
- For PRs, include:
  - A concise summary of the change and motivation.
  - Any relevant screenshots or recordings for UI changes.
  - Links to related issues or tickets, if applicable.

## Agent-Specific Notes

- Before editing files, check for a closer `AGENTS.md` in subdirectories and follow its instructions.
- Keep changes minimal and aligned with the existing architecture; prefer small, incremental PRs.
