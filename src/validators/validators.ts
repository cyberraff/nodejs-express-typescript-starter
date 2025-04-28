import { z } from 'zod';

// Define a schema for the User registration
export const userSchema = z.object( {
    firstName: z.string().min( 1, { message: 'First name is required' } ),
    email: z.string().email( { message: 'Invalid email format' } ),
    password: z.string().min( 6, { message: 'Password must be at least 6 characters' } ),
} );

// Login Schema
export const loginSchema = z.object( {
    email: z.string().email( { message: 'Invalid email format' } ),
    password: z.string().min( 6, { message: 'Password must be at least 6 characters' } ),
} );