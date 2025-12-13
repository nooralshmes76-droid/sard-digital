// Service Worker لتخزين الموارد مؤقتًا
const CACHE_NAME = 'sard-digital-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/shared.css',
  '/home.css',
  '/main.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم تثبيت Service Worker بنجاح');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('حذف الملفات القديمة من الذاكرة المؤقتة');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// استرجاع البيانات من الذاكرة المؤقتة
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع الملف من الذاكرة المؤقتة إذا كان موجودًا
        if (response) {
          return response;
        }
        
        // إذا لم يكن الملف موجودًا في الذاكرة المؤقتة، قم بتحميله من الشبكة
        return fetch(event.request).then(response => {
          // لا تقم بتخزين استجابات غير صالحة
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // استنساخ الاستجابة
          const responseToCache = response.clone();
          
          // تخزين الاستجابة في الذاكرة المؤقتة
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});
