import { Request, Response } from "express";
// import "../types/express"; // Import the extended Request type
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";

import { CustomRequest } from "../middlewares/authenticators";

// Define an interface for user data
interface UserData {
  firstName: string;
  email: string;
  password: string;
}
interface LoginData {
  email: string;
  password: string;
}
const register = async ( req: Request, res: Response ) => {
  try {
    console.log( "Register endpoint hit" );
    const { firstName, email, password }: UserData = req.body;
    // Check for exiting user
    const existingUser = await User.findOne( { email } );
    if ( existingUser ) {
      res.status( StatusCodes.BAD_REQUEST ).json( {
        statusCode: StatusCodes.BAD_REQUEST,
        errors: { message: "Email is already in use." },
      } );
    }

    // Create a new user
    const user = await User.create( { firstName, email, password } );
    console.log( "User created:", user );

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" },
    );

    // Return the created user
    res.status( StatusCodes.CREATED ).json( {
      statusCode: StatusCodes.CREATED,
      data: { token, user },
    } );
  } catch ( error ) {
    res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
      msg: "Something went wrong",
      error,
    } );
  }
};

const login = async ( req: Request, res: Response ) => {
  try {
    console.log( "Login endpoint hit" );
    const { email, password }: LoginData = req.body;

    // Validate required fields
    if ( !email || !password ) {
      console.log( "Validation failed" );
      res.status( StatusCodes.BAD_REQUEST ).json( {
        statusCode: StatusCodes.BAD_REQUEST,
        errors: { message: "All fields are required." },
      } );
    }
    const user = await User.findOne( { email } );
    if ( !user ) {
      res
        .status( StatusCodes.UNAUTHORIZED )
        .json( {
          statusCode: StatusCodes.UNAUTHORIZED,
          errors: { message: "Invalid credentials" },
        } );
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword( password );
    if ( !isPasswordCorrect ) {
      res.json( {
        statusCode: StatusCodes.BAD_REQUEST,
        errors: {
          resource: req.body,
          message: "invalid credentials",
        },
      } );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" },
    );


    console.log( "User logged in:", user.email );

    res.status( StatusCodes.OK ).json( {
      statusCode: StatusCodes.OK,
      data: { token, user: { email: user.email, firstName: user.firstName } },
    } );
  } catch ( error ) {
    res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
      msg: "Something went wrong",
      error,
    } );
  }
};

// Me endpoint
async function me ( req: CustomRequest, res: Response ) {
  try {
    const user = await User.findById( req.user?.userId );
    if ( !user ) {
      res.status( StatusCodes.NOT_FOUND ).json( {
        statusCode: StatusCodes.NOT_FOUND,
        errors: { message: "User not found" },
      } );
    }

    console.log( "User fetched:", user.email );
    res.status( StatusCodes.OK ).json( {
      statusCode: StatusCodes.OK,
      data: { user: { email: user.email, firstName: user.firstName } },
    } );
  } catch ( error ) {
    res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
      msg: "Something went wrong",
      error,
    } );
  }
}

export { register, login, me };

// import { Request, Response } from "express";
// import { User } from "../models/User";
// import jwt from "jsonwebtoken";
// import { StatusCodes } from "http-status-codes";
// import { CustomRequest } from "../middleware/authenticators";

// interface UserData {
//   firstName: string;
//   email: string;
//   password: string;
// }

// interface LoginData {
//   email: string;
//   password: string;
// }

// const register = async ( req: Request, res: Response ) => {
//   try {
//     console.log( "Register endpoint hit" );
//     const { firstName, email, password }: UserData = req.body;

//     const existingUser = await User.findOne( { email } );
//     if ( existingUser ) {
//       res.status( StatusCodes.BAD_REQUEST ).json( {
//         statusCode: StatusCodes.BAD_REQUEST,
//         errors: { message: "Email is already in use." },
//       } );
//     }

//     const user = await User.create( { firstName, email, password } );
//     console.log( "User created:", user );

//     const token = jwt.sign(
//       { userId: user._id, name: user.firstName },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1d" }
//     );

//     // Optionally set cookie during registration too
//     res.cookie( "token", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 1000 * 60 * 60 * 24, // 1 day
//     } );

//     res.status( StatusCodes.CREATED ).json( {
//       statusCode: StatusCodes.CREATED,
//       data: { user: { email: user.email, firstName: user.firstName } },
//     } );
//   } catch ( error ) {
//     res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
//       msg: "Something went wrong",
//       error,
//     } );
//   }
// };

// const login = async ( req: Request, res: Response ) => {
//   try {
//     console.log( "Login endpoint hit" );
//     const { email, password }: LoginData = req.body;

//     if ( !email || !password ) {
//       res.status( StatusCodes.BAD_REQUEST ).json( {
//         statusCode: StatusCodes.BAD_REQUEST,
//         errors: { message: "All fields are required." },
//       } );
//     }

//     const user = await User.findOne( { email } );
//     if ( !user ) {
//       res.status( StatusCodes.UNAUTHORIZED ).json( {
//         statusCode: StatusCodes.UNAUTHORIZED,
//         errors: { message: "Invalid credentials" },
//       } );
//     }

//     const isPasswordCorrect = await user.comparePassword( password );
//     if ( !isPasswordCorrect ) {
//       res.status( StatusCodes.UNAUTHORIZED ).json( {
//         statusCode: StatusCodes.UNAUTHORIZED,
//         errors: { message: "Invalid credentials" },
//       } );
//     }

//     const token = jwt.sign(
//       { userId: user._id, name: user.firstName },
//       process.env.JWT_SECRET as string,
//       { expiresIn: "1d" }
//     );

//     console.log( "User logged in:", user.email );

//     res.cookie( "token", token, {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === "production",
//       secure: false,
//       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       maxAge: 1000 * 60 * 60 * 24,
//     } );

//     res.status( StatusCodes.OK ).json( {
//       statusCode: StatusCodes.OK,
//       data: { user: { email: user.email, firstName: user.firstName } },
//     } );
//   } catch ( error ) {
//     res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
//       msg: "Something went wrong",
//       error,
//     } );
//   }
// };

// async function me ( req: CustomRequest, res: Response ) {
//   try {
//     const user = await User.findById( req.user?.userId );
//     if ( !user ) {
//       res.status( StatusCodes.NOT_FOUND ).json( {
//         statusCode: StatusCodes.NOT_FOUND,
//         errors: { message: "User not found" },
//       } );
//     }

//     console.log( "User fetched:", user.email );
//     res.status( StatusCodes.OK ).json( {
//       statusCode: StatusCodes.OK,
//       data: { user: { email: user.email, firstName: user.firstName } },
//     } );
//   } catch ( error ) {
//     res.status( StatusCodes.INTERNAL_SERVER_ERROR ).json( {
//       msg: "Something went wrong",
//       error,
//     } );
//   }
// }

// export { register, login, me };
