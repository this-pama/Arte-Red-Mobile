import {apiUrl} from "../screen/service/env"
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const PUSH_ENDPOINT = apiUrl + '/user/push-token';

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



export const registerForPushNotificationsAsync = async user => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  console.warn("token", token)
  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: {
        value: token,
      },
      user: {
        username: user,
      },
    }),
  });
}