# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit Conventions

Follow conventional commit format with scope for monorepo packages:

- **Format**: `type(scope): description`
- **Scopes**: Use folder names from `packages/` or `apps/` (e.g., `fix(feature-home)`, `feat(example)`)
- **Examples**:
  - `fix(feature-home): resolve navigation issue`
  - `feat(ui): add new button component`
  - `docs(example): update API integration notes`

## Commands

### Development

```bash
# Install dependencies
pnpm install

# Start development server (all apps)
pnpm dev

# Start specific app
pnpm dev:example

# Run iOS simulator
pnpm ios

# Run Android emulator
pnpm android

# Run web version
pnpm web
```

### Build and Quality

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm build:example

# Run linter
pnpm lint

# Run tests
pnpm test
```

### fspec (Specification Management)

This project uses fspec for ACDD (Acceptance Criteria Driven Development). See `spec/CLAUDE.md` for complete workflow.

```bash
# Sync fspec version
fspec --sync-version 0.9.1

# Load fspec context
fspec bootstrap

# Common fspec commands (see spec/CLAUDE.md for full reference)
fspec list-work-units                    # View work backlog
fspec show-work-unit WORK-001            # Show work unit details
fspec update-work-unit-status WORK-001 specifying  # Move through workflow
fspec validate                           # Validate Gherkin syntax
fspec format                             # Format feature files
```

**Important**: Before writing code, consult `spec/CLAUDE.md` for the complete ACDD workflow (Example Mapping → Gherkin specs → Tests → Implementation).

## Architecture

### Monorepo Structure

This is a Turborepo-based monorepo using pnpm workspaces:

- **`apps/example`**: Main Jamendo music app (Expo/React Native)
- **`packages/feature-home`**: Home screen features (search, track listing)
- **`packages/ui`**: Shared UI components
- **`packages/eslint-config`**: Shared ESLint configuration

### Technology Stack

- **Expo 54.x**: Cross-platform framework (iOS/Android/Web)
- **React 19.1.0**: UI library
- **React Native 0.81.4**: Mobile runtime
- **Expo Router 6.x**: File-based navigation (app directory)
- **pnpm**: Package manager
- **Turborepo**: Monorepo build orchestration
- **Jest**: Testing framework

### Navigation

The app uses **Expo Router** with file-based routing:

- **Root Layout**: `apps/example/app/_layout.tsx` (theme provider, Stack navigator)
- **Tab Layout**: `apps/example/app/(tabs)/_layout.tsx` (bottom tabs)
- **Screens**: Files in `app/(tabs)/` become tab screens
- **Modals**: `app/modal.tsx` (modal presentation)

Navigation anchor is set to `(tabs)` directory via `unstable_settings.anchor`.

### Package Dependencies

**Workspace Protocol**: Internal packages use `workspace:*` protocol in package.json:
- `@jamendo/feature-home` → depends on `@jamendo/ui`
- `@jamendo/app-example` → depends on `@jamendo/feature-home`

**Build Order**: Turborepo handles dependency graph (`dependsOn: ["^build"]` in turbo.json)

### API Integration

- **Jamendo API v3.0**: Track search and playback
- **Endpoint**: `https://api.jamendo.com/v3.0/tracks`
- **Environment**: `EXPO_PUBLIC_JAMENDO_CLIENT_ID` required (create `.env` in app directory)
- **Documentation**: https://developer.jamendo.com/v3.0/tracks

### State Management

Project is designed for Redux (mentioned in README), but current implementation may vary. Check `packages/feature-home/src/` for actual state management approach.

## Development Guidelines

### Adding New Features

1. **Create work unit** using fspec (see `spec/CLAUDE.md`)
2. **Shared features**: Add to `packages/feature-home/src/`
3. **App-specific**: Add to `apps/example/app/`
4. **UI components**: Add to `packages/ui/src/`
5. **Follow ACDD workflow**: Example Mapping → Gherkin specs → Tests → Implementation

### Testing

- **Test location**: Co-locate tests with source (`__tests__/` directories)
- **Jest preset**: `jest-expo` for React Native compatibility
- **Coverage**: Link tests to Gherkin scenarios using `fspec link-coverage`
- **Run tests**: `pnpm test` (runs across all packages via Turborepo)

### TypeScript

- **Strict mode**: Enabled across all packages
- **Shared config**: `@tsconfig/recommended` in packages
- **Type checking**: Happens during build (`pnpm build`)

### Expo Specifics

- **Metro bundler**: Configured in `metro.config.js`
- **App configuration**: `app.json` (app name, version, assets)
- **EAS Build**: `eas.json` for cloud builds (post-install: `pnpm run -w build:example`)

## Code Style

### Prettier

Configuration in root `package.json`:
- **Print width**: 100
- **Tab width**: 2 spaces
- **Single quotes**: true
- **Trailing commas**: ES5

### ESLint

- **Shared config**: `@jamendo/eslint-config`
- **Ignore patterns**: `node_modules`, `build`, `.expo`, `*.d.ts`
- **Node.js files**: `*.js` files have node environment enabled

## Environment Configuration

### Required Environment Variables

Create `.env` in `apps/example/` directory:

```
EXPO_PUBLIC_JAMENDO_CLIENT_ID=your_client_id_here
```

**Important**: `.env` files are gitignored. Never commit API credentials.

### Getting Jamendo API Key

1. Sign up at https://developer.jamendo.com/
2. Create an application
3. Copy client ID to `.env` file

## Turborepo Tasks

### Task Pipeline

Defined in `turbo.json`:

- **`build`**: Depends on upstream packages (`^build`), outputs to `build/` and metro cache
- **`dev`**: Interactive, persistent, no cache
- **`lint`**: No outputs
- **test**: Inputs are `**/*.{ts,tsx,js,jsx}` files

### Task Execution

```bash
# Run task for specific package
turbo build --filter="...{./apps/example}"

# Run task with dependencies
turbo dev --filter="{./apps/example}..."
```

## Known Patterns

### Package Naming

- **Scoped packages**: All use `@jamendo/` scope
- **App naming**: `@jamendo/app-{name}` (e.g., `@jamendo/app-example`)
- **Feature naming**: `@jamendo/feature-{name}`
- **Shared packages**: `@jamendo/{name}` (ui, eslint-config)

### File Naming

- **React components**: PascalCase (e.g., `HomeMessage.tsx`)
- **Feature files**: kebab-case (e.g., `user-authentication.feature`)
- **Test files**: `{component}.test.ts` in `__tests__/` directory

### Component Exports

Packages use barrel exports (index.ts) for cleaner imports:

```typescript
// packages/feature-home/src/index.ts
export * from './HomeMessage';
export * from './HomeMessageIcon';
```

## fspec Integration

This project follows **ACDD (Acceptance Criteria Driven Development)** using fspec:

1. **Specifications**: All acceptance criteria in `spec/features/*.feature` (Gherkin format)
2. **Project management**: Work units tracked in `spec/work-units.json`
3. **Foundation**: Architecture documented in `spec/foundation.json` and `spec/FOUNDATION.md`
4. **Workflow**: backlog → specifying → testing → implementing → validating → done

**Before implementing features**, read `spec/CLAUDE.md` for the complete specification workflow, Example Mapping, and quality gates.

## Troubleshooting

### Common Issues

1. **Build failures**: Run `pnpm install` to ensure dependencies are current
2. **Metro bundler errors**: Clear cache with `pnpm dev -- --clear`
3. **iOS build issues**: Delete `ios/` directory and run `pnpm ios` (Expo will regenerate)
4. **Android build issues**: Clean gradle cache in `.gradle/` directory
5. **Type errors**: Run `pnpm build` to check TypeScript across all packages
6. **fspec errors**: Run `fspec bootstrap` to reload context

### Expo Specific

- **Clear Expo cache**: `rm -rf .expo` then restart dev server
- **Reset Metro cache**: `rm -rf node_modules/.cache/metro`
- **Regenerate native projects**: Delete `ios/` and `android/`, then run platform command

## References

- **Expo Documentation**: https://docs.expo.dev/
- **React Native Documentation**: https://reactnative.dev/
- **Expo Router**: https://docs.expo.dev/router/introduction/
- **Turborepo**: https://turbo.build/repo/docs
- **Jamendo API**: https://developer.jamendo.com/v3.0
- **fspec Workflow**: See `spec/CLAUDE.md`
- make sure in your commit messages or pr description or titles you dont mention claude
- for git commit do not mention claude
- do not mention messages  like this in git commit: 🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>