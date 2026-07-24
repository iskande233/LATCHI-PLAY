# Codemagic build notes for LATCHI PLAY

This repository is prepared for Codemagic with `codemagic.yaml` in the repository root.

## Workflow to run

Use one of these workflows from Codemagic:

1. **LATCHI PLAY - Android APK** (`latchi-play-android-apk`)
   - Builds a release APK with the current project signing setup.
   - Artifact path: `android/app/build/outputs/apk/release/*.apk`

2. **LATCHI PLAY - Android Debug APK** (`latchi-play-android-debug`)
   - Builds a debug APK if you only need to test installation quickly.
   - Artifact path: `android/app/build/outputs/apk/debug/*.apk`

## Codemagic steps

1. Push this repository to GitHub.
2. Open Codemagic and add the GitHub repository.
3. Select **Use codemagic.yaml**.
4. Choose the Android workflow you want.
5. Start the build.

## Environment used

- Instance type: `mac_mini_m2`
- Node.js: `16.20.2`
- Java: `17`
- Install command: `npm install --legacy-peer-deps --no-audit --no-fund`
- Gradle command for release: `cd android && ./gradlew --no-daemon clean :app:assembleRelease --stacktrace`
- The workflow retries up to 3 times for network/TLS dependency download errors, following the working `latchi-iptv-build` pattern.

## Current Android identity

- App name: `LATCHI PLAY`
- Package/application id: `com.latchi.play`
- Version name: `1.0.0`
- Version code: `1`

## Notes

- The current `android/app/build.gradle` release build uses the existing debug keystore, matching the original project behavior. This is enough for direct APK testing.
- For Play Store publishing, create a real upload keystore in Codemagic and replace the release signing configuration with Codemagic signing variables.
- Do not run `npm audit fix --force` before a Codemagic build; it may upgrade React Native dependencies and break this legacy React Native 0.69 project.
