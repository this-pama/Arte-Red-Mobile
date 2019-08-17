import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, ActionSheet, Toast } from 'native-base';
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"

class FooterTabs extends Component {

  constructor(props){
    super(props);
    this.state={
      image: ''
    }
  }


  render() {
    return (
      
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={this.props.history}
            active= { this.props.activeHistory } >
              <Icon name="stats" />
              <Text>History</Text>
            </Button>
            <Button vertical
              active= { !this.props.activePost ? false : true }
             onPress= {()=>{
               if(process.env.NODE_ENV === 'development'){
                this.props.navigation.navigate("Bank")
               }
              else if(this.props.userId && this.props.userId.length > 0){
                this.props.navigation.navigate("Bank")
              }
              else{
                Toast.show({
                  text: "You need to sign in",
                  buttonText: "Okay",
                  duration: 3000,
                  type: 'danger'
                })
              }
            }}>
              <Icon name="add" />
              <Text>Add Bank</Text>
            </Button>
            <Button vertical
              onPress= {()=>{
                if(process.env.NODE_ENV === 'development'){
                  this.props.navigation.navigate("Withdraw")
                }
               else if(this.props.userId && this.props.userId.length > 0){
                this.props.navigation.navigate("Withdraw")
               }
               else{
                 Toast.show({
                   text: "You need to sign in",
                   buttonText: "Okay",
                   duration: 3000,
                   type: 'danger'
                 })
               }
             }} >
              <Icon active name="open" />
              <Text>Withdraw</Text>
            </Button>
            <Button vertical
              active= { this.props.activeDetails }
                 onPress={this.props.myDetail} >
              <Icon active name="eye" />
              <Text>My Details</Text>
            </Button>
            
          </FooterTab>
        </Footer>
      
    );
  }
}

FooterTabs.propTypes={
  navigation: PropTypes.object.isRequired,
  myDetail: PropTypes.func.isRequired,
  history: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  userId: state.getUserId.userId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction})(FooterTabs)