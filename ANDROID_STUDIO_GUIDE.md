# Passing this Project to Android Studio (Option 1: Capacitor)

This guide takes your full Vite + React + TypeScript web application, builds its production bundle, wraps it with **Capacitor**, and opens it in **Android Studio** as a native Android project with all algorithms, animations, and progress intact.

---

## Prerequisites on your machine
1. **Node.js** (v18 or higher) & **npm**
2. **Android Studio** (latest version with Android SDK & build-tools installed)
3. An Android Virtual Device (Emulator) or a physical Android phone connected via USB with Developer Mode / USB Debugging enabled.

---

## Step 1: Clone or Download this Project
Download your project zip or clone the repository to your local computer:
```bash
cd your-project-folder
npm install
```

---

## Step 2: Install Capacitor Dependencies
Install the Capacitor core, command line tools, and Android platform packages:
```bash
npm install @capacitor/core
npm install -D @capacitor/cli @capacitor/android
```

---

## Step 3: Configure Your Backend API URL
Because this project features an Express + SQLite engine with 50+ endpoints, the Android app makes API calls to your backend:

1. **Option A (Point to your deployed Cloud URL - Recommended):**
   Create or edit `.env` in the root of your project:
   ```env
   VITE_API_URL=https://ais-dev-gdhzxthhl6ucklmntaqlgw-943248683897.asia-southeast1.run.app
   ```
   *(Or your production cloud URL)*

2. **Option B (Point to local computer from Android Emulator):**
   If running `npm run dev` locally on your machine and testing on the Android Studio emulator, use:
   ```env
   VITE_API_URL=http://10.0.2.2:3000
   ```
   *(Android Studio Emulator routes `10.0.2.2` to your machine's `localhost`)*

---

## Step 4: Build the Web App & Initialize Android
Run the production build:
```bash
npm run build
```

Then initialize and add the Android native platform:
```bash
npx cap add android
```
*(This generates an `android/` directory containing the full Gradle & Android Studio project!)*

---

## Step 5: Sync Web Assets to Android
Whenever you update code or build your frontend, sync the assets to the Android folder:
```bash
npm run build
npx cap sync android
```

---

## Step 6: Open in Android Studio
Launch Android Studio with the generated project:
```bash
npx cap open android
```
*(Or open Android Studio manually, choose **Open**, and navigate to the `android/` directory inside this project)*.

---

## Step 7: Run & Debug in Android Studio
1. Wait for Android Studio to finish indexing and syncing Gradle (1–2 minutes on first run).
2. Select your device/emulator in the top toolbar dropdown.
3. Click the green **Run (▶)** button.
4. Your fragrance atelier app will launch as a native Android application!

---

## Useful Shortcut Scripts in `package.json`
You can add these handy scripts to your `package.json` for rapid workflow:
```json
"scripts": {
  "build:android": "vite build && npx cap sync android",
  "open:android": "npx cap open android"
}
```
