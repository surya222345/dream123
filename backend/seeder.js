// const dotenv = require('dotenv');
// const Product = require('./models/Product');
// const User = require('./models/User');
// const sequelize = require('./config/db');

// dotenv.config();

// const products = [
//     {
//         name: 'Royal Indian Saree',
//         images: ['https://plus.unsplash.com/premium_photo-1671131753965-f938c03e3368?auto=format&fit=crop&q=80&w=800'],
//         description: 'Exquisite silk saree with intricate gold patterns. Perfect for weddings and festivals.',
//         category: 'traditional',
//         price: 4999,
//         countInStock: 10,
//         sizes: ['Free Size'],
//         colors: ['Red', 'Gold'],
//     },
//     {
//         name: 'Designer Lehengas',
//         images: ['https://images.unsplash.com/photo-1603522784534-1925b6826500?auto=format&fit=crop&q=80&w=800'],
//         description: 'Premium designer lehenga for a glamorous ethnic look.',
//         category: 'party',
//         price: 7999,
//         countInStock: 5,
//         sizes: ['S', 'M', 'L'],
//         colors: ['Pink', 'Maroon'],
//     },
//     {
//         name: 'Cotton Casual Kurti',
//         images: ['https://images.unsplash.com/photo-1610030469983-98ef80b66a92?auto=format&fit=crop&q=80&w=800'],
//         description: 'Comfortable everyday cotton kurti with trendy prints.',
//         category: 'casual',
//         price: 899,
//         countInStock: 25,
//         sizes: ['M', 'L', 'XL', 'XXL'],
//         colors: ['White', 'Blue'],
//     },
//     {
//         name: 'Elegant Anarkali Gown',
//         images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800'],
//         description: 'Stunning floor-length Anarkali dress for special occasions.',
//         category: 'traditional',
//         price: 2499,
//         countInStock: 15,
//         sizes: ['S', 'M', 'L'],
//         colors: ['Yellow', 'Green'],
//     },
//     {
//         name: 'Classic Stretchable Blouse',
//         images: ['https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80&w=800'],
//         description: 'High-quality stretchable material for ultimate comfort and perfect fit. Pairs beautifully with any saree.',
//         category: 'blouse',
//         price: 499,
//         countInStock: 50,
//         sizes: ['S', 'M', 'L', 'XL'],
//         colors: ['Black', 'Gold', 'Red'],
//     },
// ];

// const adminUser = {
//     name: 'Admin User',
//     email: 'admin@example.com',
//     password: 'password123',
//     role: 'admin'
// };

// const importData = async () => {
//     try {
//         await sequelize.sync();
//         await Product.destroy({ where: {} });
//         await User.destroy({ where: { role: 'admin' } }); // Don't wipe all users, just seeded admin if exists

//         await Product.bulkCreate(products);
//         await User.create(adminUser);

//         console.log('✅ Data Imported (Admin: admin@example.com / password123)');
//         process.exit();
//     } catch (error) {
//         console.error(`${error}`);
//         process.exit(1);
//     }
// };

// importData();




const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const sequelize = require('./config/db');

dotenv.config();

// ❌ Removed Unsplash images
// ✅ Use your own images (from uploads folder or your server)

const products = [
    {
        name: 'Royal Indian Saree',
        images: ['/uploads/saree.jpg'],
        description: 'Exquisite silk saree with intricate gold patterns. Perfect for weddings and festivals.',
        category: 'traditional',
        price: 4999,
        countInStock: 10,
        sizes: ['Free Size'],
        colors: ['Red', 'Gold'],
    },
    {
        name: 'Designer Lehengas',
        images: ['/uploads/lehenga.jpg'],
        description: 'Premium designer lehenga for a glamorous ethnic look.',
        category: 'party',
        price: 7999,
        countInStock: 5,
        sizes: ['S', 'M', 'L'],
        colors: ['Pink', 'Maroon'],
    },
    {
        name: 'Cotton Casual Kurti',
        images: ['/uploads/kurti.jpg'],
        description: 'Comfortable everyday cotton kurti with trendy prints.',
        category: 'casual',
        price: 899,
        countInStock: 25,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['White', 'Blue'],
    },
    {
        name: 'Elegant Anarkali Gown',
        images: ['/uploads/anarkali.jpg'],
        description: 'Stunning floor-length Anarkali dress for special occasions.',
        category: 'traditional',
        price: 2499,
        countInStock: 15,
        sizes: ['S', 'M', 'L'],
        colors: ['Yellow', 'Green'],
    },
    {
        name: 'Classic Stretchable Blouse',
        images: ['/uploads/blouse.jpg'],
        description: 'High-quality stretchable material for ultimate comfort and perfect fit. Pairs beautifully with any saree.',
        category: 'blouse',
        price: 499,
        countInStock: 50,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Gold', 'Red'],
    },
];

const adminUser = {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
};

const importData = async () => {
    try {
        await sequelize.sync();

        // ❌ DON'T DELETE PRODUCTS
        // await Product.destroy({ where: {} });

        // ❌ DON'T DELETE ALL USERS
        // await User.destroy({ where: { role: 'admin' } });

        // ✅ Insert products only if DB empty
        const productCount = await Product.count();

        if (productCount === 0) {
            await Product.bulkCreate(products);
            console.log('✅ Sample Products Added');
        } else {
            console.log('ℹ️ Products already exist');
        }

        // ✅ Create admin only if not exists
        const existingAdmin = await User.findOne({
            where: { email: adminUser.email }
        });

        if (!existingAdmin) {
            await User.create(adminUser);
            console.log('✅ Admin Created');
        } else {
            console.log('ℹ️ Admin already exists');
        }

        console.log('🚀 Setup Complete! Use Admin Panel to add products');
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

importData();