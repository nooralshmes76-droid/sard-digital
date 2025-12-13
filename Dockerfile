# ===== Build Stage =====
FROM node:18-alpine AS builder

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ ملفات تعريف الحزمة وتثبيت التبعيات
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# تثبيت تبعيات الواجهة الأمامية
WORKDIR /app/frontend
RUN npm install
RUN npm run build # بناء الواجهة الأمامية

# تثبيت تبعيات الواجهة الخلفية
WORKDIR /app/backend
RUN npm install --production

# نسخ ملفات المشروع
WORKDIR /app
COPY . .

# ===== Production Stage =====
FROM node:18-alpine

# تثبيت tzdata للتعامل مع المناطق الزمنية
RUN apk --no-cache add tzdata

# تعيين المنطقة الزمنية
ENV TZ=Asia/Riyadh

# إنشاء مستخدم غير جذري
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# إنشاء مجلد التطبيق
WORKDIR /app

# نسخ ملفات المشروع من مرحلة البناء
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/frontend/dist ./frontend/dist

# تغيير ملكية الملفات للمستخدم غير الجذري
RUN chown -R appuser:appgroup /app

# تغيير المستخدم
USER appuser

# فتح المنفذ
EXPOSE 5000

# تشغيل التطبيق
CMD ["node", "backend/server.js"]
