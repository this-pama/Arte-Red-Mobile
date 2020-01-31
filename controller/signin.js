import React, { Component } from 'react'
import SignIn from "../screen/login"
import { apiUrl } from '../screen/service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import {connect} from 'react-redux'

 class SignInController extends Component{
    constructor(props){
        super(props);
        this.state={
            email: "",
            password: "",
            errMessage: "",
            spin: false,
            accountId: "",
            userId: "",
            jwt: "",
            disable: true,
            message: '',
            modalVisible: false,
        }
    }

    // fetch user id before navigating to the home screen
    async fetchUserId(){
      // alert(this.state.accountId)
      var url = apiUrl + "account/" + this.state.accountId;
          var result = await fetch(url, {
            method: 'GET',
            headers: { 
              'content-type': 'application/json',
              "Authorization": `Bearer ${this.state.jwt}`
             }
          });
          var response = await result;
          
          if(response.status !== 200 ){
            this.setState({ 
              email: '',
              password: "",
              spin: false,
              message: "Login failed",
              modalVisible: true,
             })
            // alert("Login failed")
          }
          else{
            var res = await response.json();
            if (res.user) {
              // set state in redux store
              this.props.getUserIdAction({ userId: res.user})

              // update component state
              this.setState({
                email: '',
                password: "",
                userId: res.user,
                spin: false
              });
              //navigate to home screen 
              this.props.navigation.navigate("Home")
            } 
            else  {
              this.setState({
                email: '',
                password: "",
                spin: false,
                message: "Login failed",
                modalVisible: true,
              });
            }
          }
    }

    //authenticate user and set state for jwt and accoundId
    login = async () => {
      this.setState({ spin : true })
        var url = apiUrl + "account/login";
        var result = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password
          })
        });
        var response = await result;
        
        if(response.status != 200 ){
          this.setState({
            email: '',
            password: "",
            spin: false,
            errMessage: "",
            message: "Login failed!",
            modalVisible: true,
          });
        }
        else{
          var res = await response.json();
          if (res.token) {
            this.setState({
              email: '',
              password: "",
              accountId: res.id,
              jwt: res.token
            });
            
            this.props.loginAction({
              jwt: res.token,
              accountId: res.id
            })
            this.fetchUserId()
          } 
          else  {
            this.setState({
              email: '',
              password: "",
              spin: false,
              errMessage: "",
              message: "Incorrect Email & Password",
              modalVisible: true,
            });
          }
        }
        
    };
    
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

      closeModal = () => this.setState({ modalVisible: false })


    render(){
        return(
            <SignIn 
                email = {this.state.email}
                password= {this.state.password}
                handleEmail = { this.handleEmail}
                handlePassword= { this.handlePassword }
                login= { this.login }
                disable= { this.state.disable }
                spin = { this.state.spin }
                navigation= {this.props.navigation}
                errMessage= { this.state.errMessage }
                message= { this.state.message }
                modalVisible= { this.state.modalVisible }
                closeModal= { this.closeModal }
            />
        )
    }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  accountId: state.login.accountId,
  userId: state.getUserId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction })(SignInController)