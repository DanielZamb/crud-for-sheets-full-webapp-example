# GAS-DB Test Web Application

A comprehensive demonstration web application showcasing the full capabilities of the GAS-DB library - a powerful CRUD framework for using Google Sheets as a database backend.

## Overview

This Google Apps Script web application provides a complete, working example of how to build a full-featured web application using Google Sheets as your database. It implements a sample e-commerce system with categories, products, customers, and orders, demonstrating all major features of the GAS-DB library.

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

## Setup & Deployment

1. Install [CLASP](https://github.com/google/clasp):
   ```bash
   npm install -g @google/clasp
   ```

2. Login to Google Apps Script:
   ```bash
   clasp login
   ```

3. Push the project to Google Apps Script:
   ```bash
   clasp push
   ```

4. Deploy as a web app from the Google Apps Script editor

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
