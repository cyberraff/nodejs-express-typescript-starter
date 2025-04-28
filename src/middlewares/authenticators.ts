import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { StatusCodes } from 'http-status-codes';



export interface CustomRequest extends Request {
    user: { userId: string; name: string; };
}

// Generic validation middleware
export const validateRequest = ( schema: ZodSchema ) => {
    return ( req: Request, res: Response, next: NextFunction ) => {
        try {
            schema.parse( req.body );
            next();
        } catch ( error ) {
            if ( error instanceof ZodError ) {
                res.status( StatusCodes.BAD_REQUEST ).json( {
                    statusCode: StatusCodes.BAD_REQUEST,
                    errors: error.errors, // Return structured errors
                } );
            }
            res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
                msg: "Something went wrong",
                error,
            } );
        }
    };
};

export const auth = async ( req: CustomRequest, res: Response, next: NextFunction ) => {
    // check header
    const authHeader = req.headers.authorization;
    if ( !authHeader || !authHeader.startsWith( 'Bearer ' ) ) {
        res.status( StatusCodes.UNAUTHORIZED ).json( {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'Unauthorized'
        } );
    }
    const token = authHeader.split( ' ' )[ 1 ];

    try {
        const payload = jwt.verify( token, process.env.JWT_SECRET! );
        req.user = { userId: ( payload as any ).userId, name: ( payload as any ).name };
        next();
    } catch ( error ) {
        res.status( StatusCodes.UNAUTHORIZED ).json( {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: 'Invalid Token'
        } );
    }

};