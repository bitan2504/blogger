import bcryptjs from "bcryptjs";

/**
 * Hash a password using bcryptjs
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcryptjs.genSalt(
        parseInt(process.env.BCRYPT_SALT_ROUNDS || "10")
    );
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
};

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcryptjs.compare(password, hashedPassword);
};
