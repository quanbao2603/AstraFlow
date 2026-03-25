---
description: Quy trình thao tác Di chuyển Dữ liệu và Thay đổi Schema Database (Prisma)
---
# Database Schema Modification Workflow

Khi có yêu cầu thay đổi cấu trúc bảng, thêm trường, hoặc tạo bảng mới trong Database (Sử dụng P1_LOGOS để tính toán Breaking Changes).

## 1. Cập nhật Schema
Sửa đổi file `backend/prisma/schema.prisma` với các Model/Field mới. Luôn ghi nhớ duy trì quan hệ ngữ nghĩa (Semantics).

## 2. Áp dụng thay đổi vào Database (Push)
Quy trình này sẽ đồng bộ cấu trúc mới xuống Database Postgres.
// turbo
3. cd backend && npx prisma db push

## 3. Cập nhật Prisma Client (Generate)
Sinh ra các TypeScript definition mới giúp gợi ý code phía Backend.
// turbo
4. cd backend && npx prisma generate

## 4. Rà soát Backend
Mở các file trong `backend/src/` để kiểm tra có Route nào bị ảnh hưởng bởi thay đổi DB này không, sau đó áp dụng cập nhật.
