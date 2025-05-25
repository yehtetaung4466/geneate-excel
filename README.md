# PostgreSQL Schema Exporter to Excel

This CLI tool connects to a PostgreSQL database, extracts the schema (tables and their columns), and generates an Excel file (`.xlsx`) that documents the database structure.

## 📦 Requirements

- Node.js
- TypeScript
- PostgreSQL database
- Dependencies installed

## 🛠 Installation

Install dependencies:

```bash
npm install
```

Install required packages (if not already):

```bash
npm install exceljs pg commander
```

## 🚀 Usage

```bash
npn run generate --url "<DATABASE_URL>" -o ./table.xlsx
```

### 🔧 Options

| Flag         | Description                          | Required | Example                                 |
|--------------|--------------------------------------|----------|-----------------------------------------|
| `--url`      | PostgreSQL connection URL            | ✅ Yes   | `--url "postgresql://user:pass@host:port/db"` |
| `-o, --output` | Output Excel file path (optional) | ❌ No    | `-o ./table.xlsx`                        |

If `--output` is not provided, the file will default to `database_schema.xlsx`.

### ✅ Example

```bash
npm run generate --url "postgresql://user:pass@localhost:5432/mydb" -o ./table.xlsx
```

After running, you'll find `table.xlsx` in the current directory with your database schema.

## 📁 Output Format

Each table will have:
- A header with the table name
- A structured list of its columns
- Columns: Logical Name, Physical Name, Data Type, Constraint, Remark

## 📌 Notes

- Only public schema tables are included.
- SSL is enabled with `rejectUnauthorized: false` (suitable for Heroku and similar platforms).