import React, { Component } from 'react'
import Edit from "../screen/editProfile"
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { apiUrl, cloudinaryUrl } from '../screen/service/env'
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import {connect} from 'react-redux'


class EditProfileController extends Component{
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
            disable: true,
            spin: false,
            image: "https://res.cloudinary.com/artered/image/upload/v1565698257/person/person_jgh15w.png",
            imageBase64: "",
            imageUrl : ""
        }
    }

    componentDidMount() {
      if("profileImage" in this.props.profile){
        this.setState({ image: this.props.profile.profileImage})
      }
      this.getPermissionAsync();
    }
  
      getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to post!');
            }
        }
      }
  
      pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [6, 5],
          base64: true
        });
  
        if (!result.cancelled) {
          this.setState({ 
              image: result.uri,
              imageBase64: result.base64
           })
        }
      }

    uploadImage = () =>{
      this.setState({ spin : true })
      let base64Img = `data:image/jpg;base64,${this.state.imageBase64}`
        let data = {
          "file": base64Img,
          "upload_preset": "artered",
        }

        fetch(cloudinaryUrl, {
          body: JSON.stringify(data),
          headers: {
            'content-type': 'application/json'
          },
          method: 'POST',
        })
        .then(async r => {
            let data = await r.json()
            this.setState({ imageUrl : data.secure_url })
            this.updateDb()
        })
        .catch(err=>console.log(err))
    }

    updateDb= async () => {
      console.warn(url)
        var url = apiUrl + "user/add/" + this.props.userId;
        var result = await fetch(url, {
          method: 'PUT',
          headers: { 
            'content-type': 'application/json',
            "Authorization": `Bearer ${this.props.jwt}`
          },
          body: JSON.stringify({
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            nickName: this.state.nickName,
            description: this.state.bio,
            address: this.state.address,
            country: this.state.country,
            telephone: this.state.telephone,
            userType: this.state.userType,
            profileImage: this.state.imageUrl 
          })
        });
        var response = await result;
        
        if(response.status !== 200 ){
          console.warn(response)
          this.setState({
            firstName: "",
            lastName: "",
            nickName: "",
            description: "",
            address: "",
            country: "",
            telephone: "",
            userType: "",
            spin: false
          });
        }
        else{
          var res = await response.json();
          if (res._id) {
            console.warn(res)
            this.setState({
              firstName: "",
              lastName: "",
              nickName: "",
              bio: "",
              address: "",
              country: "",
              telephone: "",
              userType: "",
              spin: false
            });
            this.props.navigation.navigate("Home")
          } 
          else  {
            this.setState({
              firstName: "",
              lastName: "",
              nickName: "",
              bio: "",
              address: "",
              country: "",
              telephone: "",
              userType: "",
              profileImage: this.state.imageUrl, 
              spin: false
            });
            console.warn("Not updated")
          }
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


      validateForm = () => {
        if (
          this.state.firstName.length > 0 && 
          this.state.lastName.length > 0 &&
          this.state.address.length > 0 && 
          this.state.country.length > 0 &&
          this.state.telephone.length > 0
          
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
                update ={ this.uploadImage }
                disable= { this.state.disable }
                spin= { this.state.spin }
                navigation= {this.props.navigation}
                pickImage= { this.pickImage}
                image = { this.state.image }
            />
        )
    }
}


const mapStateToProps = state => ({
  jwt: state.login.jwt,
  accountId: state.login.accountId,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction, getUserProfileAction })(EditProfileController )