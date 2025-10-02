import Database from 'better-sqlite3';
import * as bcrypt from 'bcrypt';

async function seed() {
  const db = new Database(process.env.DATABASE_PATH || './database.sqlite');

  console.log('✅ Database connection established');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  db.prepare('DELETE FROM task').run();
  db.prepare('DELETE FROM user').run();
  db.prepare('DELETE FROM organization').run();

  // Create organization hierarchy
  console.log('🏢 Creating organization hierarchy...');

  db.prepare('INSERT INTO organization (name, parentId) VALUES (?, ?)').run(
    'Acme Corporation',
    null
  );
  const acmeCorpId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  db.prepare('INSERT INTO organization (name, parentId) VALUES (?, ?)').run(
    'Engineering',
    acmeCorpId
  );
  const engineeringId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  db.prepare('INSERT INTO organization (name, parentId) VALUES (?, ?)').run(
    'Sales',
    acmeCorpId
  );
  const salesId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  db.prepare('INSERT INTO organization (name, parentId) VALUES (?, ?)').run(
    'Frontend Team',
    engineeringId
  );
  const frontendId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  console.log('✅ Organizations created');

  // Create users with hashed passwords
  console.log('👥 Creating users...');

  const ceoPassword = await bcrypt.hash('ceoPassword', 10);
  db.prepare(
    'INSERT INTO user (email, password, role, organizationId) VALUES (?, ?, ?, ?)'
  ).run('ceo@acme.com', ceoPassword, 'owner', acmeCorpId);
  const ceoId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  const engPassword = await bcrypt.hash('engPassword', 10);
  db.prepare(
    'INSERT INTO user (email, password, role, organizationId) VALUES (?, ?, ?, ?)'
  ).run('eng.manager@acme.com', engPassword, 'admin', engineeringId);
  const engManagerId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  const devPassword = await bcrypt.hash('devPassword', 10);
  db.prepare(
    'INSERT INTO user (email, password, role, organizationId) VALUES (?, ?, ?, ?)'
  ).run('dev@acme.com', devPassword, 'owner', frontendId);
  const frontendDevId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  const viewerPassword = await bcrypt.hash('viewerPassword', 10);
  db.prepare(
    'INSERT INTO user (email, password, role, organizationId) VALUES (?, ?, ?, ?)'
  ).run('viewer@acme.com', viewerPassword, 'viewer', salesId);
  const salesViewerId = db.prepare('SELECT last_insert_rowid() as id').get().id;

  console.log('✅ Users created');

  // Create sample tasks
  console.log('📋 Creating tasks...');

  const now = new Date().toISOString();

  db.prepare(
    'INSERT INTO task (title, description, status, category, ownerId, organizationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Q4 Strategic Planning',
    'Plan company strategy for Q4',
    'in_progress',
    'Planning',
    ceoId,
    acmeCorpId,
    now,
    now
  );

  db.prepare(
    'INSERT INTO task (title, description, status, category, ownerId, organizationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Migrate to Microservices',
    'Break monolith into microservices architecture',
    'todo',
    'Architecture',
    engManagerId,
    engineeringId,
    now,
    now
  );

  db.prepare(
    'INSERT INTO task (title, description, status, category, ownerId, organizationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Implement Dark Mode',
    'Add dark mode toggle to the dashboard',
    'in_progress',
    'Feature',
    frontendDevId,
    frontendId,
    now,
    now
  );

  db.prepare(
    'INSERT INTO task (title, description, status, category, ownerId, organizationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Review Sales Dashboard',
    'Review and provide feedback on new sales dashboard',
    'todo',
    'Review',
    salesViewerId,
    salesId,
    now,
    now
  );

  db.prepare(
    'INSERT INTO task (title, description, status, category, ownerId, organizationId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Update Dependencies',
    'Update npm dependencies to latest versions',
    'complete',
    'Maintenance',
    frontendDevId,
    frontendId,
    now,
    now
  );

  console.log('✅ Tasks created');

  console.log('\n🎉 Seed data successfully created!\n');
  console.log('📧 Test User Credentials:');
  console.log(
    '   - ceo@acme.com (OWNER at Acme Corporation) - password: ceoPassword'
  );
  console.log(
    '   - eng.manager@acme.com (ADMIN at Engineering) - password: engPassword'
  );
  console.log(
    '   - dev@acme.com (OWNER at Frontend Team) - password: devPassword'
  );
  console.log(
    '   - viewer@acme.com (VIEWER at Sales) - password: viewerPassword\n'
  );

  db.close();
}

seed()
  .then(() => {
    console.log('✅ Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  });
