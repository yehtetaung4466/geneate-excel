#!/usr/bin/env ts-node

import { Workbook } from 'exceljs';
import { Pool } from 'pg';
import { Command } from 'commander';

interface Column {
  name: string;
  type: string;
}

const program = new Command();

program
  .requiredOption('--url <databaseUrl>', 'PostgreSQL connection URL')
  .option('-o, --output <file>', 'Output Excel file name', 'database_schema.xlsx')
  .parse(process.argv);

const { url, output } = program.opts();

const db = new Pool({
  connectionString: url,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  await db.connect();

  const result = await db.query(`
    SELECT 
      table_name, 
      column_name, 
      data_type
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `);

  const tableColumnMap = new Map<string, Column[]>();

  result.rows.forEach((r: any) => {
    const oldColumns: Column[] = tableColumnMap.get(r.table_name) || [];
    oldColumns.push({
      name: r.column_name,
      type: r.data_type,
    });
    tableColumnMap.set(r.table_name, oldColumns);
  });

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet('Schema');

  tableColumnMap.forEach((columns, tableName) => {
    worksheet.addRow([tableName]).font = { bold: true, size: 12 };
    const headerRow = worksheet.addRow(['Column Name','Data Type']);
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    columns.forEach((column) => {
      const row = worksheet.addRow([
        column.name,
        column.type,
      ]);
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.addRow([]); // Empty row for spacing
  });

  await workbook.xlsx.writeFile(output);
  console.log(`✅ Excel file "${output}" has been generated successfully.`);
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
}).then(() => {
  process.exit(0);
});
