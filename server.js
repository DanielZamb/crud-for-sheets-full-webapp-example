/**
 * =============================================================================
 * GAS-DB Test Web Application - Comprehensive Library Feature Showcase
 * =============================================================================
 *
 * This application demonstrates all major features of the GAS-DB library:
 *
 * 1. BASIC CRUD OPERATIONS
 *    - Create, Read, Update, Delete for all entity types
 *    - Type validation and automatic date conversion
 *
 * 2. ADVANCED FEATURES
 *    - createWithLogs() / updateWithLogs() - Enhanced debugging (see createCategory)
 *    - removeWithCascade() - Automatic cleanup of related records (see removeProduct, removeOrder)
 *    - readIdList() - Bulk reading by IDs (see readMultipleCategories)
 *    - Schema defaults and missing value flags (see categoryTableConfig)
 *
 * 3. RELATIONSHIPS
 *    - One-to-Many: getRelatedRecords() (see getCategoryRelatedRecords, getRelatedCustomerRecords)
 *    - Many-to-Many: Junction tables with getJunctionRecords() (see ORDER_DETAIL operations)
 *    - createManyToManyTableConfig() - Automatic junction table setup
 *
 * 4. CONCURRENCY & PERFORMANCE
 *    - Write locks with automatic conflict resolution
 *    - Optimistic UI updates with fallback (see concurrency-utility.js.html)
 *    - Caching support for read operations
 *    - Pagination and sorting options
 *
 * 5. DATA INTEGRITY
 *    - Type validation (number, string, boolean, date)
 *    - History tables for soft deletes
 *    - Foreign key integrity checks
 *    - Cascade deletion for maintaining referential integrity
 *
 * =============================================================================
 */

function doGet(e) {
  var Template = HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("Test CRUD WebApp")
    .setFaviconUrl("https://cdn-icons-png.freepik.com/512/9850/9850812.png")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return Template;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

const db = CamDB.init(
  "testing-concurrency",
  "1ifW1tILJRrGXZ5vatl8iDQnM9vE5bcolfnpHB6w_o44"
);

/**
 * Category table configuration demonstrating advanced schema features:
 * - default values: name field has a default value if not provided
 * - treatNullAsMissing: null values for 'name' will be replaced with the default
 * - date fields: automatic date handling
 */
const categoryTableConfig = {
  tableName: "CATEGORY",
  historyTableName: "DELETED_CATEGORY",
  fields: {
    // String field with default value and null handling
    name: { type: "string", default: "default_name", treatNullAsMissing: true },
    // Simple date field (could also use: { type: "date", default: "now" })
    created_at: "date",
  },
};

const productTableConfig = {
  tableName: "PRODUCT",
  historyTableName: "DELETED_PRODUCT",
  fields: {
    name: "string",
    price: "number",
    category_fk: "number",
    created_at: "date",
  },
};

const customerTableConfig = {
  tableName: "CUSTOMER",
  historyTableName: "DELETED_CUSTOMER",
  fields: {
    first_name: "string",
    last_name: "string",
    email: "string",
    address: "string",
    created_at: "date",
  },
};

const orderTableConfig = {
  tableName: "ORDER",
  historyTableName: "DELETED_ORDER",
  fields: {
    customer_fk: "number",
    created_at: "date",
  },
};

function createSchema() {
  console.log(db.createTable(categoryTableConfig));
  console.log(db.createTable(productTableConfig));
  console.log(db.createTable(customerTableConfig));
  console.log(db.createTable(orderTableConfig));
  console.log(db.createTable(orderDetailConfig));
}

console.log(db.putTableIntoDbContext(categoryTableConfig));
console.log(db.putTableIntoDbContext(productTableConfig));
console.log(db.putTableIntoDbContext(customerTableConfig));
console.log(db.putTableIntoDbContext(orderTableConfig));

const responseCreation = db.createManyToManyTableConfig({
  entity1TableName: orderTableConfig.tableName,
  entity2TableName: productTableConfig.tableName,
  fieldsRelatedToBothEntities: {
    quantity: "number",
  },
});

const orderDetailConfig = responseCreation.data;

console.log(db.putTableIntoDbContext(orderDetailConfig));

/**
 * ||=====================================================||
 * ||                   CRUD for CATEGORY                 ||
 * ||=====================================================||
 */

/**
 * Get all products related to a category (one-to-many relationship)
 * This demonstrates the getRelatedRecords() method for retrieving
 * child records based on a foreign key relationship.
 *
 * @param {number} foreignKey - The category ID to find products for
 * @param {string} field - The foreign key field name in the product table
 * @param {number} fieldIndex - The column index of the foreign key (1-based)
 * @param {Object} options - Pagination/sorting options
 * @param {boolean} useCache - Whether to use cached results
 */
function getCategoryRelatedRecords(
  foreignKey,
  field = "category_fk",
  fieldIndex = 4,
  options = {},
  useCache = false
) {
  const response = db.getRelatedRecords(
    foreignKey,
    productTableConfig.tableName,
    field,
    fieldIndex,
    options,
    useCache
  );
  return JSON.stringify(response);
}

/**
 * Bulk read multiple categories by their IDs
 * This demonstrates the readIdList() method for efficient batch reading.
 *
 * Example: readMultipleCategories([1, 2, 3, 5, 10])
 * Returns: { data: [...found records...], notFound: [5, 10] }
 *
 * @param {Array<number>} ids - Array of category IDs to retrieve
 */
function readMultipleCategories(ids) {
  const response = db.readIdList(categoryTableConfig.tableName, ids);
  console.log("Bulk read result:", response);
  console.log("Found records:", response.data.length);
  console.log("Not found IDs:", response.notFound);
  return JSON.stringify(response);
}

/**
 * Create a new category with detailed logging
 * Uses createWithLogs() which provides enhanced debugging information
 * including validation details, type conversions, and any errors.
 *
 * The function also demonstrates:
 * - Schema default values (name will use "default_name" if not provided)
 * - treatNullAsMissing flag (null name values trigger default)
 * - Date field handling (automatic conversion)
 */
function createCategory(newCategory) {
  newCategory.created_at = new Date(newCategory.created_at);
  const response = db.createWithLogs(
    categoryTableConfig.tableName,
    newCategory,
    Object.keys(categoryTableConfig.fields)
  );

  console.log(response);
  return JSON.stringify(response);
}

function readCategoryTable() {
  const response = db.getAll(
    categoryTableConfig.tableName,
    (options = {}),
    (useCache = false)
  );
  console.log(response.status);
  console.log(response.message);

  return JSON.stringify(response);
}

function updateCategory(updatedCategory, id) {
  // console.log("to update:",updatedCategory)
  // console.log("id",id)
  updatedCategory.created_at = new Date(updatedCategory.created_at);

  const response = db.update(
    categoryTableConfig.tableName,
    id,
    updatedCategory,
    Object.keys(categoryTableConfig.fields)
  );

  console.log(response);

  return JSON.stringify(response);
}

function readCategoryById(id) {
  const response = db.read(categoryTableConfig.tableName, id);

  console.log(response);

  return JSON.stringify(response);
}

function removeCategory(id) {
  const response = db.remove(
    categoryTableConfig.tableName,
    categoryTableConfig.historyTableName,
    id
  );

  console.log(response);

  return JSON.stringify(response);
}

/**
 * ||=====================================================||
 * ||               CRUD for PRODUCT TABLE                ||
 * ||=====================================================||
 */
function createProduct(newProduct) {
  // Convert dates as needed
  if (newProduct.created_at) {
    newProduct.created_at = new Date(newProduct.created_at);
  }
  const response = db.create(
    productTableConfig.tableName,
    newProduct,
    Object.keys(productTableConfig.fields)
  );
  return JSON.stringify(response);
}

function readProductTable() {
  const response = db.getAll(
    productTableConfig.tableName,
    {}, // options = {}
    false // useCache = false
  );
  return JSON.stringify(response);
}

function readProductById(id) {
  const response = db.read(productTableConfig.tableName, id);
  return JSON.stringify(response);
}

function updateProduct(updatedProduct, id) {
  if (updatedProduct.created_at) {
    updatedProduct.created_at = new Date(updatedProduct.created_at);
  }
  const response = db.update(
    productTableConfig.tableName,
    id,
    updatedProduct,
    Object.keys(productTableConfig.fields)
  );
  return JSON.stringify(response);
}

/**
 * Remove a product with cascade deletion
 * Uses removeWithCascade() which automatically deletes related records
 * in junction tables (e.g., ORDER_DETAIL records for this product).
 *
 * This prevents orphaned records and maintains referential integrity.
 */
function removeProduct(id) {
  const response = db.removeWithCascade(
    productTableConfig.tableName,
    productTableConfig.historyTableName,
    id
  );
  return JSON.stringify(response);
}

/**
 * ||=====================================================||
 * ||              CRUD for CUSTOMER TABLE                ||
 * ||=====================================================||
 */

function getRelatedCustomerRecords(
  foreignKey,
  field = "customer_fk",
  fieldIndex = 2,
  options = {},
  useCache = false
) {
  const response = db.getRelatedRecords(
    foreignKey,
    orderTableConfig.tableName,
    field,
    fieldIndex,
    options,
    useCache
  );

  return JSON.stringify(response);
}

function createCustomer(newCustomer) {
  if (newCustomer.created_at) {
    newCustomer.created_at = new Date(newCustomer.created_at);
  }
  const response = db.create(
    customerTableConfig.tableName,
    newCustomer,
    Object.keys(customerTableConfig.fields)
  );
  return JSON.stringify(response);
}

function readCustomerTable() {
  const response = db.getAll(customerTableConfig.tableName, {}, false);
  return JSON.stringify(response);
}

function readCustomerById(id) {
  const response = db.read(customerTableConfig.tableName, id);
  return JSON.stringify(response);
}

function updateCustomer(updatedCustomer, id) {
  if (updatedCustomer.created_at) {
    updatedCustomer.created_at = new Date(updatedCustomer.created_at);
  }
  const response = db.update(
    customerTableConfig.tableName,
    id,
    updatedCustomer,
    Object.keys(customerTableConfig.fields)
  );
  return JSON.stringify(response);
}

function removeCustomer(id) {
  const response = db.remove(
    customerTableConfig.tableName,
    customerTableConfig.historyTableName,
    id
  );
  return JSON.stringify(response);
}

/**
 * ||=====================================================||
 * ||                 CRUD for ORDER TABLE                ||
 * ||=====================================================||
 */
function createOrder(newOrder) {
  if (newOrder.created_at) {
    newOrder.created_at = new Date(newOrder.created_at);
  }
  const response = db.create(
    orderTableConfig.tableName,
    newOrder,
    Object.keys(orderTableConfig.fields)
  );
  return JSON.stringify(response);
}

function readOrderTable() {
  const response = db.getAll(orderTableConfig.tableName, {}, false);
  return JSON.stringify(response);
}

function readOrderById(id) {
  const response = db.read(orderTableConfig.tableName, id);
  return JSON.stringify(response);
}

function updateOrder(updatedOrder, id) {
  if (updatedOrder.created_at) {
    updatedOrder.created_at = new Date(updatedOrder.created_at);
  }
  const response = db.update(
    orderTableConfig.tableName,
    id,
    updatedOrder,
    Object.keys(orderTableConfig.fields)
  );
  return JSON.stringify(response);
}

/**
 * Remove an order with cascade deletion
 * Uses removeWithCascade() to automatically delete all ORDER_DETAIL
 * records (junction table) associated with this order.
 *
 * This demonstrates how cascade deletion maintains data integrity
 * when removing parent records in many-to-many relationships.
 */
function removeOrder(id) {
  const response = db.removeWithCascade(
    orderTableConfig.tableName,
    orderTableConfig.historyTableName,
    id
  );
  return JSON.stringify(response);
}

/**
 * ||=====================================================||
 * ||         CRUD for ORDER_DETAIL (Many-to-Many)        ||
 * ||=====================================================||
 * The 'orderDetailConfig' object was generated via:
 * const responseCreation = db.createManyToManyTableConfig({ ... });
 * const orderDetailConfig = responseCreation.data;
 */
function createOrderDetail(newOrderDetail) {
  if (newOrderDetail.created_at) {
    newOrderDetail.created_at = new Date(newOrderDetail.created_at);
  }
  // orderDetailConfig.fields => { created_at, order_id, product_id, quantity, ... }
  const response = db.create(
    orderDetailConfig.tableName,
    newOrderDetail,
    Object.keys(orderDetailConfig.fields)
  );
  return JSON.stringify(response);
}

function readOrderDetailTable() {
  const response = db.getAll(orderDetailConfig.tableName, {}, false);
  return JSON.stringify(response);
}

function readOrderDetailById(id) {
  const response = db.read(orderDetailConfig.tableName, id);
  return JSON.stringify(response);
}

function updateOrderDetail(updatedOrderDetail, id) {
  if (updatedOrderDetail.created_at) {
    updatedOrderDetail.created_at = new Date(updatedOrderDetail.created_at);
  }
  const response = db.update(
    orderDetailConfig.tableName,
    id,
    updatedOrderDetail,
    Object.keys(orderDetailConfig.fields)
  );
  return JSON.stringify(response);
}

function removeOrderDetail(id) {
  const response = db.remove(
    orderDetailConfig.tableName,
    orderDetailConfig.historyTableName,
    id
  );
  return JSON.stringify(response);
}

/**
 * Get all products (and their details) for a specific order
 * This demonstrates getJunctionRecords() for many-to-many relationships.
 *
 * The function returns:
 * - All products associated with the order
 * - The junction record data (quantity, created_at, etc.)
 * - Metadata about the relationship
 *
 * Example result:
 * {
 *   data: [
 *     {
 *       id: 5,
 *       name: "Laptop",
 *       price: 999,
 *       relationship: { order_id: 1, product_id: 5, quantity: 2 }
 *     }
 *   ],
 *   metadata: { junctionTable: "ORDER_DETAIL", ... }
 * }
 *
 * @param {number} sourceId - The order ID
 */
function readOrderDetailFromOrder(sourceId) {
  const response = db.getJunctionRecords(
    orderDetailConfig.tableName,
    orderTableConfig.tableName,
    productTableConfig.tableName,
    sourceId,
    (options = {})
  );

  console.log(response.status);
  console.log(response.message);
  console.log(response.metadata);

  for (record of response.data) {
    console.log(record);
  }

  return JSON.stringify(response);
}

/**
 * Get all orders (and their details) for a specific product
 * This is the reverse direction of the many-to-many relationship.
 *
 * Simply swap the source and target table names to query
 * from the other direction.
 *
 * @param {number} sourceId - The product ID
 */
function readOrderDetailFromProduct(sourceId) {
  const response = db.getJunctionRecords(
    orderDetailConfig.tableName,
    productTableConfig.tableName,
    orderTableConfig.tableName,
    sourceId,
    (options = {})
  );

  console.log(response.status);
  console.log(response.message);
  console.log(response.metadata);

  for (record of response.data) {
    console.log(record);
  }

  return JSON.stringify(response);
}

// ============================================================
// ADVANCED DEBUGGING & LOGGING
// ============================================================

/**
 * Update category with detailed logging for debugging
 * Uses updateWithLogs() which provides enhanced debugging information
 * including validation details, type conversions, and any errors.
 */
function updateCategoryWithLogs(updatedCategory, id) {
  updatedCategory.created_at = new Date(updatedCategory.created_at);
  const response = db.updateWithLogs(
    categoryTableConfig.tableName,
    id,
    updatedCategory,
    Object.keys(categoryTableConfig.fields)
  );
  console.log("Update with logs:", response);
  return JSON.stringify(response);
}

/**
 * Get related records with detailed logging
 * This demonstrates getRelatedRecordsWithLogs() for debugging relationship queries
 */
function getCategoryRelatedRecordsWithLogs(foreignKey) {
  const response = db.getRelatedRecordsWithLogs(
    foreignKey,
    productTableConfig.tableName,
    "category_fk",
    4,
    {},
    false
  );
  return JSON.stringify(response);
}

/**
 * Get the result of the last table creation operation
 * Useful for debugging table setup and configuration issues
 */
function getLastCreationResult() {
  const response = db.getCreationResult();
  return JSON.stringify(response);
}

// ============================================================
// ALTERNATIVE QUERY METHODS
// ============================================================

/**
 * Get related records using TextFinder (text-based matching)
 * This is an alternative query method that uses Google Sheets' TextFinder API
 * Generally slower than the standard method but useful for text-based searches
 */
function getCategoryRelatedRecordsTextFinder(foreignKey) {
  const response = db.getRelatedRecordsWithTextFinder(
    foreignKey,
    productTableConfig.tableName,
    "category_fk",
    4,
    {},
    false
  );
  return JSON.stringify(response);
}

/**
 * Get related records using filter() method
 * This is an alternative implementation using JavaScript array filtering
 * Demonstrates different query approaches with performance trade-offs
 */
function getCategoryRelatedRecordsFilter(foreignKey) {
  const response = db.getRelatedRecordsWithFilter(
    foreignKey,
    productTableConfig.tableName,
    "category_fk",
    4,
    {},
    false
  );
  return JSON.stringify(response);
}

// ============================================================
// DATA INTEGRITY
// ============================================================

/**
 * Check junction table integrity and move invalid records to history
 * This validates that all foreign keys in the ORDER_DETAIL table
 * point to valid records in ORDER and PRODUCT tables.
 * Invalid records are automatically moved to the history table.
 */
function checkOrderDetailIntegrity() {
  const response = db.checkTableIntegrity(
    orderDetailConfig.tableName,
    orderDetailConfig.historyTableName
  );
  return JSON.stringify(response);
}

/**
 * Manually delete junction records for a specific parent
 * This demonstrates explicit junction record cleanup.
 * Normally this happens automatically with removeWithCascade(),
 * but this function allows manual control over the process.
 *
 * @param {number} orderId - The order ID whose junction records should be deleted
 */
function deleteOrderDetailsByOrderId(orderId) {
  const response = db.deleteRelatedJunctionRecords(
    orderDetailConfig.tableName,
    orderDetailConfig.historyTableName,
    2, // order_id is at index 2 in ORDER_DETAIL
    orderId
  );
  return JSON.stringify(response);
}

// ============================================================
// VISUAL STYLING
// ============================================================

/**
 * Apply a color scheme to a table for visual organization
 * This uses the library's built-in color scheme support to
 * visually distinguish different tables in the spreadsheet.
 *
 * @param {string} tableName - Table to style (CATEGORY, PRODUCT, etc.)
 * @param {string} colorScheme - One of: red, blue, green, orange, purple
 */
function applyColorToTable(tableName, colorScheme) {
  try {
    const response = db.applyColorScheme(tableName, colorScheme);
    return JSON.stringify(response);
  } catch (error) {
    return JSON.stringify({ status: 500, error: error.message });
  }
}

// ============================================================
// ADVANCED CRUD WITH OPTIONS
// ============================================================

/**
 * Read category table with pagination and sorting options
 * Demonstrates the full power of getAll() with query options.
 *
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (1-indexed)
 * @param {number} options.pageSize - Records per page
 * @param {string} options.sortBy - Field name to sort by
 * @param {string} options.sortOrder - 'asc' or 'desc'
 */
function readCategoryTableWithOptions(options) {
  const response = db.getAll(categoryTableConfig.tableName, options, false);
  return JSON.stringify(response);
}

/**
 * Upsert category by name (create if not exists, update if exists)
 * This demonstrates the addUpdatePolicy parameter which enables
 * intelligent upsert behavior based on a key field.
 *
 * If a category with the given name exists, it will be updated.
 * If not, a new category will be created.
 *
 * @param {Object} categoryData - Category data with name and created_at
 */
function upsertCategoryByName(categoryData) {
  categoryData.created_at = new Date(categoryData.created_at);
  const policy = { key: "name", value: categoryData.name };
  const response = db.create(
    categoryTableConfig.tableName,
    categoryData,
    Object.keys(categoryTableConfig.fields),
    policy
  );
  return JSON.stringify(response);
}
