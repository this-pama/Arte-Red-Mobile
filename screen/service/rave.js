import React from 'react';
import Rave from 'react-native-rave';
import { StyleSheet, Text, View } from 'react-native';

export default class RaveScreen extends React.Component {

  constructor(props) {
    super(props);
    
  }

  fetchResponse = (transRef) => {

    var url = "http://192.168.88.48/api"; 
    var request = { 
        method : "POST",
        body: JSON.stringify({
            "txref": transRef
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }
    fetch(url, request) 
    .then(res => console.log('Success:', JSON.stringify(res.json())))
    .catch(error => console.log('Error:', JSON.stringify(error)));
}

  onSuccess = (data) => {
    console.log("success", data);
    if ((typeof data.data) == "object") {
      if((typeof data.data.txRef) != "undefined"){
        this.fetchResponse(data.data.txRef);
      }else{
        this.fetchResponse(data.data.tx.txRef);
      }
    }else{
      this.fetchResponse(data.txRef);
    }
  }

  onFailure = (data) => {
    console.log("error", data);
    alert("Payment failed")
  }

  onClose= (data)=>{
      this.props.navigation.goBack()
  }

  render() {
    return ( 
      <Rave amount = {this.props.navigation.getParam("amount", "1")}
        country = "NG"
        currency = "NGN"
        email = {this.props.navigation.getParam("email", "")}
        firstname = {this.props.navigation.getParam("firstName", "")}
        lastname = { this.props.navigation.getParam("lastName", "") }
        publickey = "FLWPUBK-*********************************-X"
        encryptionkey = "**********************"
        paymenttype = "card"
        meta = {
          [{
            metaname: "color",
            metavalue: "red"
          }, {
            metaname: "artered",
            metavalue: "artwork"
          }]
        }
        production = {
          false 
        }
        onSuccess = {
          res => this.onSuccess(res)
        }
        onFailure = {
          e => this.onFailure(e)
        }
        onClose={e => this.onClose(e)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});