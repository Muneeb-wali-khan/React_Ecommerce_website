import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

const cloudinaryUploadImg = async (filePath) => {
    try {
        if(!filePath) return console.log("local file path not found");
        const res = await cloudinary.uploader.upload(filePath,{
            resource_type: "auto",
        })
        fs.unlinkSync(filePath)
        return res
    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
};



const RemovecloudinaryExistingImg = async (publicId) => {
    try {

        const res = await cloudinary.uploader.destroy(publicId,{
            resource_type: "image",
        }).then((res)=>{
            console.log("done old img", res);
        }).catch((err)=>{
            console.log("error old img", err?.message);
        })
    } catch (error) {
        return null;
    }
};



export { cloudinaryUploadImg ,RemovecloudinaryExistingImg};