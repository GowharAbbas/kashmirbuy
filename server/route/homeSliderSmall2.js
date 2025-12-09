import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { addHomeSlideSmall2, deleteSlideSmall2, getHomeSlidesSmall2, getSlideSmall2, removeImageFromCloudinary, uploadImages } from '../controllers/homeSliderSmall2.js';
// import { addHomeSlide, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, uploadImages } from '../controllers/homeSlider.js';

const sliderSmall2Router = Router();

sliderSmall2Router.post('/uploadImages', auth, upload.array('images'), uploadImages);

sliderSmall2Router.post("/", auth, addHomeSlideSmall2);

sliderSmall2Router.get("/",getHomeSlidesSmall2);

sliderSmall2Router.get("/:id",getSlideSmall2);

sliderSmall2Router.delete('/deleteImage', auth, removeImageFromCloudinary);

sliderSmall2Router.delete("/:id",auth,deleteSlideSmall2);

export default sliderSmall2Router;