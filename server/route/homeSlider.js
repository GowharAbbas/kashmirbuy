import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { addHomeSlide, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, uploadImages } from '../controllers/homeSlider.js';

const sliderRouter = Router();

sliderRouter.post('/uploadImages', auth, upload.array('images'), uploadImages);

sliderRouter.post("/", auth, addHomeSlide);

sliderRouter.get("/",getHomeSlides);

sliderRouter.get("/:id",getSlide);

sliderRouter.delete('/deleteImage', auth, removeImageFromCloudinary);

sliderRouter.delete("/:id",auth,deleteSlide);

export default sliderRouter;