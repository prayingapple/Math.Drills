# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

This repository is a simple Vue.js-based arithmetic drill for first-grade students. It generates multi-digit addition and subtraction problems, scores the answers, and shows a success/failure image based on the score.

Key points from `README.md`:
- Targets first-grade learners, generating multi-digit addition and subtraction problems.
- Displays a "well done" mark when 80% or more of the answers are correct.
- Installation is static: place `calc.html`, the `js` directory, and the `img` directory together in any directory on a web server or local filesystem.
- Planned future work: add multiplication and division.

## Running and developing the app

There is no build system, package manager, or automated test/lint setup. The app is a static HTML page with a JS file and image assets.

- **Run the app (static)**: open `calc.html` directly in a modern browser.
- **Run via a simple static server (optional)**: serve the repository root with any static HTTP server (for example, using `python -m http.server` from the project root) and open `calc.html` via `http://localhost:PORT/calc.html`.

Since there is no bundler or transpilation step, changes to `js/main.js` or `calc.html` take effect immediately on refresh.

## High-level architecture

### Entry HTML (`calc.html`)

- Declares the page structure and loads Vue from a CDN via `<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>`.
- Mounts the Vue app on `<div id="app">`.
- Renders a list of questions with `v-for="item in lists"` and uses Vue template bindings (`{{ ... }}`) to show operands and feedback.
- Each answer input has an `id` of the form `a{{item.id}}`, which `js/main.js` relies on when checking answers.
- Shows the result section conditionally using `v-bind:style="{ display: resultDisplay }"` and displays an image whose path is derived from the reactive `goodOrBad` flag: `./img/{{ goodOrBad }}.jpg`.

### Vue app (`js/main.js`)

The core logic lives in a single Vue instance:

- **Mount point**: `el: '#app'` corresponds to the container in `calc.html`.
- **Reactive state** (in `data`):
  - `maxNum`: number of questions to generate.
  - `pointsPerQuestion`: score per correct answer.
  - `score`: accumulated score.
  - `goodOrBad`: selects the result image by filename (`good` or `bad`).
  - `wasPushed`: disables the "こたえあわせ" button after first use.
  - `resultDisplay`: CSS `display` value controlling visibility of the result block (`'none'` / `'block'`).
  - `lists`: array of question objects rendered by the template.
- **Question generation** (`mounted` hook):
  - On mount, loops `maxNum` times and pushes question objects into `lists`.
  - Each question object has:
    - `id`: index used for stable keys and for tying DOM input IDs to data.
    - `numberOne` / `numberTwo`: random integers in `[0, maxOperand]`, allowing multi-digit operands.
    - `operator`: `'+'` or `'-'`. For subtraction, the larger operand is placed first so answers are non-negative.
    - `maruBatsu`: initially `''`, later set to `'O'` or `'X'` after grading.
- **Grading logic** (`methods.rightOrWrong`):
  - Iterates over `lists`, computes `correctAnswer = numberOne + numberTwo` when `operator` is `'+'`, or `numberOne - numberTwo` when it is `'-'`.
  - Reads the user-entered answer from the DOM via `document.getElementById('a' + i).value` and compares with `parseInt(myAnswer, 10)`.
  - For correct answers, marks `maruBatsu = 'O'` and increments `score` by `pointsPerQuestion`; otherwise sets `maruBatsu = 'X'`.
  - After grading all questions, compares `score` against `pointsPerQuestion * maxNum * 0.8` to decide whether `goodOrBad` is `'good'` or `'bad'`, which in turn selects `img/good.jpg` or `img/bad.jpg`.
  - Sets `wasPushed = true` so the button is disabled and `resultDisplay = 'block'` so the result section becomes visible.

The HTML template, Vue data, and grading logic are tightly coupled via:
- DOM element IDs (`a0`, `a1`, ...) derived from `item.id`.
- Image filenames (`good.jpg`, `bad.jpg`) derived from the `goodOrBad` flag.
- The `lists` array serving as the single source of truth for questions and per-question feedback.

## Notes for future changes

- The app assumes a plain browser environment with global `Vue`; there is no module system. If you introduce build tooling (e.g., bundlers or frameworks), keep backward compatibility in mind or update `calc.html` accordingly.
- When extending operations (e.g., multiplication, division), the grading logic in `js/main.js` and the question display template in `calc.html` will both need coordinated changes.
