# GAS-DB Test Web Application

A comprehensive demonstration web application showcasing the full capabilities of the GAS-DB library - a powerful CRUD framework for using Google Sheets as a database backend.

## Overview

This Google Apps Script web application provides a complete, working example of how to build a full-featured web application using Google Sheets as your database. It implements a sample e-commerce system with categories, products, customers, and orders, demonstrating all major features of the GAS-DB library.

## Live Demo

- Open the deployed webapp: `https://script.google.com/macros/s/AKfycbx2XYI88p6MuSJZPtggWZkguAii6jI-CBEPAwlS_XV5beFSVVzR_U9H-NpkcgBF8Vc-dw/exec`

## Features Demonstrated

### Basic CRUD Operations

- **Create, Read, Update, Delete** operations for all entity types
- Automatic type validation and conversion (string, number, boolean, date)
- Schema configuration with default values and null handling

### Advanced Database Features

- **createWithLogs() / updateWithLogs()** - Enhanced debugging with detailed validation logs
- **removeWithCascade()** - Automatic cleanup of related records to maintain referential integrity
- **readIdList()** - Efficient bulk reading by multiple IDs
- **Schema defaults** - Automatic default values for missing fields
- **History tables** - Soft delete support for data recovery

### Relationship Management

- **One-to-Many relationships** - Using `getRelatedRecords()` to query child records
- **Many-to-Many relationships** - Junction table support with `getJunctionRecords()`
- **Automatic junction tables** - Generated via `createManyToManyTableConfig()`
- **Foreign key integrity** - Automatic validation and cascade operations

### Concurrency & Performance

- **Write locks** - Automatic conflict resolution for concurrent operations
- **Optimistic UI updates** - Immediate feedback with automatic rollback on failure
- **Caching support** - Optional caching for read operations
- **Pagination and sorting** - Built-in query optimization

## Data Model

The application implements a sample e-commerce schema:

- **CATEGORY** - Product categories with default values demo
- **PRODUCT** - Products with foreign key to categories
- **CUSTOMER** - Customer information
- **ORDER** - Orders with foreign key to customers
- **ORDER_DETAIL** - Junction table for many-to-many relationship between orders and products

## Project Structure

- `server.js` - Main application logic with all CRUD operations
- `index.html` - Frontend interface
- `main.js.html` - Client-side JavaScript
- `concurrency-utility.js.html` - Concurrency handling and optimistic updates
- `styles.css.html` - Application styles
- `appsscript.json` - Google Apps Script manifest
- `.clasp.json` - CLASP configuration for deployment

## UI/Frontend Stack (this repo)

- **Tailwind CSS v4 (CDN browser build)**: loaded in `index.html`
- **Bootstrap Icons**: icons only
- **DataTables**: table interactions (sorting/search/paging)
- **Tom Select**: enhanced selects for foreign keys
- **SweetAlert2**: dialogs/toasts
- **No Bootstrap JS**: offcanvas + carousel behavior are implemented with small plain-JS helpers in `main.js.html`

## UX Enhancements

### Enhanced Search & Navigation

- **Global Search Bar**: Type-ahead search in the top navigation bar

  - Search by module name (e.g., "category", "order", "product", "customer", "advanced")
  - Real-time suggestions dropdown appears as you type
  - Clicking a suggestion navigates to the corresponding module
  - Keyboard shortcuts: Enter to select, Escape to close
  - Shows ⌘K hint for command palette shortcut

- **Command Palette** (⌘K / Ctrl+K): Quick navigation modal
  - Full-screen modal overlay for distraction-free searching
  - Search all modules and features
  - Keyboard navigation support (Enter to select, Escape to close)
  - Click outside to dismiss
  - Same suggestion system as the search bar

### Visual Feedback & Loading States

- **Info Button Loading States**: Inline loading feedback for relationship queries

  - When clicking the info (ℹ️) button in any table row, the button shows a spinner
  - Button is disabled and visually dimmed during the async operation
  - Original icon and state restored on completion (success or error)
  - Provides immediate feedback that the action is processing

- **Button Loading States**: All Advanced Features buttons show loading indicators

  - Spinning icon (`bi-arrow-repeat`) replaces button icon during operations
  - Button text changes to show first word + "..." (e.g., "Update...")
  - Buttons are disabled and visually dimmed during async operations
  - Original state restored on completion (success or error)

- **Button Highlighting**: When navigating via search, target buttons are highlighted

  - Smooth scroll to the button
  - Ring animation draws attention to the action button
  - Auto-dismisses after 2 seconds

- **Search Result Highlighting**: Visual feedback for search matches
  - Yellow highlight (`<mark>`) shows matching text
  - Works in both module names and function names
  - Proper contrast in light and dark modes
  - Highlighted text stands out without being jarring

## Setup & Deployment

### 1) Configure the database (Spreadsheet)

This demo uses a Google Sheet as the DB. In `server.js` there’s a `CamDB.init(...)` call that includes a **Spreadsheet ID**.

- **If you want to use your own sheet**: create a new spreadsheet and replace the ID in `server.js`.
- **Create tables**: from the Apps Script editor, run the `createSchema()` function once to create the required sheets/tables.

### 2) Push the code with CLASP

1. Install [CLASP](https://github.com/google/clasp):

   ```bash
   npm install -g @google/clasp
   ```

2. Login to Google Apps Script:

   ```bash
   clasp login
   ```

3. (First time) Create or link a script project:

   - If you already have a script project id, set it in `.clasp.json` as `scriptId`.
   - Otherwise run `clasp create` and then update `.clasp.json`.

4. Push the project to Google Apps Script:

   ```bash
   clasp push
   ```

### 3) Deploy as a Web App

In the Apps Script editor:

- **Deploy** → **New deployment** → **Web app**
- **Execute as**: `USER_DEPLOYING`
- **Who has access**: `ANYONE_ANONYMOUS` (matches `appsscript.json`)

Re-deploy after changes.

## How to Use the App (what to click)

- **Navigation**: open the sidebar and pick a module:
  - **Categorias / Productos / Clientes / Ordenes / Detalle de Orden**
  - **Advanced Features**
- **CRUD flow**:
  - Each module starts on a **table list** view.
  - Use **Create** to open the create slide, submit the form, then refresh.
  - Use **Edit/Delete** buttons in the first column to modify rows.
- **Relationship demos**:
  - Category → Products (one-to-many): click the “info” action in Categories.
  - Customer → Orders (one-to-many): click the “info” action in Customers.
  - Order ↔ Product via ORDER_DETAIL (many-to-many): use the Order Detail “read” flow to choose direction.
- **Advanced Features module**:
  - Debugging/logging: run “Update with Logs” / “Get Related with Logs” / “Get Creation Result”
  - Data integrity: “Check Junction Integrity” / “Delete Junction Records”
  - Query alternatives: compare normal vs TextFinder vs Filter approaches (and timings)
  - Visual styling: apply a color scheme to tables (sheet formatting)

## Key Concepts Illustrated

- **Table Configuration** - How to define schemas with type validation
- **Relationship Queries** - Traversing one-to-many and many-to-many relationships
- **Cascade Operations** - Maintaining data integrity when deleting parent records
- **Concurrency Handling** - Managing simultaneous updates safely
- **Type System** - Automatic conversion and validation of data types

## Use Cases

This demo is ideal for developers who want to:

- Build web applications without setting up a traditional database
- Leverage Google Sheets as a simple, accessible database
- Understand relationship modeling in a spreadsheet context
- Learn concurrency management patterns
- See best practices for Google Apps Script web applications

## License

This is a demonstration application for the GAS-DB library.
