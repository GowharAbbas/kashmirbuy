import mongoose from 'mongoose';

const homeSliderSmall2Schema = mongoose.Schema({
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


const HomeSliderSmall2Model = mongoose.model('HomeSliderSmall2',homeSliderSmall2Schema);

export default HomeSliderSmall2Model;