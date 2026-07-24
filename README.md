<h1 align="center">
  <br>
  <img src="src/assets/logo/logo.png" alt="LATCHI PLAY" width="220">
  <br>
  LATCHI PLAY
  <br>
</h1>

<h4 align="center">React Native movie and TV app rebranded for LATCHI PLAY.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#android-build">Android Build</a> •
  <a href="#changes-in-this-fork">Changes</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

## Features

- Movies and TV shows catalog powered by TMDb metadata.
- Vidking/Vidfast playback integration with WebView based stream discovery.
- Home, search, details, TV seasons/episodes, subtitles, downloads and continue-watching screens.
- New **LATCHI PLAY** branding, Android application id `com.latchi.play`, and fresh generated icons.

## Changes in this fork

- Rebranded the app from Flick to **LATCHI PLAY**.
- Added the missing `src/providers/KrazyDevsScrapper` modules so imports resolve again.
- Added a shared TMDb compatibility provider for FlixHQ, SolarMovie, FMovies, Vega and Vidking UI paths.
- Added a React Native `WebViewScrapper` implementation for Vidking/Vidfast embed pages.
- Removed obsolete APK build artifacts from the new clean repository history.

## Codemagic Build

This repository includes `codemagic.yaml` with ready Android workflows:

- **LATCHI PLAY - Android APK**: builds a release APK.
- **LATCHI PLAY - Android Debug APK**: builds a debug APK for quick testing.

See `CODEMAGIC_SETUP.md` for the exact Codemagic steps.

## Local Android Build

```bash
npm install --legacy-peer-deps
cd android
./gradlew assembleDebug
```

The debug APK is generated under `android/app/build/outputs/apk/debug/`.

## Credits

This project is based on the open-source Flickv3 project by [Wendale Franz Dy](https://github.com/sheeshcake) and provider work by [Elijah Abgao](https://github.com/skeltonmod).

## License

MIT
