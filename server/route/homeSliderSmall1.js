import { Router } from 'express';
import auth from '../middlewares/auth.js';
import upload from '../middlewares/multer.js';
import { addHomeSlideSmall1, deleteSlideSmall1, getHomeSlidesSmall1, getSlideSmall1, removeImageFromCloudinary, uploadImages } from '../controllers/homeSliderSmall1.js';
// import { addHomeSlide, deleteSlide, getHomeSlides, getSlide, removeImageFromCloudinary, uploadImages } from '../controllers/homeSlider.js';

const sliderSmall1Router = Router();

// sliderSmall1Router.post('/uploadImages', auth, upload.array('images'), uploadImages);

sliderSmall1Router.post('/uploadImages', auth, uploadImages);


sliderSmall1Router.post("/", auth, addHomeSlideSmall1);

sliderSmall1Router.get("/",getHomeSlidesSmall1);

sliderSmall1Router.get("/:id",getSlideSmall1);

sliderSmall1Router.delete('/deleteImage', auth, removeImageFromCloudinary);

sliderSmall1Router.delete("/:id",auth,deleteSlideSmall1);

export default sliderSmall1Router;