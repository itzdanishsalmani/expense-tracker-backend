import { prisma } from "./prisma";

class UserService {
    async getUser({ userId }: { userId: string }) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                // Do not return sensitive info like jwtSecureCode or googleId
            }
        });
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return user;
    }
}

export default new UserService();
