import mongoose from "mongoose";
import jobModel from "../models/jobModel";
import { JobBodyInterface } from "../controllers/jobController";
import jobApplicationModel from "../models/jobApplicationModel";
import userModel from "../models/userModel";


class JobRepository {

    async landingPageJobs(search: string | undefined) {
        try {
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {}
            const alljobs = await jobModel.find(keyword).sort({ createdAt: -1 }).limit(6)
            return alljobs;
        } catch (error) {
            console.log(error as Error);
        }
    }

    async getAllJobs(search: string | undefined, userId: string) {
        try {
            const keyword = search ? {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company_name: { $regex: search, $options: 'i' } },
                    { industry: { $regex: search, $options: 'i' } },
                    { location: { $regex: search, $options: 'i' } },
                    { job_type: { $regex: search, $options: 'i' } }
                ]
            } : {}
            // const alljobs = await jobModel.find(keyword).sort({ createdAt: -1 })
            const alljobs = await jobModel.find({ $and: [{ isReported: false }, keyword] }).sort({ createdAt: -1 })

            var userSkills: string[] | any = await userModel.findOne({ _id: userId }, { skills: 1 });
            if (userSkills) userSkills = userSkills.skills;

            const jobs = await jobModel.aggregate([
                { $match: { isReported: false } },
                {
                    $addFields: {
                        matchedSkills: {
                            $size: {
                                $setIntersection: ["$skills", userSkills]
                            }
                        }
                    }
                },
                {
                    $match: {
                        matchedSkills: { $gte: 1 }
                    }
                }
            ]);
            return { jobs, alljobs }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getAllJobsByskills() {
        try {
            const jobs = await jobModel.aggregate([
                {
                    $match: {
                        skills: { $in: ['JavaScript', 'React', 'Node.js', 'sql', 'TypeScript', 'express', 'Mongodb'] }
                    }
                },
                {
                    $addFields: {
                        matchedSkills: { $setIntersection: ["$skills", ["Mongodb", "sql", "express", "Node.js"]] }
                    }
                },
                {
                    $match: {
                        $expr: { $gte: [{ $size: "$matchedSkills" }, 3] }
                    }
                }
            ]);

        } catch (error) {
            console.log(error as Error);
        }
    }
    async getSingleJobDetails(jobId: string) {
        try {
            const job = await jobModel.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(jobId) } },
                { $lookup: { from: 'users', localField: 'recruiterId', foreignField: '_id', as: 'recruiter_details' } },
                { $addFields: { recruiter_details: { $first: '$recruiter_details' } } }
            ])
            return job[0];
        } catch (error) {
            console.log(error as Error);
        }
    }
    async applyJOb(jobId: string, userId: string, formData: JobBodyInterface) {
        try {
            const jobApplication = new jobApplicationModel({
                ...formData,
                userId,
                jobId
            })
            await jobApplication.save();
            return jobApplication;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getJobsByDate(num: string) {
        try {
            const jobs = await jobModel.find({ updatedAt: { $gte: new Date(Date.now() - parseInt(num) * 24 * 60 * 60 * 1000) } });
            return jobs;
        } catch (error) {
            console.log(error as Error)
        }
    }
    async getJobsByExperience(start: string, end: string) {
        try {
            let jobs;
            if (start === '0' && end === '0') jobs = await jobModel.find({ experience: 0 });
            else if (end === '0') jobs = await jobModel.find({ experience: { $gt: start } });
            else jobs = await jobModel.find({ experience: { $gt: start, $lt: end } });
            return jobs;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async changeReportStatus(jobId: string) {
        try {
            const job = await jobModel.findById(jobId);
            if (job) {
                job.isReported = true;
                await job.save();
                return job;
            }
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getMonthlyJobPostCount() {
        try {
            const monthlyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1 }
                }
            ])

            console.log('Monthly Job Post Count:', monthlyCount);
            return monthlyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getDailyJobPostCount() {
        try {
            const dailyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
                }
            ])

            console.log('Daily Job Post Count:', dailyCount);
            return dailyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
    async getYearlyJobPostCount() {
        try {
            const yearlyCount = await jobModel.aggregate([
                {
                    $group: {
                        _id: { year: { $year: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.year": 1 }
                }
            ])

            console.log('Yearly Job Post Count:', yearlyCount);
            return yearlyCount;
        } catch (error) {
            console.log(error as Error);
        }
    }
}

export default JobRepository;