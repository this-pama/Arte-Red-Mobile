import {apiUrl} from "../screen/service/env"

export const getUserProfile = async  user =>{
 
      var url = apiUrl + "user/" + user.userId;
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${user.jwt}`
         }
      });
      var response = await result;
      
      if(response.status !== 200 ){
        console.warn("fetching user failed response")
        return
      }
      else{
        var res = await response.json();
        if (res._id) {
          // console.warn(res)
          return res
        }

        else  {
          console.warn("fetching user profile failed")
          return
        }
      }
}

export const like = async  user =>{
 
  var url = apiUrl + "artwork/like/" + user.userId + "/" + user.artworkId ;
  var result = await fetch(url, {
    method: 'POST',
    headers: { 
      'content-type': 'application/json',
      "Authorization": `Bearer ${user.jwt}`
     }
  });
  var response = await result;
  
  if(response.status !== 200 ){
    console.warn("fetching like response failure")
    return
  }
  else{
    var res = await response.json();
    console.warn(res)
    if (res._id) {
      // console.warn(res)
      return res
    }

    else  {
      console.warn("fetching like failed")
      return
    }
  }
}