import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right,
  Card, CardItem, Toast, Text, Button, Icon, Title, Segment, Spinner,
  Picker, Item, Thumbnail, Footer, FooterTab, Form, Label, Input  } from 'native-base';
import { Image } from 'react-native'
import { ScrollView, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl, cloudinaryUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler, View, } from "react-native"
import { country, state } from './service/countries'
import Modal, { ModalContent, ModalFooter, ModalButton, SlideAnimation, ModalTitle, } from 'react-native-modals';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';
import { Permissions } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as DocumentPicker from 'expo-document-picker';

class JoinCommunityScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      country: '',
      state: '',
      countryList: [],
      stateList:[],
      showState: false,
      showSearchBtn: false,
      search: false,
      allPartner: [],
      fetch: false,
      refreshing: false,
      companyName: '',
      nickName: '',
      bio: '',
      email: '',
      telephone: '',
      address: '',
      city: '',
      facebook: '',
      website: '',
      instagram: '',
      industry: '',
      twitter: '',
      linkedln: '',
      url: '',
      profileImage: null,
      showOthers: false,
      show: false,
      initiateRegistration: true,
      showProfileImage: false,
      disable: true,
      modalVisible: false,
      message: '',
      image: "",
      base64: "",
      spin: false,
      postalCode: '',
      annualTurnOver: '',
      companySize: '',
      registrationNumber : '',
      showCompanyFurtherDetail: false,
      showDirector: false,
      directorName: '',
      directorEmail : '',
      directorNumber: '',
      directorAddress: '',
      directorPostalCode: '',
      directorCountry: '',
      directorState: '',
      isIndividual : false,
      document: [],
      showPersonalMembershipForm: false,
      showPersonalMembershipFurtherForm : false,
      personalReferenceDetails : false,
    }
  }

  componentDidMount(){

    this.getPermissionAsync()
    // handle hardware back button press
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.navigate("Home")
      return true;
    });

    this.setState({
      countryList : country
    })

  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

selectCountry = async country => {
  if (country === "Select Country"){
      this.setState({
          errMessage: "Select a country",
          showState: false,
          showSearchBtn: false,
      })
  }
  else{
    await this.setState({
            errMessage: "",
            country,
            showState: false,
            showSearchBtn: true
        },
        this.validateForm
        )

  this.evaluateStateList()
  }
}

selectCompanySize = async companySize => {
  if (companySize === "Comapny Size"){
      this.setState({
          errMessage: "Select Comapny Size",
      })
  }
  else{
    await this.setState({
            errMessage: "",
            companySize,
        },
        this.validateForm
        )
  }
}

selectState = async state => {
  if (country === "Select State" ){
      this.setState({
          errMessage: "Select a State",
          // showState: false,
      })
  }
  else{
    await this.setState({
            errMessage: "",
            state,
            // showState: false,
        },
        this.validateForm
        )

  this.evaluateStateList()
  }
}

evaluateStateList =()=>{
  let countryIndex = this.state.countryList.indexOf(this.state.country)
  let stateList = state(countryIndex)
  this.setState( { stateList, showState: true })
  // console.warn(stateList)
}

evaluateDirectorStateList =()=>{
  let countryIndex = this.state.countryList.indexOf(this.state.directorCountry)
  let stateList = state(countryIndex)
  this.setState( { stateList, showState: true })
  // console.warn(stateList)
}

validateForm = () => {
    let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      this.state.country.length > 0 &&
      this.state.email.length > 0 &&
      this.state.companyName.length > 0 &&
      // this.state.nickName.length > 0 &&
      this.state.bio.length > 0 &&
      this.state.address.length > 0 &&
      this.state.telephone.length > 0 &&
      this.state.state.length > 0 &&
      this.state.postalCode.length > 0 &&
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


handleCompanyName = companyName => {
    if (companyName.length > 0) {
      this.setState(
        {
            companyName,
            errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        companyName: '',
        errMessage: 'Company Name cannot be empty'
      });
    }
  };

  handleNickName = nickName => {
    if (nickName.length > 0) {
      this.setState(
        {
            nickName,
            errMessage: ''
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
            bio,
            errMessage: ''
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

  handleTelephone = telephone => {
    if (telephone.length > 0) {
      this.setState(
        {
            telephone,
            errMessage: ''
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

  handleAddress = address => {
    if (address.length > 0) {
      this.setState(
        {
            address,
            errMessage: ''
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
        errMessage: 'City cannot be empty'
      });
    }
  };

  handleIndustry = industry => {
    if (industry.length > 0) {
      this.setState(
        {
          industry,
          errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        industry: '',
        errMessage: 'Industry cannot be empty'
      });
    }
  };

  handleWebsite = website => {
    if (website.length > 0) {
      this.setState(
        {
          website,
          errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        website: '',
        errMessage: 'Website cannot be empty'
      });
    }
  };

  handleLinkedLn = linkedln => {
    if (linkedln.length > 0) {
      this.setState(
        {
            linkedln,
            errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        linkedln: '',
        errMessage: ''
      });
    }
  };

  handleTwitter = twitter => {
    if (twitter.length > 0) {
      this.setState(
        {
            twitter,
            errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        twitter: '',
        errMessage: ''
      });
    }
  };

  handleFacebook = facebook => {
    if (facebook.length > 0) {
      this.setState(
        {
            facebook,
            errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        facebook: '',
        errMessage: ''
      });
    }
  };

  handleInstagram = instagram => {
    if (instagram.length > 0) {
      this.setState(
        {
            instagram,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        instagram : '',
        errMessage: ''
      });
    }
  };

  handleUrl = url => {
    if (url.length > 0) {
      this.setState(
        {
            url,
            errMessage: ''
        },
        this.validateForm
      );
    } else {
      this.setState({
        url  : '',
        errMessage: ''
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
        postalCode  : '',
        errMessage: ''
      });
    }
  };

  handleAnnualTurnOver = annualTurnOver => {
    if (annualTurnOver.length > 0) {
      this.setState(
        {
            annualTurnOver,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        annualTurnOver  : '',
        errMessage: ''
      });
    }
  };

  handleRegistrationNumber = registrationNumber => {
    if (registrationNumber.length > 0) {
      this.setState(
        {
          registrationNumber,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        registrationNumber  : '',
        errMessage: ''
      });
    }
  };

  handleDirectorName = directorName => {
    if (directorName.length > 0) {
      this.setState(
        {
          directorName,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        directorName  : '',
        errMessage: ''
      });
    }
  };

  handleDirectorEmail = directorEmail => {
    if (directorEmail.length > 0) {
      this.setState(
        {
          directorEmail,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        directorEmail  : '',
        errMessage: ''
      });
    }
  };

  handleDirectorNumber = directorNumber => {
    if (directorNumber.length > 0) {
      this.setState(
        {
          directorNumber,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        directorNumber  : '',
        errMessage: ''
      });
    }
  };


  handleDirectorAddress = directorAddress => {
    if (directorAddress.length > 0) {
      this.setState(
        {
          directorAddress,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        directorAddress  : '',
        errMessage: ''
      });
    }
  };

  handleDirectorPostalCode = directorPostalCode => {
    if (directorPostalCode.length > 0) {
      this.setState(
        {
          directorPostalCode,
            errMessage: '' 
        },
        this.validateForm
      );
    } else {
      this.setState({
        directorPostalCode  : '',
        errMessage: ''
      });
    }
  };



  selectDirectorCountry = async directorCountry => {
    if (directorCountry.length > 0) {
      await this.setState(
        {
          directorCountry,
            errMessage: '' 
        },
        this.validateForm
      );
      this.evaluateDirectorStateList()
    } else {
      this.setState({
        directorCountry  : '',
        errMessage: ''
      });
    }
  };

  selectDirectorState = async directorState => {
    if (directorState.length > 0) {
      await this.setState(
        {
          directorState,
            errMessage: '' 
        },
        this.validateForm
      );
      this.evaluateDirectorStateList()
    } else {
      this.setState({
        directorState  : '',
        errMessage: ''
      });
    }
  };


  show = () =>{
    this.setState({
        show: true,
        showOthers: false,
        showProfileImage: false,
        showCompanyFurtherDetail: false,
        showDirector: false,
        initiateRegistration: false,
        showPersonalMembershipForm: false,
        showPersonalMembershipFurtherForm  : false,
        personalReferenceDetails : false,
    })
  }


  showOthers = () =>{
      this.setState({
          show: false,
          showOthers: true,
          showProfileImage: false,
          showCompanyFurtherDetail: false,
          showDirector: false,
          initiateRegistration: false,
          showPersonalMembershipForm: false,
          showPersonalMembershipFurtherForm  : false,
          personalReferenceDetails : false,
      })
  }

  showProfileImage = () =>{
    this.setState({
        show: false,
        showOthers: false,
        showProfileImage: true,
        showCompanyFurtherDetail: false,
        showDirector: false,
        initiateRegistration: false,
        showPersonalMembershipForm: false,
        showPersonalMembershipFurtherForm  : false,
        personalReferenceDetails : false,
    })
}

showCompanyFurtherDetail = () =>{
  this.setState({
      show: false,
      showOthers: false,
      showProfileImage: false,
      showCompanyFurtherDetail: true,
      showDirector: false,
      initiateRegistration: false,
      showPersonalMembershipForm: false,
      showPersonalMembershipFurtherForm  : false,
      personalReferenceDetails : false,
  })
}

showDirector = () =>{
  this.setState({
      show: false,
      showOthers: false,
      showProfileImage: false,
      showCompanyFurtherDetail: false,
      showDirector: true,
      initiateRegistration: false,
      showPersonalMembershipForm: false,
      showPersonalMembershipFurtherForm  : false,
      personalReferenceDetails : false,
  })
}

showPersonalMembershipForm = () =>{
  this.setState({
      show: false,
      showOthers: false,
      showProfileImage: false,
      showCompanyFurtherDetail: false,
      showDirector: false,
      initiateRegistration: false,
      showPersonalMembershipForm: true,
      showPersonalMembershipFurtherForm  : false,
      personalReferenceDetails : false,
  })
}

showPersonalMembershipFurtherForm  = () =>{
  this.setState({
      show: false,
      showOthers: false,
      showProfileImage: false,
      showCompanyFurtherDetail: false,
      showDirector: false,
      initiateRegistration: false,
      showPersonalMembershipForm: false,
      showPersonalMembershipFurtherForm  : true,
      personalReferenceDetails : false,
  })
}

personalReferenceDetails  = () =>{
  this.setState({
      show: false,
      showOthers: false,
      showProfileImage: false,
      showCompanyFurtherDetail: false,
      showDirector: false,
      initiateRegistration: false,
      showPersonalMembershipForm: false,
      showPersonalMembershipFurtherForm  : false,
      personalReferenceDetails : true,
  })
}


join = async () =>{
  let data;

    let director= [];
    director.push({
      name: this.state.directorName,
      email: this.state.directorEmail,
      address: this.state.directorAddress,
      country: this.state.state.directorCountry,
      city: this.state.directorState,
      postalCode: this.state.directorPostalCode,
      tel: this.state.directorNumber,
    });

    data ={
      isIndividual : this.state.isIndividual,
      companyName: this.state.companyName,
      shortName: this.state.nickName,
      email: this.state.email,
      address: this.state.address,
      country: this.state.country,
      city: this.state.state,
      tel: this.state.telephone,
      postalCode: this.state.postalCode,
      annualTurnOver: this.state.annualTurnOver,
      companySize : this.state.companySize,
      companyRegisteredNumber : this.state.registrationNumber,
      director : director,
      document : this.state.document,
      bio: this.state.bio,
      industry: this.state.industry,
      profileImage: this.state.profileImage,
      website: this.state.website,
      url: this.state.url,
      linkedln: this.state.linkedln,
      facebook: this.state.facebook,
      twitter: this.state.twitter,
      instagram: this.state.instagram,
    };
  

    var url = apiUrl + "partner/" + this.props.userId;
    // console.warn("imageUrl",this.state.imageUrl)
    var result = await fetch(url, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       },
      body: JSON.stringify(data)
    });
    var response = await result;

    if(response.status !== 200){
      this.setState({ spin : false, message: "Error occured", modalVisible: true })
      
    }
    else{
      var res = await response.json();
      if(res.success ){
        return this.setState({ spin : false, message: "Profile submitted successfully for approval", modalVisible: true })
      }
      else{
        this.setState({ spin : false, message: "Oopps, could not submit profile!", modalVisible: true })
      }
    }
    
  }

  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.3,
      base64: true
    });

    if (!result.cancelled) {
      this.setState({ image: result.uri, base64: result.base64 })
    }

    if(!result.base64){
      return this.setState({ message: 'There seams to be an error with the image', modalVisible: true })
     }
  }

  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    alert(result.uri);
    console.log(result);
}


  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
        this.setState({ message: "Sorry, we need camera roll permissions to post!", modalVisible: true })
        }
    }
}

postImageToCloud = ()=> {
    this.setState({ spin : true })
      let base64Img = `data:image/jpg;base64,${this.state.base64}`
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
             this.setState({ profileImage : data.secure_url })
             this.join(data.secure_url)
           })
         .catch(err=>this.setState({ message: "Error occured while uploading profile image", modalVisible: true }))
  }


  render() {

    const pickCountry = this.state.countryList.map((name,index) =>(
        <Picker.Item label={`${name}`} key={index}
            value={`${name}`}
        /> 
      ))
  
      const pickState = this.state.stateList.map((name,index) =>(
        <Picker.Item label={`${name}`} key={index}
            value={`${name}`}
        /> 
      ))

      const others = (
        <Form style={{ padding: 20 }}>
            <Item stackedLabel>
                <Label>Industry</Label>
                <Input onChangeText= { this.handleIndustry  } value={this.state.industry }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Website</Label>
                <Input onChangeText= { this.handleWebsite  } value={this.state.website }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>LinkedLn</Label>
                <Input onChangeText= { this.handleLinkedLn} value={this.state.linkedln }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Twitter</Label>
                <Input onChangeText= { this.handleTwitter} value={this.state.twitter }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Facebook</Label>
                <Input onChangeText= { this.handleFacebook } value={this.state.facebook }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Instagram</Label>
                <Input onChangeText= { this.handleInstagram } value={this.state.instagram }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Other URL</Label>
                <Input onChangeText= { this.handleUrl } value={this.state.url }  autoCapitalize='words'/>
            </Item>

            <View style={{ paddingBottom : 25, paddingTop: 25 }}>
                <Item>
                  <Left>
                    <Button  danger
                      disabled={ this.state.disable }
                      onPress={this.showCompanyFurtherDetail }
                    >
                      <Body><Text> Back </Text></Body> 
                    </Button>
                  </Left>
                  <Right>
                  <Button  danger
                    disabled={ this.state.website.length > 0 ? false : true }
                    onPress={ this.showDirector }
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
                  </Right>
                </Item>
              </View>

        </Form>
      )

      const companyFurtherDetails = (
        <Form style={{ padding: 20 }}>
            <Item stackedLabel>
                <Label>Registration Number</Label>
                <Input onChangeText= { this.handleRegistrationNumber  } value={this.state.registrationNumber }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Annual Turn Over</Label>
                <Input onChangeText= { this.handleAnnualTurnOver  } value={this.state.annualTurnOver }  autoCapitalize='words'/>
            </Item>
            <Item>
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.companySize}
                        onValueChange={ this.selectCompanySize }
                    >
                      <Picker.Item label="Comapny Size"
                          value="Comapny Size"
                      /> 
                      <Picker.Item label="1 - 10"
                          value="1 - 10"
                      /> 
                      <Picker.Item label="11 - 20"
                          value="11 - 20"
                      /> 
                      <Picker.Item label="21 - 50"
                          value="21 - 50"
                      /> 
                      <Picker.Item label="50+"
                          value="50+"
                      /> 
                  </Picker>
              </Item>
            
            <View style={{ paddingBottom : 25, paddingTop: 25 }}>
              <Item>
                <Left>
                  <Button  danger
                    onPress={this.show }
                  >
                     <Body><Text> Back </Text></Body> 
                  </Button>
                  </Left>
                  <Right>
                  <Button  danger
                    disabled={ this.state.registrationNumber.length > 0 && this.state.annualTurnOver.length > 0 &&
                      this.state.companySize  ? false : true }
                    onPress={this.showOthers }
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
                  </Right>
                  </Item>
            </View>

        </Form>
      )

      const showProfileImage = (
          <View style={{ padding: 20 }}>
              <Body>
                <Thumbnail large source={{uri: this.state.image }} />
              </Body>
            {/* <Image source={{uri: this.state.image }}
                style={{height: 300, width: null, flex: 1}}
            /> */}
            <Button transparent
                onPress={this.pickImage }
            >  
                <Body><Icon name="camera" active /></Body>
                {/* <Text> Upload Profile Image </Text> */}
            </Button>
            <View style={{ paddingBottom : 25, paddingTop: 25 }}>
                <Button  danger
                    disabled={ this.state.base64.length > 0 ? false : true }
                    onPress={this.postImageToCloud}
                >
                    { this.state.spin ? <Spinner color='white' /> : ( <Body><Text> Join Community</Text></Body> ) }
                </Button>
            </View>
          </View>
      )

      const director =(
        <View style={{ padding: 20 }}>
          <Body><Text style={{ fontWeight: 'bold'}}>Company Director</Text></Body>
            <Item stackedLabel>
                <Label>Name</Label>
                <Input onChangeText= { this.handleDirectorName  } value={this.state.directorName }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Email</Label>
                <Input onChangeText= { this.handleDirectorEmail  } value={this.state.directorEmail }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Phone Number</Label>
                <Input onChangeText= { this.handleDirectorNumber  } value={this.state.directorNumber }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                  <Label>Address</Label>
                  <Input onChangeText= { this.handleDirectorAddress } value={this.state.directorAddress}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Postal Code</Label>
                  <Input onChangeText= { this.handleDirectorPostalCode } value={this.state.directorPostalCode}  autoCapitalize='words'/>
              </Item>
              <Item>
                {/* <Left> */}
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.directorCountry}
                        onValueChange={ this.selectDirectorCountry }
                    >
                      <Picker.Item label="Select Country"
                          value="Select Country"
                      /> 
                      { pickCountry }
                  </Picker>
                {/* </Left> */}
              </Item>
              { this.state.showState ? (
                <Item>
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.directorState}
                        onValueChange={ this.selectDirectorState }
                    >
                      <Picker.Item label="Select State"
                          value="Select State"
                      /> 
                      { pickState }
                  </Picker>
              </Item>
              ) : null }

            <View style={{ paddingBottom : 25, paddingTop: 25 }}>
              <Item>
                  <Left>
                    <Button  danger
                      onPress={this.showOthers }
                    >
                      <Body><Text> Back </Text></Body> 
                    </Button>
                  </Left>
                  <Right>
                    <Button  danger
                      disabled={ 
                        this.state.directorName.length > 0 && this.state.directorEmail.length > 0 &&
                        this.state.directorCountry.length > 0 && this.state.directorAddress.length  > 0  &&
                        this.state.directorPostalCode.length > 0 && this.state.directorState.length > 0  &&
                        (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i).test(this.state.directorEmail) ? false : true 
                      }
                      onPress={this.showProfileImage }
                    >
                      <Body><Text> Next </Text></Body> 
                    </Button>
                  </Right>
              </Item>
            </View>
        </View>
      )


      const selectMemberType = (
        <View>
          <ListItem>
              <Body>
                <View style={{ paddingBottom: 30, paddingTop: 30}}>
                  <Text style={{ paddingRight: 10, paddingLeft: 10,paddingBottom: 30, fontSize: 20 }}>Select Type of Membership</Text>
                  <Button iconLeft style={{ backgroundColor: "red", }}
                    onPress={ async ()=>{
                      await this.setState({
                        show: false,
                        initiateRegistration: false,
                        isIndividual: true,
                      })
                      this.showPersonalMembershipForm()
                    }}
                  >
                    <Icon active name="person"  />
                    <Text>Personal Membership</Text>
                  </Button>
                </View>
              
              <Button iconLeft style={{ backgroundColor: "#990000" }}
                onPress={()=>{
                  this.setState({
                    show: true,
                    initiateRegistration: false,
                    isIndividual: false,
                  })
                }}
              >
                <Icon active name="people" />
                <Text>Cooperate Membership</Text>
              </Button>
              </Body> 
            </ListItem>
        </View>
      )

      const showPersonalMembershipForm = (
        <Form style={{ padding: 20 }}>
        <Item stackedLabel>
            <Label>Full Name</Label>
            <Input onChangeText= { this.handleCompanyName  } value={this.state.companyName}  autoCapitalize='words'/>
        </Item>
        <Item stackedLabel>
            <Label>Bio</Label>
            <Input onChangeText= { this.handleBio } value={this.state.bio }  autoCapitalize='words'/>
        </Item>
        <Item stackedLabel>
            <Label>Email</Label>
            <Input onChangeText= { this.handleEmail } value={this.state.email }  autoCapitalize='words'/>
        </Item>
        <Item stackedLabel>
            <Label>Telephone (include country extension)</Label>
            <Input onChangeText= { this.handleTelephone } value={this.state.telephone}  autoCapitalize='words'/>
        </Item>
        <Item stackedLabel>
            <Label>Address</Label>
            <Input onChangeText= { this.handleAddress } value={this.state.address}  autoCapitalize='words'/>
        </Item>
        <Item stackedLabel>
            <Label>Postal Code</Label>
            <Input onChangeText= { this.handlePostalCode } value={this.state.postalCode}  autoCapitalize='words'/>
        </Item>
        <Item>
          {/* <Left> */}
            <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.country}
                  onValueChange={ this.selectCountry }
              >
                <Picker.Item label="Select Country"
                    value="Select Country"
                /> 
                { pickCountry }
            </Picker>
          {/* </Left> */}
        </Item>
        { this.state.showState ? (
          <Item>
            <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.state}
                  onValueChange={ this.selectState }
              >
                <Picker.Item label="Select State"
                    value="Select State"
                /> 
                { pickState }
            </Picker>
        </Item>
        ) : null }

        <View style={{ paddingBottom : 25, paddingTop: 25 }}>
          <Item>
            <Left>
              <Button  danger
                onPress={()=>{
                  this.setState({
                    show: false,
                    initiateRegistration: true,
                    showPersonalMembershipForm: false,
                  })
                }}
              >
                <Body><Text> Back </Text></Body> 
              </Button>
            </Left>
            <Right>
            <Button  danger
              disabled={this.state.disable}
              onPress={this.showPersonalMembershipFurtherForm }
            >
               <Body><Text> Next </Text></Body> 
            </Button>
            </Right>
          </Item>
        </View>

    </Form>
    )


    const showPersonalMembershipFurtherForm = (
      <Form style={{ padding: 20 }}>
          <Item stackedLabel>
              <Label>Occupation</Label>
              <Input onChangeText= { this.handleIndustry  } value={this.state.industry }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
                <Label>Annual Income</Label>
                <Input onChangeText= { this.handleAnnualTurnOver  } value={this.state.annualTurnOver }  autoCapitalize='words'/>
            </Item>
          <Item stackedLabel>
              <Label>Website</Label>
              <Input onChangeText= { this.handleWebsite  } value={this.state.website }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>LinkedLn</Label>
              <Input onChangeText= { this.handleLinkedLn} value={this.state.linkedln }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Twitter</Label>
              <Input onChangeText= { this.handleTwitter} value={this.state.twitter }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Facebook</Label>
              <Input onChangeText= { this.handleFacebook } value={this.state.facebook }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Instagram</Label>
              <Input onChangeText= { this.handleInstagram } value={this.state.instagram }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Other URL</Label>
              <Input onChangeText= { this.handleUrl } value={this.state.url }  autoCapitalize='words'/>
          </Item>

          <View style={{ paddingBottom : 25, paddingTop: 25 }}>
              <Item>
                <Left>
                  <Button  danger
                    disabled={ this.state.disable }
                    onPress={this.showPersonalMembershipForm }
                  >
                    <Body><Text> Back </Text></Body> 
                  </Button>
                </Left>
                <Right>
                <Button  danger
                  disabled={ this.state.website.length > 0 && this.state.industry.length > 0 
                    && this.state.annualTurnOver.length > 0? false : true }
                  onPress={ this.personalReferenceDetails }
                >
                   <Body><Text> Next </Text></Body> 
                </Button>
                </Right>
              </Item>
            </View>

      </Form>
    )

    const personalReferenceDetails =(
      <View style={{ padding: 20 }}>
        <Body>
          <Text style={{ fontWeight: 'bold'}}>Personal Reference</Text>
          <Text note>We may contact your referee to confirm your credibility</Text>
        </Body>
          <Item stackedLabel>
              <Label>Name</Label>
              <Input onChangeText= { this.handleDirectorName  } value={this.state.directorName }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Email</Label>
              <Input onChangeText= { this.handleDirectorEmail  } value={this.state.directorEmail }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
              <Label>Phone Number (include country extension)</Label>
              <Input onChangeText= { this.handleDirectorNumber  } value={this.state.directorNumber }  autoCapitalize='words'/>
          </Item>
          <Item stackedLabel>
                <Label>Address</Label>
                <Input onChangeText= { this.handleDirectorAddress } value={this.state.directorAddress}  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Postal Code</Label>
                <Input onChangeText= { this.handleDirectorPostalCode } value={this.state.directorPostalCode}  autoCapitalize='words'/>
            </Item>
            <Item>
              {/* <Left> */}
                <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.directorCountry}
                      onValueChange={ this.selectDirectorCountry }
                  >
                    <Picker.Item label="Select Country"
                        value="Select Country"
                    /> 
                    { pickCountry }
                </Picker>
              {/* </Left> */}
            </Item>
            { this.state.showState ? (
              <Item>
                <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.directorState}
                      onValueChange={ this.selectDirectorState }
                  >
                    <Picker.Item label="Select State"
                        value="Select State"
                    /> 
                    { pickState }
                </Picker>
            </Item>
            ) : null }

          <View style={{ paddingBottom : 25, paddingTop: 25 }}>
            <Item>
                <Left>
                  <Button  danger
                    onPress={this.showPersonalMembershipFurtherForm }
                  >
                    <Body><Text> Back </Text></Body> 
                  </Button>
                </Left>
                <Right>
                  <Button  danger
                    disabled={ 
                      this.state.directorName.length > 0 && this.state.directorEmail.length > 0 &&
                      this.state.directorCountry.length > 0 && this.state.directorAddress.length > 0  &&
                      this.state.directorPostalCode.length > 0 && this.state.directorState.length > 0  &&
                      (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i).test(this.state.directorEmail) ? false : true 
                    }
                    onPress={this.showProfileImage }
                  >
                    <Body><Text> Next </Text></Body> 
                  </Button>
                </Right>
            </Item>
          </View>
      </View>
    )
    


    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Join Community</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <KeyboardAwareScrollView
          extraScrollHeight={100}
          enableOnAndroid={true} 
          keyboardShouldPersistTaps='handled'
        >
        <Content>
        
          <Body>
            <Text note style={{ color: "red"}}>{this.state.errMessage} </Text>
          </Body>

          { this.state.initiateRegistration ? selectMemberType : null }

          {/* display form for company details */}
          { this.state.show ? (
              <Form style={{ padding: 20 }}>
              <Item stackedLabel>
                  <Label>Company Name</Label>
                  <Input onChangeText= { this.handleCompanyName  } value={this.state.companyName}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Nick Name</Label>
                  <Input onChangeText= { this.handleNickName } value={this.state.nickName }  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Bio</Label>
                  <Input onChangeText= { this.handleBio } value={this.state.bio }  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Email</Label>
                  <Input onChangeText= { this.handleEmail } value={this.state.email }  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Telephone (include country extension)</Label>
                  <Input onChangeText= { this.handleTelephone } value={this.state.telephone}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Address</Label>
                  <Input onChangeText= { this.handleAddress } value={this.state.address}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Postal Code</Label>
                  <Input onChangeText= { this.handlePostalCode } value={this.state.postalCode}  autoCapitalize='words'/>
              </Item>
              <Item>
                {/* <Left> */}
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.country}
                        onValueChange={ this.selectCountry }
                    >
                      <Picker.Item label="Select Country"
                          value="Select Country"
                      /> 
                      { pickCountry }
                  </Picker>
                {/* </Left> */}
              </Item>
              { this.state.showState ? (
                <Item>
                  <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.state}
                        onValueChange={ this.selectState }
                    >
                      <Picker.Item label="Select State"
                          value="Select State"
                      /> 
                      { pickState }
                  </Picker>
              </Item>
              ) : null }
  
              <View style={{ paddingBottom : 25, paddingTop: 25 }}>
                <Item>
                  <Left>
                    <Button  danger
                      onPress={()=>{
                        this.setState({
                          show: false,
                          initiateRegistration: true
                        })
                      }}
                    >
                      <Body><Text> Back </Text></Body> 
                    </Button>
                  </Left>
                  <Right>
                  <Button  danger
                    disabled={this.state.disable}
                    onPress={this.showCompanyFurtherDetail }
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
                  </Right>
                </Item>
              </View>
  
          </Form>
          ) : null }

          { this.state.showOthers ? others : null }

          { this.state.showProfileImage ? showProfileImage : null }

          { this.state.showCompanyFurtherDetail ? companyFurtherDetails : null }

          { this.state.showDirector ? director : null }

          { this.state.showPersonalMembershipForm ? showPersonalMembershipForm : null }

          { this.state.showPersonalMembershipFurtherForm  ? showPersonalMembershipFurtherForm  : null }

          { this.state.personalReferenceDetails ? personalReferenceDetails : null }

        </Content>
        </KeyboardAwareScrollView>
        <Footer >
          <FooterTab style={{ color: "#ffcccc", backgroundColor: "#990000"}}>
            <Button vertical 
            onPress={()=> this.props.navigation.navigate("Home")}
            >
              <Icon name="home" />
              <Text>Home</Text>
            </Button>
        
            <Button vertical 
              onPress={()=> this.props.navigation.navigate("Community")} >
              <Icon name="people" />
              <Text>Community</Text>
            </Button>
          
          </FooterTab>
        </Footer>

        {/* modalVisisble */}
        <Modal
        visible={this.state.modalVisible}
        modalTitle={<ModalTitle title="Message" />}
        modalAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside= { () => {
          this.setState({ modalVisible: false });
        }}
        width
        footer={
          <ModalFooter>
            <ModalButton
              text="Exit"
              onPress={() => this.setState({ modalVisible: false })}
            />
          </ModalFooter>
        }
      >
        <ModalContent >
          <View style= {{ padding : 12, paddingBottom: 40 }}>
            <Body>
              <Text >{ this.state.message }</Text>
            </Body>
          </View>
        </ModalContent>
      </Modal>


      </Container>
    );
  }
}

const mapStateToProps = state => ({
  jwt: state.login,
  userId: state.getUserId.userId,
  profile: state.userProfile
})

export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
   moreArtworkDetailsAction, getUserProfileAction })(JoinCommunityScreen)