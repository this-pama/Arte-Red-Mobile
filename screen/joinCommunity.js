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
      show: true,
      showProfileImage: false,
      disable: true,
      modalVisible: false,
      message: '',
      image: "",
      base64: "",
      spin: false,
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

validateForm = () => {
    let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      this.state.country.length > 0 &&
      this.state.email.length > 0 &&
      this.state.companyName.length > 0 &&
      this.state.nickName.length > 0 &&
      this.state.bio.length > 0 &&
      this.state.address.length > 0 &&
      this.state.telephone.length > 0 &&
      this.state.state.length > 0 &&
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
            companyName
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

  handleCity = city => {
    if (city.length > 0) {
      this.setState(
        {
          city
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
          industry
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
          website
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
            linkedln
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
            twitter
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
            facebook
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
            instagram 
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
            url 
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

  showOthers = () =>{
      this.setState({
          show: false,
          showOthers: true,
          showProfileImage: false
      })
  }

  showProfileImage = () =>{
    this.setState({
        show: false,
        showOthers: false,
        showProfileImage: true
    })
}

join = async () =>{

    var url = apiUrl + "partner/" + this.props.userId;
    // console.warn("imageUrl",this.state.imageUrl)
    var result = await fetch(url, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       },
      body: JSON.stringify({
          companyName: this.state.companyName,
          shortName: this.state.nickName,
          email: this.state.email,
          address: this.state.address,
          country: this.state.country,
          city: this.state.state,
          tel: this.state.telephone,
          bio: this.state.bio,
          industry: this.state.industry,
          profileImage: this.state.profileImage,
          website: this.state.website,
          url: this.state.url,
          linkedln: this.state.linkedln,
          facebook: this.state.facebook,
          twitter: this.state.twitter,
          instagram: this.state.instagram,
      })
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
        this.setState({ spin : false, message: "Error occured", modalVisible: true })
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
                  <Button  danger
                    disabled={ this.state.website.length > 0 ? false : true }
                    onPress={this.showProfileImage}
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
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
                  <Button  danger
                    disabled={this.state.disable}
                    onPress={this.showOthers}
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
              </View>
  
          </Form>
          ) : null }

          { this.state.showOthers ? others : null }

          { this.state.showProfileImage ? showProfileImage : null }

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