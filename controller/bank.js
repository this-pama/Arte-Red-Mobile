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
            bankCode: "",
            errMessage: "",
            spin: false,
            disable: true,
            bankList: {},
            bank: [],
            country : '',
            showCountry: true,
            showBankList: false,
            showDetails: false,
            ready: false,

        }
    }

    componentDidMount(){
      this.getBankList()
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
    
    getBankList = async () =>{
      var url = apiUrl + "bank/banklist";
        var result = await fetch(url, {
          method: 'GET',
          headers: { 
            'content-type': 'application/json',
            // "Authorization": `Bearer ${this.props.jwt}`
           }
        });
        var response = await result.json();
        // console.warn("response", response)
        if(response.success ){
          // console.warn(response.message)
          this.setState({ bankList : response.message})
        }
        else{
          console.warn('no bank lst')
          this.setState({ bankList : {}})
        }
    }

    selectCountry = country => {
      if (country.length > 0 && country != "Select Country") {
        this.setState(
          {
            country,
            showCountry: false,
            showBankList: true
          },
          this.validateForm
        );
        
        let bank = this.state.bankList[country].map(ele=> ele.Name)
        this.setState({ bank })

      } else {
        this.setState({
          country: '',
          errMessage: 'Country cannot be empty'
        });
      }
    };

    selectBank = bankName => {
      if (bankName.length > 0 && bankName != "Select A Bank") {
        this.setState(
          {
            bankName,
            showCountry: false,
            showBankList: false,
            showDetails: true
          },
          this.validateForm
        );
        
        let bankEle = this.state.bankList[this.state.country].find(ele =>{ return ele.Name == bankName })
        let bankCode = bankEle.Code
        console.warn('bank code', bankCode)
        console.warn('country', this.state.country)
        this.setState({ bankCode })

      } else {
        this.setState({
          bankName: '',
          errMessage: 'Bank Name cannot be empty'
        });
      }
    };

    next=()=>{
      this.setState({
        ready: true,
        showBankList: false,
        showCountry: false,
        showBankList: false,
        showDetails: false,
      }, this.validateForm )
    }

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
          this.state.country.length > 0 &&
          this.state.bankName.length > 0 && 
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
                bankList = {this.state.bankList}
                showDetails = { this.state.showDetails}
                showBankList = { this.state.showBankList}
                showCountry = { this.state.showCountry }
                bank = { this.state.bank }
                selectCountry= {this.selectCountry}
                selectBank = { this.selectBank }
                ready= { this.state.ready }
                next= { this.next }
                country = { this.state.country }
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