import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Like } from "../models/like.model.js"
import mongoose from "mongoose"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID")

    const existing = await Like.findOne({ video: videoId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked"))
    }
    await Like.create({ video: videoId, likedBy: req.user._id })
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID")

    const existing = await Like.findOne({ comment: commentId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked"))
    }
    await Like.create({ comment: commentId, likedBy: req.user._id })
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!mongoose.isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID")

    const existing = await Like.findOne({ tweet: tweetId, likedBy: req.user._id })
    if (existing) {
        await Like.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { liked: false }, "Unliked"))
    }
    await Like.create({ tweet: tweetId, likedBy: req.user._id })
    return res.status(200).json(new ApiResponse(200, { liked: true }, "Liked"))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likes = await Like.aggregate([
        { $match: { likedBy: new mongoose.Types.ObjectId(req.user._id), video: { $exists: true, $ne: null } } },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    { $match: { isPublished: true } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }]
                        }
                    },
                    { $addFields: { owner: { $first: "$owner" } } }
                ]
            }
        },
        { $addFields: { video: { $first: "$video" } } },
        { $match: { video: { $ne: null } } },
        { $replaceRoot: { newRoot: "$video" } }
    ])

    return res.status(200).json(new ApiResponse(200, likes, "Liked videos fetched"))
})

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos }