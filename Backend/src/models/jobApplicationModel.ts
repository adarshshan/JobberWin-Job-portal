import mongoose, { ObjectId, Schema } from "mongoose";

export interface JobApplicationInterface extends Document {
    _id: ObjectId,
    jobseekerId: ObjectId,
    jobId: ObjectId,
    createdAt: string,
    resume: string,
    status: string,
    qualification: string,
    experience: number
}

const jobApplicationSchema: Schema = new Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    resume: {
        type: String,
    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    },
    status: {
        type: String,
        enum: ['Approved', 'Rejected', 'Applied'],
        default: 'Applied'
    },
    qualification: {
        type: String
    },
    experience: {
        type: Number
    }
}, {
    timestamps: true,
})

const jobApplicationModel = mongoose.model<JobApplicationInterface>('jobApplication', jobApplicationSchema);

export default jobApplicationModel;