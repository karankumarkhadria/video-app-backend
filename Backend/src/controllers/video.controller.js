import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import mongoose from "mongoose"

// GET /api/v1/videos
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const pipeline = []

    if (userId) {
        pipeline.push({
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        })
    }

    // only published videos
    pipeline.push({ $match: { isPublished: true } })

    // filter by title if query provided
    if (query) {
        pipeline.push({
            $match: {
                title: { $regex: query, $options: "i" }
            }
        })
    }

    // sort
    pipeline.push({
        $sort: { [sortBy]: sortType === "desc" ? -1 : 1 }
    })

    // join owner info
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [
                { $project: { fullname: 1, username: 1, avatar: 1 } }
            ]
        }
    })

    pipeline.push({ $addFields: { owner: { $first: "$owner" } } })

    const options = { page: parseInt(page), limit: parseInt(limit) }
    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options)

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched"))
})

// POST /api/v1/videos
const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "Title and description required")
    }

    const videoLocalPath = req.files?.videoFile?.[0]?.path
    const thumbLocalPath = req.files?.thumbNail?.[0]?.path

    if (!videoLocalPath) throw new ApiError(400, "Video file required")
    if (!thumbLocalPath) throw new ApiError(400, "Thumbnail required")

    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbNail = await uploadOnCloudinary(thumbLocalPath)

    if (!videoFile) throw new ApiError(500, "Video upload to cloudinary failed")
    if (!thumbNail) throw new ApiError(500, "Thumbnail upload to cloudinary failed")

    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbNail: thumbNail.url,
        duration: videoFile.duration || 0,
        owner: req.user._id,
        isPublished: true
    })

    return res.status(201).json(new ApiResponse(201, video, "Video published successfully"))
})

// GET /api/v1/videos/:videoId
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(videoId) } },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    { $project: { fullname: 1, username: 1, avatar: 1 } }
                ]
            }
        },
        { $addFields: { owner: { $first: "$owner" } } }
    ])

    if (!video.length) throw new ApiError(404, "Video not found")

    // increment views
    await Video.findByIdAndUpdate(videoId, { $inc: { views: 1 } })

    // add to watch history if logged in
    if (req.user?._id) {
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchHistory: videoId }
        })
    }

    return res.status(200).json(new ApiResponse(200, video[0], "Video fetched successfully"))
})

// DELETE /api/v1/videos/:videoId
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video")
    }

    await Video.findByIdAndDelete(videoId)

    return res.status(200).json(new ApiResponse(200, {}, "Video deleted successfully"))
})

// PATCH /api/v1/videos/toggle/publish/:videoId
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Unauthorized")
    }

    video.isPublished = !video.isPublished
    await video.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, video, "Publish status toggled"))
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    deleteVideo,
    togglePublishStatus
}