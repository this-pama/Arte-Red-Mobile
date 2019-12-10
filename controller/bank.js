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
            branchList: [],
            country : '',
            showCountry: true,
            showBankList: false,
            showDetails: false,
            ready: false,
            otherCountries: false,
            showOt: false,
            showUs: false,
            showEur: false,
            swiftCode: '',
            beneficiaryAddress: '',
            routingNumber: '',
            beneficiaryCountry: '',
            postalCode: '',
            streetName: '',
            streetNumber: '',
            city: '',
            showUsSummary: false,
            showEurSummary: false,
            isGhana: false,
            ghanaBranchCode: '',
            branch: '',
            message: '',
            modalVisible: false,

        }
    }

    componentDidMount(){
      this.getBankList()
    }

    addBank = async () => {
      this.setState({ spin : true })

      let data
      if(this.state.showEurSummary){
        data = {
          bankName: this.state.bankName,
          fullName: `${this.state.firstName} ${this.state.lastName}`,
          accountNumber: this.state.accountNumber,
          email: this.state.email,
          country: this.state.country,
          userId: this.props.userId,
          routingNumber: this.state.routingNumber,
          swiftCode : this.state.swiftCode,
          beneficiaryAddress: this.state.beneficiaryAddress,
          beneficiaryCountryCode: this.state.beneficiaryCountry, // The country code using country standard ISO code
          postalCode: this.state.postalCode,
          streetNumber: this.state.streetNumber,
          streetName: this.state.streetName,
          city: this.state.city
             
        }
      }
      else if ( this.state.showUsSummary){
        data = {
          bankName: this.state.bankName,
          fullName: `${this.state.firstName} ${this.state.lastName}`,
          accountNumber: this.state.accountNumber,
          email: this.state.email,
          country: this.state.country,
          userId: this.props.userId,
          routingNumber: this.state.routingNumber,
          swiftCode : this.state.swiftCode,
          beneficiaryAddress: this.state.beneficiaryAddress,
        }
      }
      else {
        let country
        switch (this.state.country) {
            case 'Kenya':
            country = 'KE';
              break;
            case 'Ghana':
              country = 'GH';
              break;
            case 'Cote d Ivoire':
              country = 'CI';
              break;
            case 'Ugandan':
              country = 'UG';
              break;
            case 'Tanzania':
              country = 'TZ';
              break;
            case 'Nigeria':
              country = 'NG';
              break;
            case 'South Africa':
              country = 'ZA';
              break;
            default:
              country = 'NG';
              break;
        }
        data = {
          bankName: this.state.bankName,
          fullName: `${this.state.firstName} ${this.state.lastName}`,
          code: this.state.bankCode,
          accountNumber: this.state.accountNumber,
          email: this.state.email,
          country: country,
          userId: this.props.userId,
          branchCode: this.state.ghanaBranchCode,
        }
      }
      
        var url = apiUrl + "bank/save/account";
        var result = await fetch(url, {
          method: 'POST',
          headers: { 
            'content-type': 'application/json',
            // "Authorization": `Bearer ${this.props.jwt}`
           },
          body: JSON.stringify(data)
        });
        var response = await result;
        var res = await response.json();
        if(!res.success ){
          this.setState({
            spin: false,
            message: 'Error occured',
            modalVisible: true
          });
        }
        else{
            this.setState({
              spin: false,
              message: 'Successfully saved',
              modalVisible: true
            });
            // this.props.addBankAction(res)
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
      if(country == "Other Countries"){
        this.setState({
          otherCountries: true,
          ready: false,
          showBankList: false,
          showCountry: false,
          showBankList: false,
          showDetails: false,
          errMessage: ''
        })
      }
      else if (country.length > 0 && country != "Select Country") {
        //check if Ghana is selected
        if(country == 'Ghana'){
          this.setState(
            {
              country,
              showCountry: false,
              showBankList: true,
              isGhana: true,
              errMessage: ''
            },
            this.validateForm
          );
          
          let bank = this.state.bankList[country].map(ele=> ele.Name)
          this.setState({ bank })
        }
        else{
          this.setState(
            {
              country,
              showCountry: false,
              showBankList: true,
              errMessage: ''
            },
            this.validateForm
          );
          
          let bank = this.state.bankList[country].map(ele=> ele.Name)
          this.setState({ bank })
        }
        

      } else {
        this.setState({
          country: '',
          errMessage: 'Select a Country'
        });
      }
    };

    ot = ()=>{
      this.setState({
        otherCountries: false,
        ready: false,
        showBankList: false,
        showCountry: false,
        showBankList: false,
        showDetails: false,
        showOt : true,
        showUs: false,
        showEur: false,
        country: 'OT',
        errMessage: ''
      })
    }

    eur = ()=>{
      this.setState({
        otherCountries: false,
        ready: false,
        showBankList: false,
        showCountry: false,
        showBankList: false,
        showDetails: false,
        showOt : false,
        showUs: false,
        showEur: true,
        country: 'EUR',
        errMessage: ''
      })
    }

    us = ()=>{
      this.setState({
        otherCountries: false,
        ready: false,
        showBankList: false,
        showCountry: false,
        showBankList: false,
        showDetails: false,
        showOt : false,
        showUs: true,
        showEur: false,
        country: 'US',
        errMessage: ''
      })
    }

    getGhanaBranch= async bankId =>{
      // console.warn('bankId', bankId)
      var url = apiUrl + "bank/branch/" + bankId;
        var result = await fetch(url, {
          method: 'GET',
          headers: { 
            'content-type': 'application/json',
            // "Authorization": `Bearer ${this.props.jwt}`
           }
        });
        var response = await result.json();
        console.warn("response", response)
        if(response.success ){
          // console.warn(response.message)
          this.setState({ branchList : response.message})

          //set ghanaBranchCode as bankCode if no branch list
          if(response.message.length <=0 ){
            this.setState({ ghanaBranchCode: this.state.bankCode })
            console.warn(this.state.ghanaBranchCode)
          }
        }
        else{
          console.warn('no branch lst')
          this.setState({ branchList : []})
        }
    }

    selectBank = bankName => {
      if (bankName.length > 0 && bankName != "Select A Bank") {
        this.setState(
          {
            bankName,
            showCountry: false,
            showBankList: false,
            showDetails: true,
            errMessage: ''
          },
          this.validateForm
        );
        
        let bankEle = this.state.bankList[this.state.country].find(ele =>{ return ele.Name == bankName })
        let bankCode = bankEle.Code
        // console.warn('bank code', bankCode)
        // console.warn('country', this.state.country)
        this.setState({ bankCode })

        if(this.state.isGhana){
          this.getGhanaBranch(bankEle.Id)
        }

      } else {
        this.setState({
          bankName: '',
          errMessage: 'Select a Bank'
        });
      }
    };

    selectBranch = branch => {
      if (branch.length > 0 && branch != "Select Branch") {
        this.setState(
          {
            branch,
            showCountry: false,
            showBankList: false,
            showDetails: true,
            errMessage: ''
          },
          this.validateForm
        );

        let branchEle = this.state.branchList.find(ele =>{ return ele.BranchName == branch })
        let ghanaBranchCode

        //set ghanaBranchCode as bankCode if no branch list
        if(branchEle.length <=0 ){
          ghanaBranchCode= this.state.bankCode
        }
        else{
          ghanaBranchCode = branchEle.BranchCode
        }

        console.warn('branch', branch)
        console.warn('branch code ', ghanaBranchCode )
        this.setState({ ghanaBranchCode })


      } else {
        this.setState({
          branch: '',
          errMessage: 'Select a branch'
        });
      }
    };

    next=()=>{
      // check if summary screen to show depending on either it is OT/US/EUR/ default
      if(this.state.showUs || this.state.showOt){
        this.setState({
          ready: true,
          showBankList: false,
          showCountry: false,
          showBankList: false,
          showDetails: false,
          showOt : false,
          showUs: false,
          showEur: false,
          showUsSummary: true,
          showEurSummary: false,
          isGhana: false,
          errMessage: ''
        }, this.validateForm )

      }
      else if (this.state.showEur){

        this.setState({
          ready: true,
          showBankList: false,
          showCountry: false,
          showBankList: false,
          showDetails: false,
          showOt : false,
          showUs: false,
          showEur: false,
          showUsSummary: false,
          showEurSummary: true,
          isGhana: false,
          errMessage: ''
        }, this.validateForm )

      }
      else {
        this.setState({
          ready: true,
          showBankList: false,
          showCountry: false,
          showBankList: false,
          showDetails: false,
          showOt : false,
          showUs: false,
          showEur: false,
          showUsSummary: false,
          showEurSummary: false,
          isGhana: false,
          errMessage: ''
        }, this.validateForm )
      }
    }

    handleEmail = email => {
        if (email.length > 0) {
          this.setState(
            {
              email,
              errMessage: ''
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
              firstName,
              errMessage: ''
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
              lastName,
              errMessage: ''
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
                accountNumber,
                errMessage: ''
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
                bankName,
                errMessage: ''
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

      handleBeneficiaryAddress = beneficiaryAddress => {
        if (beneficiaryAddress.length > 0) {
          this.setState(
            {
                beneficiaryAddress,
                errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            beneficiaryAddress: '',
            errMessage: 'Address cannot be empty'
          });
        }
      };

      handleSwiftCode = swiftCode => {
        if (swiftCode.length > 0) {
          this.setState(
            {
                swiftCode,
                errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            swiftCode: '',
            errMessage: 'Swift Code cannot be empty'
          });
        }
      };

      handleRoutingNumber = routingNumber => {
        if (routingNumber.length > 0) {
          this.setState(
            {
              routingNumber,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            routingNumber: '',
            errMessage: 'Routing Number cannot be empty'
          });
        }
      };

      handleBeneficiaryCountry = beneficiaryCountry => {
        if (beneficiaryCountry.length > 0 & beneficiaryCountry.length < 3) {
          this.setState(
            {
              beneficiaryCountry,
              errMessage: ''
            }
            
          );
        } else {
          this.setState({
            beneficiaryCountry: '',
            errMessage: 'Country cannot be empty or more than 2 letters'
          });
        }
      };

      handlePostalCode = postalCode => {
        if (postalCode.length > 0) {
          this.setState(
            {
              postalCode,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            postalCode: '',
            errMessage: 'Postal Code cannot be empty'
          });
        }
      };

      handleStreetName = streetName => {
        if (streetName.length > 0) {
          this.setState(
            {
              streetName,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            streetName: '',
            errMessage: 'Street Name cannot be empty'
          });
        }
      };

      handleStreetNumber = streetNumber => {
        if (streetNumber.length > 0) {
          this.setState(
            {
              streetNumber,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            streetNumber: '',
            errMessage: 'Street Number cannot be empty'
          });
        }
      };

      handleInternationalBankName = bankName => {
        if (bankName.length > 0) {
          this.setState(
            {
              bankName,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            bankName: '',
            errMessage: 'Bank Name cannot be empty'
          });
        }
      };

      handleCity = city => {
        if (city.length > 0) {
          this.setState(
            {
              city,
              errMessage: ''
            },
            this.validateForm
          );
        } else {
          this.setState({
            city: '',
            errMessage: 'Bank Name cannot be empty'
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
          // this.state.country.length > 0 &&
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
                otherCountries ={ this.state.otherCountries }
                ot= { this.ot }
                us={ this.us }
                eur={ this.eur}
                showOt = { this.state.showOt}
                showUs= { this.state.showUs}
                showEur = { this.state.showEur }
                handleRoutingNumber = {this.handleRoutingNumber}
                handleSwiftCode = { this.handleSwiftCode}
                handleBeneficiaryAddress ={ this.handleBeneficiaryAddress }
                swiftCode = { this.state.swiftCode }
                routingNumber = { this.state.routingNumber }
                beneficiaryAddress= { this.state.beneficiaryAddress }
                handleBeneficiaryCountry = { this.handleBeneficiaryCountry}
                handlePostalCode= { this.handlePostalCode }
                handleStreetName= { this.handleStreetName }
                handleStreetNumber = { this.handleStreetNumber }
                handleInternationalBankName = { this.handleInternationalBankName }
                handleCity = { this.handleCity }
                internationalBankName= { this.state.bankName }
                beneficiaryCountry= { this.state.beneficiaryCountry }
                postalCode= { this.state.postalCode }
                streetName= { this.state.streetName }
                streetNumber = { this.state.streetNumber }
                city = { this.state.city }
                showUsSummary = { this.state.showUsSummary }
                showEurSummary = { this.state.showEurSummary}
                isGhana= { this.state.isGhana }
                branch= { this.state.branch }
                branchList = { this.state.branchList }
                selectBranch= { this.selectBranch }
                errMessage= { this.state.errMessage}
                message= { this.state.message }
                modalVisible = { this.selectBank.modalVisible }
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