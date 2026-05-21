import { v2 as cloudinary } from "cloudinary"
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_APIKEY,
  api_secret: process.env.CLOUDINARY_APISECRET
})

const storagePerfil = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gamewired/perfil",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

const storagePosts = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gamewired/posts",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

const storageNews = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gamewired/news",
    allowed_formats: ["jpg", "png", "jpeg"]
  }
})

export const uploadPerfil = multer({ storage: storagePerfil })
export const uploadPosts = multer({ storage: storagePosts })
export const uploadNews = multer({ storage: storageNews })

export default cloudinary