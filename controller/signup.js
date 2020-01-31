import React, { Component } from 'react'
import SignUp from "../screen/signup"
import { apiUrl } from '../screen/service/env'

export default class SignUpController extends Component{
    constructor(props){
        super(props);
        this.state={
            email: "",
            password: "",
            errMessage: "",
            phone: "",
            confirm: "",
            spin: false,
            disable: true,
            message:'',
            modalVisible: false,
        }
    }

    signUp = async () => {
      let data = {
        email: this.state.email,
        password: this.state.password
      };
      console.warn(data)
      
      this.setState({ spin : true })
        var url = apiUrl + "account/register";
        var result = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(data)
        });
        var response = await result;
        console.warn(response)
        if(response.status != 200 ){
          this.setState({
            email: '',
            password: "",
            phone: '',
            confirm: "",
            message: "Registration failed!",
            modalVisible: true,
            spin: false
          });
        }
        else{
          var res = await response.json();
          if (res.message) {
            this.setState({
              email: '',
              password: "",
              phone: '',
              confirm: "",
              spin: false
            });
            this.props.navigation.navigate("Login")
          } 
          else  {
            this.setState({
              email: '',
              password: "",
              phone: '',
              confirm: "",
              message: "Registration failed!. Email seems to be used by another user",
              modalVisible: true,
              spin: false
            });
          }
        }
        
    };

    closeModal = () => this.setState({ modalVisible: false })
    
    handleEmail = email => {
        if (email.length > 0) {
          this.setState(
            {
              email : email.trim()
            },
            this.validateForm
          );
        } else {
          this.setState({
            email: '',
            errMessage: 'Email must be valid'
          });
        }
      };

      handlePassword = pass => {
        if (pass.length > 0) {
          this.setState(
            {
              password: pass
            },
            this.validateForm
          );
        } else {
          this.setState({
            password: '',
            errMessage: 'Password cannot be empty'
          });
        }
      };

      handlePhone = phone => {
        if (phone.length > 0) {
          this.setState(
            {
              phone
            },
            this.validateForm
          );
        } else {
          this.setState({
            phone: '',
            errMessage: 'Phone Number cannot be empty'
          });
        }
      };

      handleConfirm = confirm => {
        if (confirm.length > 0) {
          this.setState(
            {
              confirm
            },
            this.validateForm
          );
        } else {
          this.setState({
            confirm: '',
            errMessage: 'Confirm Password'
          });
        }
      };

      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.email.length > 0 &&
          this.state.password.length > 0 &&
          this.state.phone.length > 0 &&
          this.state.confirm.length > 0 &&
          this.state.password === this.state.confirm &&
          testEmail.test(this.state.email) 
        ) {
          this.setState({
            disable: false,
            errMessage: ''
          });
        } else {
          this.setState({
            disable: true
          });
        }
      };


    render(){
        return(
            <SignUp
                email = {this.state.email}
                password= {this.state.password}
                handleEmail = { this.handleEmail}
                handlePassword= { this.handlePassword }
                handleConfirm={this.handleConfirm}
                handlePhone={this.handlePhone}
                phone= {this.state.phone}
                confirm={this.state.confirm}
                signUp= { this.signUp }
                disable= { this.state.disable }
                spin = { this.state.spin }
                modalVisible = { this.state.modalVisible }
                message= { this.state.message }
                navigation= {this.props.navigation}
                errMessage= {this.state.errMessage}
                closeModal= { this.closeModal }
            />
        )
    }
}