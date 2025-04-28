import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';

const allowedOrigins = [ 'http://localhost:3001' ]; // your frontend origin

const app = express();

import authRouter from './routes/authRouter';

// app.use( cors() );
app.use(
    cors( {
        origin: allowedOrigins,
        credentials: true,
    } )
);
app.use( express.json() );

app.use( '/api/v1/users', authRouter );
app.get( '/', ( req, res ) => {
    console.log( 'Test route hit' );
    res.send( 'Hello Readers!' );
} );

export default app;