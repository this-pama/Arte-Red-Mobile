import React, { Component } from 'react'
import Edit from "../screen/updateProfile"

export default class EditProfileController extends Component{
    constructor(props){
        super(props);
        this.state={
            firstName: "",
            lastName: "",
            nickName: "",
            bio: "",
            address: "",
            country: "",
            telephone: "",
            userType: "",
            errMessage: "",
            disable: true
        }
    }

    update= async () => {

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


      handleNickName = nickName => {
        if (nickName.length > 0) {
          this.setState(
            {
              nickName
            },
            this.validateForm
          );
        } else {
          this.setState({
            nickName: '',
            errMessage: 'Nick Name cannot be empty'
          });
        }
      };

      handleBio = bio => {
        if (bio.length > 0) {
          this.setState(
            {
              bio
            },
            this.validateForm
          );
        } else {
          this.setState({
            bio: '',
            errMessage: 'Bio cannot be empty'
          });
        }
      };

      handleAddress = address => {
        if (address.length > 0) {
          this.setState(
            {
              address
            },
            this.validateForm
          );
        } else {
          this.setState({
            address: '',
            errMessage: 'Address cannot be empty'
          });
        }
      };

      handleCountry = country => {
        if (country.length > 0) {
          this.setState(
            {
              country
            },
            this.validateForm
          );
        } else {
          this.setState({
            country: '',
            errMessage: 'Country cannot be empty'
          });
        }
      };

      handleTelephone = telephone => {
        if (telephone.length > 0) {
          this.setState(
            {
              telephone
            },
            this.validateForm
          );
        } else {
          this.setState({
            telephone: '',
            errMessage: 'Telephone cannot be empty'
          });
        }
      };

      handleUserType = userType => {
            if (userType){
                this.setState({
                    userType,
                    errMessage: ""
                })
            }else{
            this.setState({
                errMessage : "User type must be selected"
            })
            }
      
        }

    //   handleUserType = userType => {
    //     if (userType.length > 0) {
    //       this.setState(
    //         {
    //           userType
    //         },
    //         this.validateForm
    //       );
    //     } else {
    //       this.setState({
    //         userType: '',
    //         errMessage: 'User Type cannot be empty'
    //       });
    //     }
    //   };

      validateForm = () => {
        if (
          this.state.firstName.length > 0 && 
          this.state.lastName.length > 0 &&
          this.state.nickName.length > 0 &&
          this.state.bio.length > 0 &&
          this.state.email.length > 0 &&
          this.state.address.length > 0 &&
          this.state.country.length > 0 &&
          this.state.telephone.length > 0 &&
          this.state.userType.length > 0 
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
            <Edit
                firstName = { this.state.firstName}
                lastName={ this.state.lastName}
                nickName= {this.state.nickName }
                bio= { this.state.bio }
                address= { this.state.address}
                country= { this.state.country}
                telephone= {this.state.telephone}
                userType= {this.state.userType}
                handleFirstName= { this.handleFirstName}
                handleLastName= {this.handleLastName}
                handleNickName= {this.handleNickName}
                handleBio= {this.handleBio}
                handleAddress= {this.handleAddress}
                handleCountry= {this.handleCountry}
                handleTelephone= {this.handleTelephone}
                handleUserType= { this.handleUserType }
                update ={ this.update }
                disable= { this.state.disable }
                navigation= {this.props.navigation}
            />
        )
    }
}