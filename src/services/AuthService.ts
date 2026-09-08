import jwt from 'jsonwebtoken';

export const handleGoogleCallback = (payload: { id: string; jwtSecureCode: string }) => {
    // Generate JWT token
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_SECRET is not defined');
    }

    const authToken = jwt.sign(payload, secret, { expiresIn: '7d' });
    
    return { authToken };
};
