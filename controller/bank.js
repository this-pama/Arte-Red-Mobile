import React, { Component } from 'react'
import BankView from "../screen/bank"
import { apiUrl } from '../screen/service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { addBankAction } from "../redux/addBankAction"
import {connect} from 'react-redux'

 class BankController extends Component{
    constructor(props){
        super(props);
        this.state={
            email: "",
            firstName: "",
            lastName: "",
            accountNumber: "",
            bankName: "",
            errMessage: "",
            spin: false,
            disable: true
        }
    }


    addBank = async () => {
      this.setState({ spin : true })
        var url = apiUrl + "wallet/bank/" + this.props.userId;
        var result = await fetch(url, {
          method: 'PUT',
          headers: { 
            'content-type': 'application/json',
            "Authorization": `Bearer ${this.props.jwt}`
           },
          body: JSON.stringify({
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            accountNumber: this.state.accountNumber,
            bankName: this.state.bankName
          })
        });
        var response = await result;
        
        if(response.status !== 200 ){
          this.setState({
            email: '',
            firstName: "",
            lastName: "",
            accountNumber: "",
            bankName: "",
            spin: false
          });
        }
        else{
          var res = await response.json();
          if (res._id) {
            this.setState({
              email: '',
              firstName: "",
              lastName: "",
              accountNumber: "",
              bankName: "",
              spin: false
            });
            
            this.props.addBankAction(res)
          } 
          else  {
            this.setState({
              email: '',
              firstName: "",
              lastName: "",
              accountNumber: "",
              bankName: "",
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
            errMessage: 'Email cannot be empty'
          });
        }
      };

      handleFirstName = firstName => {
        if (firstName.length > 0) {
          this.setState(
            {
              firstName
            },
            this.validateForm
          );
        } else {
          this.setState({
            firstName: '',
            errMessage: 'First Name cannot be empty'
          });
        }
      };

      handleLastName = lastName => {
        if (lastName.length > 0) {
          this.setState(
            {
              lastName
            },
            this.validateForm
          );
        } else {
          this.setState({
            lastName: '',
            errMessage: 'Last Name cannot be empty'
          });
        }
      };

      handleAccountNumber = accountNumber => {
        if (accountNumber.length > 0) {
          this.setState(
            {
                accountNumber
            },
            this.validateForm
          );
        } else {
          this.setState({
            accountNumber: '',
            errMessage: 'Account Number cannot be empty'
          });
        }
      };

      handleBankName = bankName => {
        if (bankName) {
          this.setState(
            {
                bankName
            },
            this.validateForm
          );
        } else {
          this.setState({
            bankName: '',
            errMessage: 'Select Bank Name'
          });
        }
      };

      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.email.length > 0 &&
          this.state.firstName.length > 0 &&
          this.state.lastName.length > 0 &&
          this.state.accountNumber.length > 0 &&
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
            <BankView
                email = {this.state.email}
                firstName= {this.state.firstName}
                lastName= {this.state.lastName}
                accountNumber = { this.state.accountNumber}
                bankName= {this.state.bankName}
                handleEmail = { this.handleEmail}
                handleFirstName= { this.handleFirstName }
                handleLastName= { this.handleLastName }
                handleBankName= { this.handleBankName}
                handleAccountNumber={ this.handleAccountNumber}
                addBank= { this.addBank }
                disable= { this.state.disable }
                spin = { this.state.spin }
                navigation= {this.props.navigation}
            />
        )
    }
}

const mapStateToProps = state => ({
  jwt: state.login.jwt,
  accountId: state.login.accountId,
  userId: state.getUserId.userId
})

export default connect(mapStateToProps, {loginAction, getUserIdAction })(BankController)