import UserInterface from '../interfaces/entityInterface/Iuser';
import userModel from '../models/userModel';


class UserRepository {
    async emailExistCheck(email: string): Promise<UserInterface |null> {
        try {
            console.log(email);console.log('your email');
            const userFound = await userModel.findOne({ email: email });
            return userFound as UserInterface;
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async saveUser(userData: UserInterface): Promise<UserInterface | null> {
        try {
            const newUser = new userModel(userData);
            await newUser.save();
            return newUser as UserInterface
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
    async getUserById(id: string): Promise<UserInterface | null> {
        try {
            return await userModel.findById(id);
        } catch (error) {
            console.log(error as Error);
            return null;
        }
    }
}

export default UserRepository;