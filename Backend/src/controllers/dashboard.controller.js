import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import mongoose from "mongoose"

const getChannelStats = asyncHandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id)

    const [totalVideos, totalSubscribers, likeData, viewData] = await Promise.all([
        Video.countDocuments({ owner: userId }),
        Subscription.countDocuments({ channel: userId }),
        Like.aggregate([
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "video"
                }
            },
            { $unwind: "$video" },
            { $match: { "video.owner": userId } },
            { $count: "total" }
        ]),
        Video.aggregate([
            { $match: { owner: userId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ])
    ])

    const stats = {
        totalVideos,
        totalSubscribers,
        totalLikes: likeData[0]?.total || 0,
        totalViews: viewData[0]?.totalViews || 0
    }

    return res.status(200).json(new ApiResponse(200, stats, "Channel stats fetched"))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 })
    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched"))
})

export { getChannelStats, getChannelVideos }