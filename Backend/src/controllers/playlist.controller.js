import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Playlist } from "../models/playlist.model.js"
import mongoose from "mongoose"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name?.trim()) throw new ApiError(400, "Name is required")

    const playlist = await Playlist.create({ name, description, owner: req.user._id, videos: [] })
    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params
    if (!mongoose.isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID")

    const playlists = await Playlist.find({ owner: userId }).sort({ createdAt: -1 })
    return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!mongoose.isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist ID")

    const playlist = await Playlist.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(playlistId) } },
        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
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
        }
    ])

    if (!playlist.length) throw new ApiError(404, "Playlist not found")
    return res.status(200).json(new ApiResponse(200, playlist[0], "Playlist fetched"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    if (!playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId)
        await playlist.save({ validateBeforeSave: false })
    }

    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    playlist.videos = playlist.videos.filter(v => v.toString() !== videoId)
    await playlist.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")
    if (playlist.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "Unauthorized")

    if (name) playlist.name = name
    if (description) playlist.description = description
    await playlist.save({ validateBeforeSave: false })

    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated"))
})

export { createPlaylist, getUserPlaylists, getPlaylistById, addVideoToPlaylist, removeVideoFromPlaylist, deletePlaylist, updatePlaylist }