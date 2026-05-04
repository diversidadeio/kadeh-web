import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DEPARTMENTS = [
  { code: 'A', name: 'Açougue', nameEn: 'Butcher', x: 140, y: 40, color: '#dc2626' },
  { code: 'H', name: 'Hortifrutí', nameEn: 'Produce', x: 500, y: 40, color: '#2563eb' },
  { code: 'P', name: 'Padaria', nameEn: 'Bakery', x: 750, y: 40, color: '#f97316' },
  { code: 'L', name: 'Laticínios e Bebidas Geladas', nameEn: 'Dairy & Cold Beverages', x: 100, y: 130, color: '#fbbf24' },
  { code: 'R', name: 'Refrigerantes', nameEn: 'Soft Drinks', x: 250, y: 130, color: '#22c55e' },
  { code: 'C', name: 'Cereais e Bolachas', nameEn: 'Cereals & Crackers', x: 380, y: 130, color: '#8b5cf6' },
  { code: 'I', name: 'Infantis', nameEn: 'Baby Products', x: 480, y: 130, color: '#ec4899' },
  { code: 'G', name: 'Higiene', nameEn: 'Hygiene', x: 580, y: 130, color: '#06b6d4' },
  { code: 'K', name: 'Limpeza', nameEn: 'Cleaning', x: 680, y: 130, color: '#f43f5e' },
  { code: 'U', name: 'Utilidades', nameEn: 'Utilities', x: 780, y: 130, color: '#6366f1' },
  { code: 'O', name: 'Orgânicos & Naturais', nameEn: 'Organic & Natural', x: 380, y: 380, color: '#10b981' },
  { code: 'F', name: 'Congelados', nameEn: 'Frozen', x: 520, y: 380, color: '#3b82f6' },
  { code: 'T', name: 'Pet', nameEn: 'Pet', x: 620, y: 380, color: '#f59e0b' },
  { code: 'B', name: 'Bebidas Alcoólicas', nameEn: 'Alcoholic Beverages', x: 750, y: 380, color: '#8b4513' },
];

async function seedDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'kadeh',
    });

    console.log('✅ Connected to database');

    // Get the owner user ID (assuming first user is the owner)
    const [users] = await connection.query('SELECT id FROM user LIMIT 1');
    if (users.length === 0) {
      console.error('❌ No users found in database. Please create a user first.');
      process.exit(1);
    }

    const userId = users[0].id;
    console.log(`📝 Using user ID: ${userId}`);

    // Clear existing categories and routes for this user
    await connection.query('DELETE FROM storeLayoutRoutes WHERE id > 0');
    await connection.query('DELETE FROM storeLayoutCategories WHERE userId = ?', [userId]);
    console.log('🗑️  Cleared existing data');

    // Insert departments
    const categoryIds = [];
    for (const dept of DEPARTMENTS) {
      const [result] = await connection.query(
        'INSERT INTO storeLayoutCategories (userId, code, name, nameEn, x, y, radius, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, dept.code, dept.name, dept.nameEn, dept.x, dept.y, 20, dept.color]
      );
      categoryIds.push(result.insertId);
      console.log(`✅ Created category: ${dept.name}`);
    }

    // Create routes between all departments (simple straight lines)
    let routeCount = 0;
    for (let i = 0; i < categoryIds.length; i++) {
      for (let j = 0; j < categoryIds.length; j++) {
        if (i !== j) {
          const fromDept = DEPARTMENTS[i];
          const toDept = DEPARTMENTS[j];
          
          // Create a simple path with 3 waypoints (start, middle, end)
          const pathPoints = [
            { x: fromDept.x, y: fromDept.y },
            { x: (fromDept.x + toDept.x) / 2, y: (fromDept.y + toDept.y) / 2 },
            { x: toDept.x, y: toDept.y },
          ];
          
          const distance = Math.hypot(toDept.x - fromDept.x, toDept.y - fromDept.y);
          
          await connection.query(
            'INSERT INTO storeLayoutRoutes (userId, fromCategoryId, toCategoryId, pathPoints, distance) VALUES (?, ?, ?, ?, ?)',
            [userId, categoryIds[i], categoryIds[j], JSON.stringify(pathPoints), Math.round(distance)]
          );
          routeCount++;
        }
      }
    }

    console.log(`✅ Created ${routeCount} routes`);
    console.log('✅ Database seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
