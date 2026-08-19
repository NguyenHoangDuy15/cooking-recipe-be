import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cuisinesData = [
  { name: 'Việt Nam' },
  { name: 'Ý' },
  { name: 'Nhật Bản' },
  { name: 'Hàn Quốc' },
  { name: 'Thái Lan' }
];

const ingredientsList = [
  'Thịt gà', 'Thịt bò', 'Thịt heo', 'Cá hồi', 'Tôm', 
  'Cà chua', 'Hành tây', 'Tỏi', 'Gừng', 'Ớt',
  'Gạo', 'Bánh phở', 'Bún', 'Mì Ý', 'Mì Ramen',
  'Nước tương', 'Nước mắm', 'Dầu ô liu', 'Bơ', 'Phô mai',
  'Ngò rí', 'Húng quế', 'Rong biển', 'Chanh', 'Hành lá',
  'Đu đủ xanh', 'Đậu phộng', 'Trứng', 'Giá đỗ', 'Kimchi', 
  'Đậu hũ', 'Tương ớt Gochujang', 'Sả', 'Lá chanh', 'Nước cốt dừa',
  'Đường', 'Tiêu', 'Bột mì', 'Giấm gạo', 'Cơm trắng'
];

const realRecipes = [
  // VIETNAM
  {
    cuisine: 'Việt Nam',
    title: 'Phở Bò Truyền Thống',
    description: 'Món quốc hồn quốc túy của Việt Nam với nước dùng ngọt thanh từ xương bò, bánh phở mềm và thịt bò tái chín.',
    englishKeyword: 'pho,beef',
    ingredients: [
      { name: 'Thịt bò', quantity: '200g' },
      { name: 'Bánh phở', quantity: '150g' },
      { name: 'Hành tây', quantity: '1/2 củ' },
      { name: 'Ngò rí', quantity: '10g' },
      { name: 'Gừng', quantity: '1 củ nhỏ' }
    ],
    instructions: [
      'Nướng chín gừng và hành tây, cạo sạch vỏ.',
      'Ninh xương bò cùng gừng và hành tây nướng trong 3-4 tiếng để lấy nước dùng.',
      'Thái mỏng thịt bò. Trần bánh phở qua nước sôi rồi cho vào tô.',
      'Xếp thịt bò lên trên bánh phở, rắc hành ngò thái nhỏ.',
      'Chan nước dùng đang sôi vào tô để làm chín thịt tái và thưởng thức cùng chanh ớt.'
    ]
  },
  {
    cuisine: 'Việt Nam',
    title: 'Bún Chả Hà Nội',
    description: 'Thịt heo nướng than hoa thơm lừng ăn kèm bún tươi và nước mắm chua ngọt đặc trưng.',
    englishKeyword: 'buncha,pork',
    ingredients: [
      { name: 'Thịt heo', quantity: '300g' },
      { name: 'Bún', quantity: '200g' },
      { name: 'Nước mắm', quantity: '3 muỗng' },
      { name: 'Tỏi', quantity: '3 tép' },
      { name: 'Đu đủ xanh', quantity: '50g' }
    ],
    instructions: [
      'Thịt heo băm nhỏ và thái miếng, ướp cùng nước mắm, đường, hành tỏi băm, tiêu.',
      'Nướng thịt trên than hoa cho đến khi xém vàng và thơm.',
      'Pha nước mắm chua ngọt với tỷ lệ mắm, đường, chanh, nước lọc và tỏi ớt băm.',
      'Thái mỏng đu đủ xanh bóp muối rửa sạch, ngâm vào nước mắm chua ngọt.',
      'Bày bún, rau sống, chả nướng và bát nước chấm ra ăn kèm.'
    ]
  },
  {
    cuisine: 'Việt Nam',
    title: 'Gà Kho Gừng',
    description: 'Món ăn quen thuộc trong mâm cơm gia đình Việt, đậm đà đưa cơm.',
    englishKeyword: 'braised,chicken',
    ingredients: [
      { name: 'Thịt gà', quantity: '500g' },
      { name: 'Gừng', quantity: '1 củ to' },
      { name: 'Nước mắm', quantity: '2 muỗng' },
      { name: 'Đường', quantity: '1 muỗng' },
      { name: 'Hành lá', quantity: '2 nhánh' }
    ],
    instructions: [
      'Thịt gà chặt miếng vừa ăn, ướp với chút mắm, tiêu và hành băm.',
      'Gừng gọt vỏ, thái sợi hoặc thái lát mỏng.',
      'Thắng đường tạo màu caramel, cho tỏi và gừng vào phi thơm.',
      'Cho gà vào xào săn lại, nêm nếm thêm nước mắm và đậy nắp kho liu riu 20 phút.',
      'Rắc hành lá thái nhỏ và tiêu lên trên rồi tắt bếp.'
    ]
  },

  // ITALY
  {
    cuisine: 'Ý',
    title: 'Mì Spaghetti Bolognese',
    description: 'Mì Ý sốt bò băm cà chua kinh điển thế giới.',
    englishKeyword: 'spaghetti,bolognese',
    ingredients: [
      { name: 'Mì Ý', quantity: '200g' },
      { name: 'Thịt bò', quantity: '150g (băm nhỏ)' },
      { name: 'Cà chua', quantity: '3 quả' },
      { name: 'Tỏi', quantity: '2 tép' },
      { name: 'Phô mai', quantity: '20g' }
    ],
    instructions: [
      'Luộc mì Ý trong nước sôi có chút muối khoảng 8-10 phút cho chín tới, vớt ra để ráo.',
      'Cà chua khía chữ thập, chần qua nước sôi để bóc vỏ, băm nhuyễn.',
      'Phi tỏi thơm với dầu ô liu, cho bò băm vào xào săn.',
      'Đổ cà chua băm vào chảo thịt bò, đun lửa nhỏ tạo thành sốt đặc sệt, nêm gia vị.',
      'Bày mì ra đĩa, rưới sốt bò băm lên trên và rắc phô mai bào.'
    ]
  },
  {
    cuisine: 'Ý',
    title: 'Pizza Margherita',
    description: 'Chiếc Pizza cơ bản nhất nhưng phản ánh rõ nhất linh hồn ẩm thực Ý.',
    englishKeyword: 'pizza,margherita',
    ingredients: [
      { name: 'Bột mì', quantity: '250g' },
      { name: 'Cà chua', quantity: '2 quả' },
      { name: 'Phô mai', quantity: '100g (Mozzarella)' },
      { name: 'Húng quế', quantity: '1 ít' },
      { name: 'Dầu ô liu', quantity: '2 muỗng' }
    ],
    instructions: [
      'Nhào bột mì với men nở, nước và dầu ô liu, ủ bột 1-2 tiếng cho nở gấp đôi.',
      'Cán mỏng đế bánh pizza.',
      'Quết sốt cà chua đều lên mặt đế bánh.',
      'Xé nhỏ phô mai Mozzarella rải đều lên trên, thêm lá húng quế tươi.',
      'Nướng bánh trong lò ở 250 độ C trong khoảng 10-15 phút.'
    ]
  },

  // JAPAN
  {
    cuisine: 'Nhật Bản',
    title: 'Sushi Cá Hồi (Sake Nigiri)',
    description: 'Cơm cuộn giấm với lát cá hồi tươi ngon phía trên, đơn giản mà tinh tế.',
    englishKeyword: 'sushi,salmon',
    ingredients: [
      { name: 'Gạo', quantity: '1 chén (gạo sushi)' },
      { name: 'Cá hồi', quantity: '150g (phi lê tươi)' },
      { name: 'Giấm gạo', quantity: '2 muỗng' },
      { name: 'Nước tương', quantity: 'Tùy khẩu vị' },
      { name: 'Đường', quantity: '1 muỗng' }
    ],
    instructions: [
      'Nấu chín gạo sushi, khi cơm còn nóng thì trộn đều với giấm gạo, muối và đường.',
      'Để cơm nguội bớt, thấm ướt tay và vắt cơm thành những nắm hình bầu dục nhỏ.',
      'Thái cá hồi thành từng lát mỏng hình chữ nhật vừa vặn.',
      'Phết một xíu mù tạt (wasabi) lên mặt cá (tùy chọn).',
      'Đặt lát cá hồi lên trên nắm cơm, ấn nhẹ để cá dính vào cơm và thưởng thức cùng nước tương.'
    ]
  },
  {
    cuisine: 'Nhật Bản',
    title: 'Mì Shoyu Ramen',
    description: 'Ramen nước tương thanh ngọt, ăn kèm thịt xá xíu mềm tan.',
    englishKeyword: 'ramen,noodle',
    ingredients: [
      { name: 'Mì Ramen', quantity: '1 vắt' },
      { name: 'Thịt heo', quantity: '100g (chashu)' },
      { name: 'Trứng', quantity: '1 quả (lòng đào)' },
      { name: 'Hành lá', quantity: '1 nhánh' },
      { name: 'Nước tương', quantity: '3 muỗng' }
    ],
    instructions: [
      'Hầm xương gà và heo để lấy nước dùng trong, nêm nếm với nước tương (shoyu tare).',
      'Luộc mì ramen chín tới, vớt ra cho ráo nước rồi cho vào tô.',
      'Cắt lát thịt heo xá xíu (chashu) và cắt đôi trứng lòng đào ngâm tương.',
      'Chan nước dùng nóng hổi ngập mì.',
      'Xếp thịt heo, trứng, hành lá thái nhỏ, rong biển lên trên và thưởng thức ngay.'
    ]
  },

  // KOREA
  {
    cuisine: 'Hàn Quốc',
    title: 'Canh Kim Chi (Kimchi Jjigae)',
    description: 'Canh chua cay nóng hổi, rất phù hợp ăn cùng cơm trắng vào ngày lạnh.',
    englishKeyword: 'kimchi,soup',
    ingredients: [
      { name: 'Kimchi', quantity: '200g (chua)' },
      { name: 'Thịt heo', quantity: '150g (ba chỉ)' },
      { name: 'Đậu hũ', quantity: '1 miếng' },
      { name: 'Tương ớt Gochujang', quantity: '1 muỗng' },
      { name: 'Hành lá', quantity: '2 nhánh' }
    ],
    instructions: [
      'Cắt kimchi và thịt ba chỉ thành miếng vừa ăn.',
      'Xào thịt ba chỉ với một chút dầu ăn cho tứa mỡ, sau đó cho kimchi vào xào cùng.',
      'Đổ nước lọc hoặc nước vo gạo vào nồi, thêm tương ớt Gochujang và đun sôi 15 phút.',
      'Cắt đậu hũ thành các miếng vuông, thả vào nồi canh sôi.',
      'Rắc hành lá, đun thêm 2 phút rồi tắt bếp dùng nóng.'
    ]
  },
  {
    cuisine: 'Hàn Quốc',
    title: 'Cơm Trộn Bibimbap',
    description: 'Món cơm trộn đủ màu sắc với các loại rau củ, thịt và tương ớt đặc trưng.',
    englishKeyword: 'bibimbap,korean',
    ingredients: [
      { name: 'Cơm trắng', quantity: '1 tô' },
      { name: 'Thịt bò', quantity: '100g' },
      { name: 'Giá đỗ', quantity: '50g' },
      { name: 'Trứng', quantity: '1 quả' },
      { name: 'Tương ớt Gochujang', quantity: '2 muỗng' }
    ],
    instructions: [
      'Thái mỏng thịt bò, ướp xì dầu, tỏi, đường và xào chín tới.',
      'Chần giá đỗ, thái sợi cà rốt xào mềm, xào nấm (nếu có).',
      'Ốp la 1 quả trứng sao cho lòng đỏ còn lòng đào.',
      'Xếp cơm trắng vào tô đá nóng, xếp xung quanh là thịt bò, giá đỗ, cà rốt. Đặt trứng ốp la ở giữa.',
      'Khi ăn cho thêm tương ớt Gochujang, trộn đều tất cả lên và thưởng thức.'
    ]
  },

  // THAILAND
  {
    cuisine: 'Thái Lan',
    title: 'Canh Tom Yum Goong',
    description: 'Súp tôm chua cay bùng nổ hương vị sả chanh béo ngậy nước cốt dừa.',
    englishKeyword: 'tomyum,shrimp',
    ingredients: [
      { name: 'Tôm', quantity: '200g' },
      { name: 'Sả', quantity: '2 cây' },
      { name: 'Lá chanh', quantity: '5 lá' },
      { name: 'Nước cốt dừa', quantity: '100ml' },
      { name: 'Ớt', quantity: '3 trái' }
    ],
    instructions: [
      'Làm sạch tôm, bóc vỏ bỏ đầu (có thể giữ lại đầu tôm hầm lấy nước ngọt).',
      'Đập dập sả, thái lát riềng, vò nát lá chanh thái.',
      'Đun sôi nước, cho sả, riềng, lá chanh, ớt vào đun để tỏa mùi thơm.',
      'Cho tôm vào nấu vừa chín tới, nêm nước mắm, đường, nước cốt chanh để có vị chua cay mặn ngọt cân bằng.',
      'Cuối cùng thêm nước cốt dừa vào tạo độ béo, đun sôi nhẹ rồi tắt bếp.'
    ]
  },
  {
    cuisine: 'Thái Lan',
    title: 'Phở Xào Pad Thai',
    description: 'Sợi phở xào kiểu Thái dai ngon hòa quyện với sốt me chua ngọt và đậu phộng rang.',
    englishKeyword: 'padthai,noodle',
    ingredients: [
      { name: 'Bánh phở', quantity: '200g (loại khô)' },
      { name: 'Tôm', quantity: '150g' },
      { name: 'Đậu phộng', quantity: '50g (rang giã nhỏ)' },
      { name: 'Trứng', quantity: '2 quả' },
      { name: 'Giá đỗ', quantity: '100g' }
    ],
    instructions: [
      'Ngâm bánh phở khô trong nước ấm cho mềm. Trộn sốt Pad Thai gồm cốt me, nước mắm, đường thốt nốt.',
      'Làm nóng chảo, xào chín tôm rồi vớt ra để riêng.',
      'Cho bánh phở vào xào cùng nước sốt me đến khi ngấm gia vị.',
      'Gạt phở sang một góc chảo, đập trứng vào góc trống đánh tơi rồi trộn đều cùng phở.',
      'Cho giá đỗ, hẹ, tôm vào đảo nhanh tay. Tắt bếp bày ra đĩa, rắc đậu phộng rang giã nhỏ lên trên cùng vắt thêm chanh.'
    ]
  }
];


async function main() {
  console.log('Cleaning up existing data...');
  // Clean up old data to prevent duplication when running the seed script multiple times
  await prisma.instruction.deleteMany();
  await prisma.recipeIngredient.deleteMany();
  await prisma.recipe.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.cuisine.deleteMany();
  await prisma.image.deleteMany();

  console.log('Seeding database with REAL RECIPES...');

  // 1. Create Ingredients
  for (const ingredientName of ingredientsList) {
    await prisma.ingredient.upsert({
      where: { name: ingredientName },
      update: {},
      create: { name: ingredientName }
    });
  }
  const allIngredients = await prisma.ingredient.findMany();
  const getIngredientId = (name: string) => allIngredients.find(i => i.name === name)?.id;

  // 2. Create Cuisines & Recipes
  for (const cuisineData of cuisinesData) {
    // Create Cuisine
    const cuisine = await prisma.cuisine.create({ data: { name: cuisineData.name } });

    // Filter recipes for this cuisine
    const cuisineRecipes = realRecipes.filter(r => r.cuisine === cuisine.name);

    for (let i = 0; i < cuisineRecipes.length; i++) {
      const rData = cuisineRecipes[i];
      if (!rData) continue; // safety check
      console.log(`Generating recipe: ${rData.title}`);

      // Create Image
      const image = await prisma.image.create({
        data: {
          url: `https://loremflickr.com/640/480/${rData.englishKeyword}?lock=${cuisine.id * 100 + i}`
        }
      });

      // Prepare ingredients connection
      const recipeIngredients = rData.ingredients.map(ing => {
        const id = getIngredientId(ing.name);
        if (!id) throw new Error(`Ingredient ${ing.name} not found in master list!`);
        return {
          ingredientId: id,
          quantity: ing.quantity
        };
      });

      // Create Recipe
      await prisma.recipe.create({
        data: {
          title: rData.title,
          description: rData.description,
          cuisineId: cuisine.id,
          imageId: image.id,
          ingredients: {
            create: recipeIngredients
          },
          instructions: {
            create: rData.instructions.map((desc, idx) => ({
              stepNumber: idx + 1,
              description: desc
            }))
          }
        }
      });
    }
  }

  console.log('Seeding REAL RECIPES completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
