import { prisma } from './config/database';

async function main() {
  try {
    console.log('Đang thử kết nối đến MySQL trong Docker...');
    
    // Thử gọi lệnh kết nối
    await prisma.$connect();
    console.log('✅ KẾT NỐI DATABASE THÀNH CÔNG!');

    // Thử query đếm số lượng công thức nấu ăn trong bảng
    const count = await prisma.recipe.count();
    console.log(`📊 Số lượng công thức hiện có trong DB: ${count}`);

  } catch (error) {
    console.error('❌ KẾT NỐI DATABASE THẤT BẠI!');
    console.error(error);
  } finally {
    // Luôn đóng kết nối khi xong việc
    await prisma.$disconnect();
  }
}

// Chạy hàm main
main();