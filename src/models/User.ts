import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser extends Document {
    firstName: string;
    email: string;
    password: string;
    comparePassword ( password: string ): Promise<boolean>;
}

const UserSchema = new mongoose.Schema( {
    firstName: { type: String },
    email: { type: String },
    password: { type: String },
}, { timestamps: true } );

// Hash password before saving the user
UserSchema.pre( "save", async function () {
    const salt = await bcrypt.genSalt( 10 );
    this.password = await bcrypt.hash( this.password, salt );
} );

UserSchema.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.firstName },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME },
    );
};

// Password comparison method for authentication
UserSchema.methods.comparePassword = async function ( password ) {
    try {
        const isMatch = await bcrypt.compare( password, this.password );
        return isMatch;
    } catch ( err ) {
        throw new Error( err );
    }
};

const User = mongoose.model<IUser>( 'User', UserSchema );
export { User, IUser };

// export const User = mongoose.model( 'user', UserSchema );
// module.exports = { User };
