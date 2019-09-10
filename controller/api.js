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

// api call for liking an artwork
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


// api call for unLiking an artwork
export const unLike = async  user =>{
 
  var url = apiUrl + "artwork/unlike/" + user.userId + "/" + user.artworkId ;
  var result = await fetch(url, {
    method: 'POST',
    headers: { 
      'content-type': 'application/json',
      "Authorization": `Bearer ${user.jwt}`
     }
  });
  var response = await result;
  
  if(response.status !== 200 ){
    console.warn("fetching unLike response failure")
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
      console.warn("fetching unLike failed")
      return
    }
  }
}

//api call for following a user
export const follow = async  user =>{
 
  var url = apiUrl + "user/follow/" + user.IdOfPersonToFollow + "/" + user.userId;
  var result = await fetch(url, {
    method: 'POST',
    headers: { 
      'content-type': 'application/json',
      "Authorization": `Bearer ${user.jwt}`
     }
  });
  var response = await result;
  
  if(response.status !== 200 ){
    console.warn("failed response")
    return
  }
  else{
    var res = await response.json();
    // console.warn(res)
    if (res.message === "Following successful" ) {
      // console.warn(res)
      return res
    }

    else  {
      console.warn("following failed")
      return
    }
  }
}


// api call for unLiking an artwork
export const rating = async  user =>{
  var url = apiUrl + "user/rating/" + user.userId ;
  var result = await fetch(url, {
    method: 'POST',
    headers: { 
      'content-type': 'application/json',
      "Authorization": `Bearer ${user.jwt}`
     },
     body: JSON.stringify({
      rating: user.rating,
    })
  });
  var response = await result;
  
  if(response.status !== 200 ){
    console.warn("rating response failure")
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
      console.warn("rating failed")
      return
    }
  }
}