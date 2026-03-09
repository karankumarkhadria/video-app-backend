import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Tweet } from "../models/tweet.model.js"
import mongoose from "mongoose"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body
    if (!content?.trim()) throw new ApiError(400, "Content is required")

    const tweet = await Tweet.create({ content, owner: req.user._id })
    return res.status(201).json(new ApiResponse(201, tweet, "Tweet created"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID")

    const tweets = await Tweet.aggregate([
        { $match: { owner: new mongoose.Types.ObjectId(userId) } },
        { $sort: { createdAt: -1 } },
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
    ])

    return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched"))
})

const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    const { content } = req.body
    if (!content?.trim()) throw new ApiError(400, "Content is required")

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found")
    if (tweet.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    tweet.content = content
    await tweet.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    const tweet = await Tweet.findById(tweetId)
    if (!tweet) throw new ApiError(404, "Tweet not found")
    if (tweet.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(new ApiResponse(200, {}, "Tweet deleted"))
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }