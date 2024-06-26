import Admin from '../interfaces/entityInterface/Iadmin';
import UserInterface from '../interfaces/entityInterface/Iuser';
import AdminModel, { AdminInterface } from '../models/adminModel';
import userModel from '../models/userModel';

class AdminRepository {
    async isAdminExist(email: string): Promise<Admin | null> {
        const admin = await AdminModel.findOne({ email: email });
        if (admin) return admin as Admin
        else return null;
    }
    async saveAdmin(adminData: Admin): Promise<Admin | null> {
        try {
            const newAdmin = new AdminModel(adminData);
            await newAdmin.save();
            return newAdmin as Admin;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getUserList(page: number, limit: number, searchQuery: string): Promise<UserInterface[]> {
        try {
            const regex = new RegExp(searchQuery, 'i');
            const result = await userModel.find(
                {
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                })
                .skip((page - 1) * limit)
                .limit(limit)
                .select('-password')
                .exec();
            return result as UserInterface[];
        } catch (error) {
            console.log(error as Error);
            throw new Error('Error occured');
        }
    }
    async getUserCount(searchQuery: string): Promise<number> {
        try {
            const regex = new RegExp(searchQuery, 'i');
            return await userModel.find(
                {
                    $or: [
                        { name: { $regex: regex } },
                        { email: { $regex: regex } }
                    ]
                }).countDocuments();
        } catch (error) {
            console.log(error as Error);
            throw new Error('Error occured');
        }
    }
    async blockNunblockUser(userId: string) {
        try {
            const user = await userModel.findById(userId);
            if (user) {
                user.isBlocked = !user?.isBlocked;
                await user.save();
                return user;
            } else {
                throw new Error('Somthing went wrong!!!');
                return null;
            }
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getAdminById(id: string): Promise<AdminInterface | null> {
        try {
            const admin = await AdminModel.findById(id);
            return admin;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}

export default AdminRepository;