// تهيئة قاعدة البيانات
const adminDb = db.getSiblingDB('admin');

// إنشاء مستخدم مدير لقاعدة البيانات
adminDb.auth('admin', 'admin123');

// إنشاء قاعدة البيانات إذا لم تكن موجودة
const dbName = 'sard_digital';
const db = db.getSiblingDB(dbName);

// إنشاء المستخدمين والصلاحيات
db.createUser({
  user: 'sard_user',
  pwd: 'sard_password',
  roles: [
    { role: 'readWrite', db: dbName },
    { role: 'dbAdmin', db: dbName }
  ]
});

// إنشاء المجموعات الأساسية
const collections = ['users', 'books', 'articles', 'courses', 'categories'];
collections.forEach(collection => {
  db.createCollection(collection);
  print(`تم إنشاء المجموعة: ${collection}`);
});

// إنشاء فهارس للمجموعات
db.users.createIndex({ email: 1 }, { unique: true });
db.books.createIndex({ title: 'text', description: 'text' });
db.articles.createIndex({ title: 'text', content: 'text' });

print('تم تهيئة قاعدة البيانات بنجاح');
