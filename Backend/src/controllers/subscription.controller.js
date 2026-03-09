import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"

// POST /api/v1/subscriptions/c/:channelId
const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID")

    const existing = await Subscription.findOne({ subscriber: req.user._id, channel: channelId })
    if (existing) {
        await Subscription.findByIdAndDelete(existing._id)
        return res.status(200).json(new ApiResponse(200, { subscribed: false }, "Unsubscribed"))
    }
    await Subscription.create({ subscriber: req.user._id, channel: channelId })
    return res.status(200).json(new ApiResponse(200, { subscribed: true }, "Subscribed"))
})

// GET /api/v1/subscriptions/c/:channelId — get subscribers of a channel
const getUserSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    if (!mongoose.isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID")

    const subscribers = await Subscription.aggregate([
        { $match: { channel: new mongoose.Types.ObjectId(channelId) } },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",
                pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }]
            }
        },
        { $addFields: { subscriber: { $first: "$subscriber" } } },
        { $replaceRoot: { newRoot: "$subscriber" } }
    ])

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched"))
})

// GET /api/v1/subscriptions/u/:subscriberId — get channels user has subscribed to
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if (!mongoose.isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID")

    const channels = await Subscription.aggregate([
        { $match: { subscriber: new mongoose.Types.ObjectId(subscriberId) } },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",
                pipeline: [{ $project: { fullname: 1, username: 1, avatar: 1 } }]
            }
        },
        { $addFields: { channel: { $first: "$channel" } } },
        { $replaceRoot: { newRoot: "$channel" } }
    ])

    return res.status(200).json(new ApiResponse(200, channels, "Subscribed channels fetched"))
})

export { toggleSubscription, getUserSubscribers, getSubscribedChannels }