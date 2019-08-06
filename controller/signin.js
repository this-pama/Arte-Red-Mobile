import React, { Component } from 'react'
import SignIn from "../screen/login"

export default class SignInController extends Component{
    constructor(props){
        super(props);
        this.state={
            email: "",
            password: "",
            errMessage: "",
            disable: true
        }
    }

    login = async () => {

        var url = '';
        var result = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
          })
        });
        var response = await result;
        var res = await response.json();
        console.log(res);
        if (res.serial) {
          console.log('successfully registered');
          this.setState({
            email: '',
            password: ""
          });
        } else {
          this.setState({
            errMessage: 'Error Occurred.',
          });
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
            errMessage: 'Email cannot be empty'
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
            errMessage: 'password cannot be empty'
          });
        }
      };

      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.email.length > 0 &&
          this.state.password.length > 0 &&
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
            <SignIn 
                email = {this.state.email}
                password= {this.state.password}
                handleEmail = { this.handleEmail}
                handlePassword= { this.handlePassword }
                login= { this.login }
                disable= { this.state.disable }
                navigation= {this.props.navigation}
            />
        )
    }
}