import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async (URL, formData) => {
  try {

     const response = await fetch(apiUrl + URL,{
      method: 'POST',
      headers: {
         'Authorization' : `Bearer ${localStorage.getItem("accessToken")}`,
         'Content-Type' : 'application/json',
      },

      body: JSON.stringify(formData)
     });

     if(response.ok){
       const data = await response.json();
       return data;
     } else {
      const errorData = await response.json();
      return errorData;
     }


  } catch (error) {
     console.log('error:',error);
  }

}

export const fetchDataFromApi = async (url) => {
   try {
      
      const params={
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
         }
      }

      const { data } = await axios.get(apiUrl + url, params)
      return data;
   } catch (error) {
      console.log(error);
      return error;
   }
}

export const uploadImage = async (url, updatedData) => {

   const params={
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'multipart/form-data',
         }
      }
   var response;
   await axios.put(apiUrl + url,updatedData, params).then((res)=>{
      
      response=res;
   })
      return response;
}

export const editData = async (url, updatedData) => {

   const params={
         headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json',
         }
      }
   var response;
   await axios.put(apiUrl + url,updatedData, params).then((res)=>{
      
      response=res;
   })
      return response;
}

export const deleteData = async (url) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.delete(apiUrl + url, params);
    return data;
  } catch (error) {
    console.log("deleteData error:", error);
    return error;
  }
};

export const deleteCart = async (url, body = {}) => {
  try {
    const params = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      data: body, // 👈 needed because backend expects JSON body in DELETE request
    };

    const { data } = await axios.delete(apiUrl + url, params);
    return data;
  } catch (error) {
    console.log("deleteCart error:", error);
    return error;
  }
};

