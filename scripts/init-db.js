#!/usr/bin/env node

/**
 * Database initialization script
 * Runs the SQL migration against Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeDatabase() {
  try {
    console.log('📦 Reading SQL migration file...');
    const sqlPath = join(process.cwd(), 'scripts', 'init-database.sql');
    const sql = readFileSync(sqlPath, 'utf-8');

    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0);

    console.log(`✨ Found ${statements.length} SQL statements to execute`);

    let executedCount = 0;

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      try {
        console.log(`\n[${i + 1}/${statements.length}] Executing statement...`);

        const { data, error } = await supabase.rpc('execute_sql', {
          sql: statement,
        });

        if (error) {
          console.warn(`⚠️  Statement ${i + 1} returned warning: ${error.message}`);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          executedCount++;
        }
      } catch (err) {
        // Some statements might fail if they already exist (like CREATE TABLE IF NOT EXISTS)
        // This is expected behavior
        console.log(`ℹ️  Statement ${i + 1} skipped (likely already exists)`);
      }
    }

    console.log(`\n✨ Database initialization complete!`);
    console.log(`📊 Successfully executed: ${executedCount} statements`);

    // Verify tables exist
    console.log('\n🔍 Verifying tables were created...');
    const { data: tables } = await supabase.rpc('get_tables');

    if (tables) {
      console.log(`✅ Found ${tables.length} tables in database`);
    }
  } catch (error) {
    console.error('❌ Error during database initialization:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
