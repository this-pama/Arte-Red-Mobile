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
            disable: true
        }
    }

    signUp = async () => {
      this.setState({ spin : true })
        var url = apiUrl + "account/register";
        var result = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
          })
        });
        var response = await result;
        
        if(response.status !== 200 ){
          this.setState({
            email: '',
            password: "",
            spin: false
          });
        }
        else{
          var res = await response.json();
          if (res.message) {
            this.setState({
              email: '',
              password: "",
              spin: false
            });
            this.props.navigation.navigate("Login")
          } 
          else  {
            this.setState({
              email: '',
              password: "",
              spin: false
            });
          }
        }
        
    };
    
    handleEmail = email => {
        if (email.length > 0) {
          this.setState(
            {
              email
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
                navigation= {this.props.navigation}
                errMessage= {this.state.errMessage}
            />
        )
    }
}