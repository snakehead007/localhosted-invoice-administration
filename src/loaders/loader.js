import mongooseLoader from './mongoose.js';
import expressLoader from './express.js';

export async function load( expressApp ) {
    const mongooseConnection = await mongooseLoader();
    await expressLoader( expressApp );
}
