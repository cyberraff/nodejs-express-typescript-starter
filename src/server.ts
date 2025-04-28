import app from './app';
import connectDb from './utils/connect';

const port = process.env.PORT || 3000;
const startServer = async () => {
    console.log( 'Starting the server...' );
    try {
        console.log( 'Connecting to the database...' );
        await connectDb( process.env.MONGO_URI );
        console.log( 'Database connected. Starting the server...' );
        app.listen( port, () => console.log( `Server is listening on port ${ port }` ) );
    } catch ( error ) {
        console.log( error );

    }
};


startServer();