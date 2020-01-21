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


class VerifyAuctionScreen extends Component {
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
      title : '',
      size: '',
      description: '',
      email: '',
      telephone: '',
      address: '',
      city: '',
      facebook: '',
      website: '',
      category: '',
      currency: '',
      price: '',
      duration: '',
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
      artistName: "",
      year: "",
      partnerName: '',
      partnerEmail: "",
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
  }
}


validateForm = () => {
    let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      this.state.size.length > 0 &&
      this.state.currency.length > 0 &&
      this.state.currency.length == 3 &&
      this.state.title.length > 0 &&
      this.state.description.length > 0 &&
      this.state.price > 0 &&
      this.state.category &&
      this.state.duration > 0
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

  handleCategory = category => {
    if (category){
        this.setState({
            category,
            errMessage: ""
        }, this.validateForm )
    }else{
    this.setState({
        errMessage : "Select a category"
    })
    }
  
  }

  handleTitle = title => {
    if (title.length > 0) {
      this.setState(
        {
            title
        },
        this.validateForm
      );
    } else {
      this.setState({
        title: '',
        errMessage: 'ARtwork Title cannot be empty'
      });
    }
  };

  handleSize = size => {
    if (size.length > 0) {
      this.setState(
        {
            size
        },
        this.validateForm
      );
    } else {
      this.setState({
        size: '',
        errMessage: 'Size cannot be empty'
      });
    }
  };

  handleDescription = description => {
    if (description.length > 0) {
      this.setState(
        {
            description
        },
        this.validateForm
      );
    } else {
      this.setState({
        description: '',
        errMessage: 'Description cannot be empty'
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

  handleArtistName = artistName => {
    if (artistName.length > 0) {
      this.setState(
        {
            artistName
        },
        this.validateForm
      );
    } else {
      this.setState({
        artistName: '',
        errMessage: 'Artist Name cannot be empty'
      });
    }
  };


  handleYear = year => {
    if (year.length > 0) {
      this.setState(
        {
            year
        },
        this.validateForm
      );
    } else {
      this.setState({
        year: '',
        errMessage: 'Year cannot be empty'
      });
    }
  };


  handlePartnerEmail = partnerEmail => {
    if (partnerEmail.length > 0) {
      this.setState(
        {
            partnerEmail
        },
        this.validateForm
      );
    } else {
      this.setState({
        partnerEmail: '',
        errMessage: 'Email cannot be empty'
      });
    }
  };


  handlePartnerName = partnerName => {
    if (partnerName.length > 0) {
      this.setState(
        {
            partnerName
        },
        this.validateForm
      );
    } else {
      this.setState({
        partnerName: '',
        errMessage: 'Name cannot be empty'
      });
    }
  };


  handleCurrency = currency => {
    if(currency.length > 3){
        return this.setState({ message: "Currency must be 3 letters", modalVisible: true })
    }
    else if (currency){
        this.setState({
          currency: currency.toUpperCase(),
          errMessage: ""
        }, this.validateForm )
    }
    else {
        this.setState({
          currency: '',
          errMessage: 'Currency cannot be empty'
        });
      }
  }

  handlePrice = price => {
    if (price.length > 0 && +price) {
      this.setState(
        {
          price: +price,
          errMessage: ""
        },
        this.validateForm
      );
    } else {
      this.setState({
        price: '',
        errMessage: 'Price cannot be empty'
      });
    }
  };

  handleDuaration = duration => {
    if (duration.length > 0 && +duration) {
      this.setState(
        {
          duration: +duration,
          errMessage: ""
        },
        this.validateForm
      );
    } else {
      this.setState({
        duration: '',
        errMessage: 'Duration cannot be empty'
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

    var url = apiUrl + "auction/verify/" + this.props.profile.partnerId;
    // console.warn("imageUrl",this.state.imageUrl)
    var result = await fetch(url, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json',
        // "Authorization": `Bearer ${this.props.jwt}`
       },
      body: JSON.stringify({
          title: this.state.title,
          size: this.state.size,
          description: this.state.description,
          category: this.state.category,
          price: this.state.price,
          currency: this.state.currency,
          duration: this.state.duration,
          address: this.state.address,
          country: this.state.country,
          sellerEmail : this.state.email,
          imageUrl: this.state.profileImage,
          artistName : this.state.artistName,
          year: this.state.year,
          partnerName: this.state.partnerName,
          partnerEmail : this.state.partnerEmail,
      })
    });
    var response = await result;
    
    if(response.status !== 200){
        console.warn(response)
      return this.setState({ spin : false, message: "Error occured", modalVisible: true })
      
    }
    else{
      var res = await response.json();
      console.warn(res)
      if(res._id ){
        this.setState({ spin : false, message: "Successfully submitted verification", modalVisible: true })
        // this.props.navigation.navigate("Partner")
        return
      }
      else{
        return this.setState({ spin : false, message: "Error occured!", modalVisible: true })
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
  
      const others = (
        <Form style={{ padding: 20 }}>
            <Item stackedLabel>
                <Label>Address</Label>
                <Input onChangeText= { this.handleAddress  } value={this.state.address }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Seller Email</Label>
                <Input onChangeText= { this.handleEmail} value={this.state.email }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Verifying Member Email</Label>
                <Input onChangeText= { this.handlePartnerEmail } value={this.state.partnerEmail }  autoCapitalize='words'/>
            </Item>
            <Item stackedLabel>
                <Label>Verifying Member Name</Label>
                <Input onChangeText= { this.handlePartnerName } value={this.state.partnerName }  autoCapitalize='words'/>
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

            <View style={{ paddingBottom : 25, paddingTop: 25 }}>
                  <Button  danger
                    disabled={ this.state.country.length > 0 && this.state.email.length > 0
                     && (/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i).test(this.state.email)  && this.state.address.length > 0 ? false : true }
                    onPress={this.showProfileImage}
                  >
                     <Body><Text> Next </Text></Body> 
                  </Button>
              </View>

        </Form>
      )

      const showProfileImage = (
          <View style={{ padding: 20 }}>
              {/* <Body>
                <Image source={{uri: this.state.image }}
                    style={{height: 300, width: null, flex: 1}}
                /> 
              </Body> */}
            <Image source={{uri: this.state.image }}
                style={{height: 300, width: null, flex: 1}}
            />
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
                    { this.state.spin ? <Spinner color='white' /> : ( <Body><Text>Submit Verification</Text></Body> ) }
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
            <Title>Verify Auction</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="eye" />
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
              <Form style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
              <Item stackedLabel>
                  <Label>Artwork Title</Label>
                  <Input onChangeText= { this.handleTitle  } value={this.state.title}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Artwork Size</Label>
                  <Input onChangeText= { this.handleSize } value={this.state.size}  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Auction Description</Label>
                  <Input onChangeText= { this.handleDescription } value={this.state.description }  autoCapitalize='words'/>
              </Item>
              <Item picker>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        style={{ width: undefined }}
                        placeholder="Category"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={this.state.category}
                        onValueChange={ this.handleCategory }
                    >
                        <Picker.Item label="Pick a Category" value="Category" />
                        <Picker.Item label="Painting" value="Paint" />
                        <Picker.Item label="Scupture" value="Scupture" />
                        <Picker.Item label="Drawing" value="Drawing" />
                        <Picker.Item label="Textile" value="Textile" />
                        <Picker.Item label="Collage" value="Collage" />
                        <Picker.Item label="Prints" value="Prints" />
                        <Picker.Item label="Photography" value="Photography" />
                        <Picker.Item label="Art Installation" value="Art Installation" />
                        <Picker.Item label="Others" value="Others" />
                    </Picker>
                </Item>
              <Item stackedLabel>
                  <Label>Artwork Price</Label>
                  <Input onChangeText= { this.handlePrice } value={this.state.price}  keyboardType='numeric' />
              </Item>
              <Item stackedLabel>
                  <Label>Currency</Label>
                  <Input onChangeText= { this.handleCurrency } value={this.state.currency }  autoCapitalize='words'/>
              </Item>
              <Item stackedLabel>
                  <Label>Auction duration ( in hours )</Label>
                  <Input onChangeText= { this.handleDuaration } value={this.state.duration}  keyboardType='numeric' />
              </Item>
              <Item stackedLabel>
                  <Label>Artist Name</Label>
                  <Input onChangeText= { this.handleArtistName } value={this.state.artistName}  keyboardType='numeric' />
              </Item>
              <Item stackedLabel>
                  <Label>Artwork Year</Label>
                  <Input onChangeText= { this.handleYear } value={this.state.year}  keyboardType='numeric' />
              </Item>
  
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
              onPress={()=> this.props.navigation.navigate("Partner")} >
              <Icon name="person" />
              <Text>Member</Text>
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
   moreArtworkDetailsAction, getUserProfileAction })(VerifyAuctionScreen)