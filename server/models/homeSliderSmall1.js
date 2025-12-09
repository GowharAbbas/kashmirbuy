import mongoose from 'mongoose';

const homeSliderSmall1Schema = mongoose.Schema({
  images: [
    {
      type: String,
      require: true,
    }
  ],
  dateCreated: {
    type: Date,
    default: Date.now,
  },
},{  
      timestamps : true
});


const HomeSliderSmall1Model = mongoose.model('HomeSliderSmall1',homeSliderSmall1Schema);

export default HomeSliderSmall1Model;