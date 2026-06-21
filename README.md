# PakSigns

> [Live](https://GGCOkara.github.io/PakSigns/)

An interactive educational helper tool designed to assist driving license candidates in Pakistan as they prepare for the official computerized driving license e-sign test (DLIMS).

The application offers bilingual support (English and Urdu) and covers road markings, traffic signs, and standard right-of-way rules using simulators, flashcards, and interactive visual aids.

---

## Key Features

- **Categorized Study Guide:** Browse traffic signs grouped by _Mandatory_, _Warning_, _Informatory_, and _Road Markings_.
- **Spaced Repetition ("Need Practice"):** Automatically tracks signs answered incorrectly during tests and lets you filter your study guide to focus on weak areas.
- **Bilingual Engine:** Swap the entire application layout, text, and typography between English and Urdu (featuring optimized line-height configurations to support Urdu Nastaliq typography).
- **Audio Read-Aloud:** Utilizes the Web Speech Synthesis API to read sign descriptions out loud in either Urdu or English voices (depending on the active language).
- **Interactive Flashcards:** Toggle to flashcard mode to test yourself with customizable decks, progress indicators, and front/back card rotations.
- **E-Sign Mock Test Simulator:** Custom-configure practice exams with a choice of question counts, strict mode rules (where failing any mandatory sign fails the test instantly), and instant or end-of-test feedback.
- **Traffic Rules Challenge:** A gamified experience presenting road scenarios with custom vector graphics (SVGs) to build decision-making and right-of-way skills.
- **Interactive Road Visualizer:** A visual container representing standard Pakistani road segments where tapping on the lanes, zebra crossings, curb paint, or box junctions details the corresponding highway code.
- **Material 3 Design Theme:** Fully supports light and dark modes with responsive design variables matching Material 3 specifications.

---

## Technical Specifications

- **Frontend:** Vanilla HTML5, CSS3, and ES6+ JavaScript.
- **Data Hydration:** Safely processes sign catalogs and scenarios locally via async `fetch` queries.
- **Speech Synthesis:** Uses native browser API support (`window.speechSynthesis`) with locale lookups to provide bilingual TTS.
- **State Management:** Tracks performance stats, active bookmarks, and weak signs utilizing local persistence via the Web Storage API (`localStorage`).
- **Optimization:** Utilizes document fragments and event delegation on high-density grids to minimize DOM writes and redundant event listeners.

---

## Local Development & Setup

Due to browser security policies regarding asynchronous XMLHttpRequests (`fetch` calls) on local files (using the `file://` protocol), the database file (`db.json`) cannot be read directly through double-clicking `index.html` on your desktop.

To run the application locally, you must host it on a local development server:

### Option 1: VS Code (Recommended)

1. Open the project directory in **Visual Studio Code**.
2. Install the **Live Server** extension by Ritwick Dey.
3. Click the **Go Live** button in the bottom right status bar of VS Code.

### Option 2: Python HTTP Server

If you have Python installed on your computer, run one of the following commands in your terminal from the root folder of the project:

_For Python 3:_

```bash
python -m http.server 8080
```

_For Python 2:_

```bash
python -m SimpleHTTPServer 8080
```

Then, navigate to `http://localhost:8080` in your web browser.

### Option 3: Node.js (http-server)

Install the `http-server` package globally using NPM:

```bash
npm install -g http-server
```

Run the server in the project directory:

```bash
http-server -p 8080
```

Open `http://localhost:8080` in your web browser.

---

## Contributions & Credits

Developed with a focus on safety and interactive learning.

- **Developers:** GGCOkara, Pro Bandey, and M Ramzan Ch.
- **Demo** [GGCOkara GitHub Pages](https://GGCOkara.github.io/PakSigns/)

For bug reports or feature suggestions, please open an issue or pull request in the repository.

```

```
