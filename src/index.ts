import ServerBootstrap from './bootstrap/server.bootstrap';
import DatabaseBootstrap from './bootstrap/database.bootstrap';
import RedisBootstrap from './bootstrap/redis.bootstrap';
import { Logger } from './shared/helpers/logging.helper';

const serverBootstrap = new ServerBootstrap();
const databaseBootstrap = new DatabaseBootstrap();
/* const redisBootstrap = new RedisBootstrap(); */

(async () => {
  try {
    const tasks = [
      serverBootstrap.initialize(),
      databaseBootstrap.initializeDB(),
      /* redisBootstrap.initialize(), */
    ];
    await Promise.all(tasks);
    console.log('Connected to database');
    console.log('Server started');
    console.log('Redis started');
    console.log('Nuevo cambio');
  } catch (error) {
    // Logger(error);
    databaseBootstrap.closeConnection();
    /* redisBootstrap.getConnection().disconnect(); */
    console.log('Error', error);
    process.exit(1);
  }
})();
