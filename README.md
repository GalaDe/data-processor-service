# Data Processor Service

TypeScript CLI that reads txt files of quoted CSV records (first name, last name, street, city, state, age), normalizes addresses into households, counts occupants per household, and prints a report. It also lists all adults **older than 18** (strictly `> 18`) sorted by last name then first name.

---

## Features

* Read one or many input `.txt` files (quoted CSV per line)
* Normalize addresses (street/city/state) into household
* Report household occupant counts
* Report adults (> 18) sorted by Last → First
* Integration and unit tests via Jest + ts-jest

---

## Requirements

* **Node.js** ≥ 16 (18+ recommended)
* **npm**

---

## Install

```bash
npm install
```

---

## Project Structure

```
data-processor-service/
├─ package.json
├─ tsconfig.json                 # compiles only src → bin
├─ jest.config.cjs               # Jest + ts-jest config
├─ src/
│  ├─ models/
│  │  ├─ Person.ts
│  │  └─ Address.ts
│  ├─ helpers/
│  │  ├─ csvParser.ts
│  │  └─ normalize.ts
│  ├─ processor.ts               
│  └─ index.ts                   # CLI entry (runs main)
├─ tests/
│  ├─ unit/
│  │  ├─ buildReport.test.ts
|  |  ├─ csvParser.test.ts
│  │  └─ normalize.test.ts 
│  └─ integration/
│     └─ dataProcessor.integration.test.ts
├─ data/
│  ├─ input.txt
│  └─ expected_output.txt        # expected result used by integration test
└─ bin/
```

---

## Build

```bash
npm run build   # compiles src → bin
```

---

## Run (CLI)

Use `npm start` and pass arguments after `--` so npm forwards them to the script.

```bash
# write output to file
npm start -- data/input.txt --out=data/output.txt

# or print to console
npm start -- data/input.txt
```

> **Note**: The CLI entry is `bin/index.js`. The usage line is printed dynamically based on the actual entry path.

---

## Test

```bash
# build app (pretest will also build)
npm run build

# run all tests
npm test

# watch mode
npm run test:watch

# run only integration test
npm test -- -t "CLI output matches expected file"
```

### Integration test

The integration test executes the compiled CLI and compares `data/output.txt` against `data/expected_output.txt`.

---

## Input Format

Each line in `data/input.txt` is a *quoted* CSV row:

```
"Dave","Smith","123 main st.","seattle","wa","43"
"Alice","Smith","123 Main St.","Seattle","WA","45"
...
```

Fields: FirstName, LastName, Street, City, State, Age

---

## Output Format

Two sections of plain text:

1. **Households (normalized address) and occupant counts**

   * Households are grouped by a canonical address key (lowercased street w/o punctuation, city lowercased for key but printed as `Titlecase`, state uppercased).
   * Sorted by **State → City → Street**.

2. **Adults (> 18) sorted by Last Name, then First Name**

   * Strictly older than 18; exactly 18-year-olds are not included.

Example (matches `data/expected_output.txt`):

```
Households (normalized address) and occupant counts:
- 234 2nd ave, Tacoma, FL -> 1
- 123 main st, Seattle, WA -> 4
- 234 2nd ave, Seattle, WA -> 1
- 345 3rd blvd apt 200, Seattle, WA -> 2
- 234 2nd ave, Tacoma, WA -> 2

Adults (> 18) sorted by Last Name, then First Name:
Johnson, Carol | 234 2nd ave, Seattle, WA | Age 67
Jones, Frank | 234 2nd ave, Tacoma, FL | Age 23
Smith, Alice | 123 main st, Seattle, WA | Age 45
Smith, Dave | 123 main st, Seattle, WA | Age 43
Smith, Eve | 234 2nd ave, Tacoma, WA | Age 25
Williams, Bob | 234 2nd ave, Tacoma, WA | Age 26
```

> The leading dash (`- `) is a visual bullet for readability.

---

## 🧭 Normalization Rules (summary)

* **Street**: lowercased; periods and commas removed; internal whitespace collapsed (e.g., `"345 3rd Blvd., Apt. 200" → "345 3rd blvd apt 200"`).
* **City**: lowercased for the key; displayed as `Titlecase` (first letter uppercased).
* **State**: uppercased (`wa` → `WA`).

These rules ensure minor variations of the same address group into one household.

---

## 🔧 npm Scripts

```json
{
  "build": "tsc -p tsconfig.json",
  "start": "node bin/index.js",
  "start:demo": "node bin/index.js data/input.txt --out=data/output.txt",
  "dev": "tsc --watch",
  "pretest": "npm run build",
  "test": "jest",
  "test:watch": "jest --watch",
  "coverage": "jest --coverage"
}
```

---

## Debugging (VS Code)

Create `.vscode/launch.json` with a config to debug the **current test file**:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Jest: Current Test File",
      "program": "${workspaceFolder}/node_modules/jest/bin/jest.js",
      "args": ["--runInBand", "--watchAll=false", "${fileBasenameNoExtension}"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal",
      "runtimeArgs": ["--inspect-brk"],
      "disableOptimisticBPs": true
    }
  ]
}
```
---

## Troubleshooting

* **Preset ts-jest not found**: ensure `ts-jest` is installed and config file is `jest.config.cjs` (CommonJS). Clear cache: `npx jest --clearCache`.
* **Cannot find module 'fs' types**: install `@types/node` and add `"types": ["node"]` in `tsconfig.json`.
* **`Property 'toBe' does not exist on type 'void'`**: install `@types/jest` and make sure your test does **not** define its own `expect()`.
* **Module not found for internal TS import**: remove `.js` from relative imports in `src/**` or add a Jest mapper: `moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' }`.
* **Integration test can’t find entry**: this project builds to `bin/`. Ensure the test points to `bin/index.js` (or change `outDir` to `dist`).

---

