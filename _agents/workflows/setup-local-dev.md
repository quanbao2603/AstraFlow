---
description: Khởi tạo và Khởi chạy Môi trường Phát triển Local (AstraFlow)
---
# Setup & Run Local Development

Quy trình này hướng dẫn các bước để thiết lập và chạy đồng thời cả Backend và Frontend của AstraFlow.

## 1. Cài đặt Dependencies
Cài đặt thư viện cho dự án (nếu chạy lần đầu hoặc có thư viện mới).
// turbo-all
2. cd backend && npm install
3. cd frontend && npm install

## 2. Đồng bộ Database & Prisma
Tạo các tệp Client và đồng bộ DB (yêu cầu file `backend/.env` đã có `DATABASE_URL`).
// turbo
5. cd backend && npx prisma generate
// turbo
6. cd backend && npx prisma db push

## 3. Khởi chạy Server
Khởi chạy Backend (Port 3000) và Frontend (Vite Port tuỳ chỉnh) đồng thời trên terminal.
// turbo
7. cd backend && npm run dev
// turbo
8. cd frontend && npm run dev
