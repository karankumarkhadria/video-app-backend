import { Router } from "express"
import {
    getAllVideos, publishVideo, getVideoById,
    deleteVideo, togglePublishStatus
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/")
    .get(getAllVideos)
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbNail", maxCount: 1 }
        ]),
        publishVideo
    )

router.route("/:videoId")
    .get(getVideoById)
    .delete(verifyJWT, deleteVideo)

router.route("/toggle/publish/:videoId")
    .patch(verifyJWT, togglePublishStatus)

export default router