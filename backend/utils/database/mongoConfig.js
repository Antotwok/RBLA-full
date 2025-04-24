// Architect: SP
const mongoose = require('mongoose');
const chalk = require('chalk');
require('dotenv').config();

// Get MongoDB URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error(chalk.red('\n❌ Error: MongoDB Configuration Failed'));
    console.error(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
    console.error(chalk.red('✗ Missing MongoDB URI in .env file'));
    console.error(chalk.yellow('\nPlease check the following:'));
    console.error(chalk.dim('- MONGO_URI environment variable'));
    console.error(chalk.dim('- Format should be: mongodb://[username:password@]host[:port]/database\n'));
    throw new Error('MongoDB URI is missing in environment variables');
}

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

// Connect to MongoDB
async function connectDB() {
    try {
        console.log(chalk.cyan('\n🔄 Initializing MongoDB Connection...'));
        
        const conn = await mongoose.connect(MONGO_URI, options);
        
        // Get database name and hide sensitive parts of the connection string
        const dbName = conn.connection.name;
        const maskedURI = MONGO_URI.replace(
            /mongodb(\+srv)?:\/\/(.[^@]+@)?/,
            'mongodb$1://******@'
        );

        // ASCII art for success message
        const successArt = `
    🌟 ${chalk.green('✓')} MongoDB Connected Successfully ${chalk.green('✓')} 🌟
    ===============================================
    ${chalk.cyan('📦 Database:')} ${chalk.yellow(dbName)}
    ${chalk.cyan('🔐 URI:')} ${chalk.dim(maskedURI)}
    ${chalk.cyan('📡 Status:')} ${chalk.green('Connected ✓')}
    ${chalk.cyan('🚀 Version:')} ${chalk.green(mongoose.version)}
    ===============================================
        `;
        
        console.log(successArt);
        console.log(chalk.green('✨ Database connection established successfully!'));
        console.log(chalk.yellow('💡 Ready to handle database operations\n'));

    } catch (error) {
        console.error(chalk.red('\n❌ Error: MongoDB Connection Failed'));
        console.error(chalk.red('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
        console.error(chalk.red(`✗ ${error.message}`));
        console.error(chalk.yellow('\nTroubleshooting steps:'));
        console.error(chalk.dim('1. Check your internet connection'));
        console.error(chalk.dim('2. Verify your MongoDB URI'));
        console.error(chalk.dim('3. Ensure MongoDB server is running'));
        console.error(chalk.dim('4. Check database access permissions\n'));
        throw error;
    }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log(chalk.yellow('\n🔌 MongoDB Disconnected'));
});

mongoose.connection.on('reconnected', () => {
    console.log(chalk.green('\n🔄 MongoDB Reconnected'));
});

module.exports = connectDB;
