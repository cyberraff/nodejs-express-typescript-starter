import mongoose from 'mongoose';

/**
 * Connects to the database using the provided URL.
 *
 * @param {string} url - The URL of the database.
 * @returns {Promise} - A promise that resolves when the connection is established.
 */
const connectDb = async ( url: string ) => {
    try {
        await mongoose.connect( url, );
        console.log( 'Database connection successful' );
    } catch ( error ) {
        console.error( 'Database connection error:', error );
        throw error;
    }
};

export default connectDb;