import MyListModel from "../models/myList.modal.js";

export const addToMyListController = async (request, response) => {
    try {
        const userId = request.userId;
        const { productId, productTitle, image, rating, price, oldPrice, brand, discount } = request.body;

        const item = await MyListModel.findOne({
            userId: userId,
            productId: productId
        });

        if (item) {
            return response.status(400).json({
                message: "Item already in my list",
                error: true,
                success: false
            });
        }

        const myList = new MyListModel({
            productId,
            productTitle,
            image,
            rating,
            price,
            oldPrice,
            brand,
            discount,
            userId
        });

        await myList.save();

        return response.status(200).json({
            message: "The product has been saved in my list",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const deleteToMyListController = async (request, response) => {
   try {

      const myListItem = await MyListModel.findById(request.params.id);

      if(!myListItem){
         return response.status(404).json({
            message: "The item with this id was not found",
            error: true,
            success: false
        });
      }

      const deletedItem = await MyListModel.findByIdAndDelete(request.params.id);

      if(!deletedItem){
        return response.status(404).json({
            message: "The item is not deleted",
            error: true,
            success: false
        });
      }

      return response.status(200).json({
            message: "The item is removed from My List",
            error: false,
            success: true
        });
    
   } catch (error) {
       return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
   }
}

export const getMyListController = async (request, response) => {
  try {

     const userId = request.userId

     const myListItems = await MyListModel.find({
        userId: userId
     })

     return response.status(200).json({
        error: false,
        success: true,
        data: myListItems
     })
    
  } catch (error) {
       return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
  }
}