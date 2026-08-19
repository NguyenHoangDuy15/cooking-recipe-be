FROM node:20-slim

# Cài đặt OpenSSL (Cần thiết cho Prisma trên Debian/Alpine)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt toàn bộ dependencies (Bao gồm devDependencies để dùng tsx)
RUN npm install

# Generate Prisma Client
RUN npm run build

# Copy toàn bộ source code
COPY . .

# Đảm bảo thư mục public/uploads tồn tại
RUN mkdir -p public/uploads

# Expose port
EXPOSE 3000

# Chạy server
CMD ["npm", "start"]
