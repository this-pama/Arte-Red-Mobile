import React from 'react';
import Rave from 'react-native-rave';
import { StyleSheet, Text, View } from 'react-native';
import { ravePublicKey, raveEncryption, apiUrl } from "./env"
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { raveAction } from "../../redux/raveAction"
import PaymentScreen from '../pay'

class RaveScreen extends React.Component {
  constructor(props) {
    super(props);
    
  }

  componentDidMount(){
    console.warn(this.props.rave)
  }
  fetchResponse = (transRef) => {

    var url = apiUrl + "sold/verify"; 
    var request = { 
        method : "POST",
        body: JSON.stringify({
            "txref": transRef
        }),
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${this.props.jwt}`
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
      <PaymentScreen cost= { this.props.rave} />
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

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId,
  rave: state.rave
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, 
 raveAction })(RaveScreen)