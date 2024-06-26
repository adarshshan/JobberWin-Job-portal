import UserInterface from '../interfaces/entityInterface/Iuser';
import { SubInterface } from '../interfaces/serviceInterfaces/subscription';
import userModel from '../models/userModel';
import mongoose from 'mongoose';


class UserRepository {
    async emailExistCheck(email: string): Promise<UserInterface | null> {
        try {
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
    async getAllUsers(search: string | undefined, userId: string) {
        try {
            const keyword = search ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            } : {}
            const allUsers = await userModel.find(keyword).find({ _id: { $ne: userId } });
            return allUsers;
        } catch (error) {
            console.log(error as Error);
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
    async getApplied(userId: string) {
        try {
            const ObjectId = mongoose.Types.ObjectId;
            const UserId = new ObjectId(userId)

            const user = await userModel.aggregate([
                { $match: { _id: UserId } },
                { $unwind: "$appliedJobs" },
                {
                    $lookup: {
                        from: "jobs",
                        localField: "appliedJobs.jobId",
                        foreignField: "_id",
                        as: "appliedJobs.jobDetails"
                    }
                },
                {
                    $addFields: {
                        "appliedJobs.jobDetails": { $arrayElemAt: ["$appliedJobs.jobDetails", 0] }
                    }
                },
                { $sort: { "appliedJobs.appliedAt": -1 } },
                {
                    $group: {
                        _id: "$_id",
                        name: { $first: "$name" },
                        email: { $first: "$email" },
                        role: { $first: "$role" },
                        profile_picture: { $first: "$profile_picture" },
                        cover_image: { $first: "$cover_image" },
                        skills: { $first: "$skills" },
                        aboutInfo: { $first: "$aboutInfo" },
                        appliedJobs: { $push: "$appliedJobs" }
                    }
                }
            ])
            if (user[0]?.appliedJobs === undefined) return [];
            else return user[0]?.appliedJobs;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changeAboutInfo(id: string, text: string): Promise<string | undefined> {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { aboutInfo: text }, { new: true });
            if (updated) return text
        } catch (error) {
            console.log(error as Error)
        }
    }
    async setProfilePic(pic: string, id: string) {
        try {
            const updated = await userModel.findByIdAndUpdate(id, { profile_picture: pic });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async deleteProfilePic(userId: string) {
        try {
            const updatedUser = await userModel.updateOne({ _id: userId }, { $set: { profile_picture: "" } });
            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    }
    async addSkill(id: string, skill: string) {
        try {
            const updated = await userModel.findOneAndUpdate({ _id: id }, { $addToSet: { skills: skill } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllSkill(userId: string) {
        try {
            const data = await userModel.findOne({ _id: userId }, { _id: 0, skills: 1 });
            const skills = data?.skills;
            return skills;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async removeSkill(id: string, skill: string) {
        try {
            const updated = await userModel.updateOne({ _id: id }, { $pull: { skills: skill } });
            return updated;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async editUserDetails(name: string, phoneNumber: number, gender: string, location: string, headLine: string, qualification: string, userId: string) {
        try {
            const user = await userModel.findById(userId);
            if (user) {
                user.name = name || user.name;
                user.phoneNumber = phoneNumber || user.phoneNumber;
                user.gender = gender || user.gender;
                user.location = location || user.location;
                user.headLine = headLine || user.headLine;
                user.qualification = qualification || user.qualification;
            }
            const updatedUser = await user?.save();
            return updatedUser
        } catch (error) {
            console.log(error as Error);
        }
    }
    async updateNewPassword(password: string, userId: string) {
        try {
            const user = await userModel.findById(userId);
            if (user) user.password = password;
            const updatedUser = await user?.save();
            return updatedUser;
        } catch (error) {
            console.log(error as Error);
        }
    }

    async saveJob(userId: string, jobId: string) {
        try {
            const User = await userModel.findById(userId);
            if (User) {
                let savedJobs;
                if (User.savedJobs?.length) {
                    savedJobs = User?.savedJobs.some(user => user.jobId === jobId);
                }
                if (!savedJobs) {
                    const user = await userModel.findByIdAndUpdate(userId,
                        { $addToSet: { savedJobs: { jobId: jobId } } },
                        { new: true }
                    )
                    return { success: true, data: user, message: 'successfully saved the job' } as const;
                } else return { success: false, message: 'already saved the job' } as const;
            } else return { success: false, message: `unauthorized user, couldn't load the saved list` };
        } catch (error) {
            console.error(error as Error);
            return null
        }
    }

    async unsaveJob(userId: string, jobId: string) {
        try {
            const user = await userModel.findByIdAndUpdate(userId,
                { $pull: { savedJobs: { jobId: jobId } } },
                { new: true }
            )
            return user
        } catch (error) {
            console.error(error)
            return null
        }
    }
    async getAllSavedJobs(userId: string) {
        try {
            const allData = await userModel.findById(userId)
                .populate('savedJobs.jobId');
            const savedJobs = allData?.savedJobs?.map((item) => item.jobId);
            return savedJobs;
        } catch (error) {
            console.log(error as Error);
        }
    }

    async appliedJob(userId: string, jobId: string) {
        try {
            const user = await userModel.findByIdAndUpdate(userId,
                { $push: { appliedJobs: { jobId: jobId } } },
                { new: true }
            );
            return user
        } catch (error) {
            console.error(error)
            return null
        }
    }
    //.............subscription//................

    async updateSubPlan(userId: string, item: SubInterface) {
        try {
            await userModel.findByIdAndUpdate(userId, { $set: { subscription: { sub_Id: item._id, purchased_At: Date.now() } } }, { new: true });
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default UserRepository;