# CI/CD Workflows

This directory contains GitHub Actions workflows for the Jamendo Music App.

## Workflows

### test.yml - Continuous Integration

Runs on every push to `main` and on pull requests.

**Jobs:**

1. **packages** (Ubuntu)
   - Linting (`pnpm lint`)
   - Building (`pnpm build`)
   - Unit/Integration tests (`pnpm test`)

2. **e2e** (macOS)
   - Installs Maestro CLI
   - Sets up iOS Simulator (iPhone 15 Pro, iOS 17.2)
   - Runs Expo app in simulator
   - Executes Maestro E2E tests
   - Uploads test artifacts on failure

### Required GitHub Secrets

To run E2E tests in CI, you need to configure the following secrets in your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

#### JAMENDO_CLIENT_ID

Your Jamendo API client ID.

**How to get it:**
1. Go to https://developer.jamendo.com/
2. Sign up or log in
3. Create an application
4. Copy the `client_id`
5. Add it as a GitHub secret: `JAMENDO_CLIENT_ID`

**Value format:**
```
your-client-id-here
```

## Local Development

To run tests locally:

```bash
# Unit/Integration tests
pnpm test

# Linting
pnpm lint

# Build
pnpm build

# E2E tests (requires Maestro installed and app running)
pnpm test:e2e
```

### Running E2E Tests Locally

1. **Install Maestro:**
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   ```

2. **Start the app:**
   ```bash
   cd apps/example
   pnpm ios  # or pnpm android
   ```

3. **In another terminal, run E2E tests:**
   ```bash
   cd apps/example
   maestro test .maestro
   ```

## E2E Test Configuration

### iOS Simulator Setup

The CI uses `futureware-tech/simulator-action@v3` to set up an iOS simulator with:
- Model: iPhone 15 Pro
- iOS Version: 17.2

### Maestro Tests Location

E2E tests are located in:
```
apps/example/.maestro/
├── home-screen.yaml    # Home screen search and track listing tests
└── README.md          # Maestro test documentation
```

### Test Results

On test failure, artifacts are uploaded including:
- Test results from `.maestro/results/`
- Screen recordings (`.mp4` files)
- Available for 7 days

## Troubleshooting

### E2E Tests Failing

1. **Check Maestro installation:**
   - Verify Maestro CLI is installed correctly
   - Check logs in the "Install Maestro" step

2. **Check simulator setup:**
   - Ensure iOS simulator started successfully
   - Check logs in "Setup iOS Simulator" step

3. **Check app startup:**
   - Verify Expo dev server started
   - Check logs in "Start Expo Dev Server" step
   - May need to increase wait time if app takes longer to start

4. **Check environment variables:**
   - Verify `JAMENDO_CLIENT_ID` secret is set
   - Check `.env` file creation in logs

### Extending Wait Time

If the app takes longer to start, increase the wait time:

```yaml
- name: ⏳ Wait for app to start
  run: sleep 60  # Increase from 30 to 60 seconds
```

## Adding More E2E Tests

To add more Maestro tests:

1. Create new `.yaml` files in `apps/example/.maestro/`
2. Follow the existing test structure
3. Reference the feature file being tested
4. Tests will run automatically in CI

See `apps/example/.maestro/README.md` for Maestro test writing guide.

## Alternative: Maestro Cloud

For faster CI runs and better reliability, consider using Maestro Cloud:

1. Sign up at https://console.mobile.dev/
2. Get your API key
3. Add it as a GitHub secret: `MAESTRO_CLOUD_API_KEY`
4. Update the workflow to use Maestro Cloud

**Maestro Cloud workflow example:**

```yaml
- name: 🧪 Run Maestro E2E Tests on Cloud
  working-directory: apps/example
  env:
    MAESTRO_CLOUD_API_KEY: ${{ secrets.MAESTRO_CLOUD_API_KEY }}
  run: |
    maestro cloud \
      --apiKey $MAESTRO_CLOUD_API_KEY \
      --app ./apps/example/build/app.apk \
      .maestro
```

Benefits:
- No need for macOS runners (faster and cheaper)
- Better device variety
- Parallel test execution
- Better video recordings and screenshots

## References

- [Maestro Documentation](https://maestro.mobile.dev/)
- [Expo + Maestro Guide](https://maestro.mobile.dev/blog/pokedex-ui-testing-series-getting-started-with-maestro-in-expo-react-native-part-1)
- [EAS Build with E2E Tests](https://docs.expo.dev/eas/workflows/examples/e2e-tests/)
- [GitHub Actions - futureware-tech/simulator-action](https://github.com/futureware-tech/simulator-action)
