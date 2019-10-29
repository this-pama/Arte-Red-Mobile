import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right,
  Card, CardItem, Toast, Text, Button, Icon, Title, Segment, Spinner,
  Picker, Item, Thumbnail  } from 'native-base';
import FooterTabs from "./service/footer"
import { Image } from 'react-native'
import { ScrollView, RefreshControl } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'
import {BackHandler, View,} from "react-native"
import { country, state } from './service/countries'
const KEYS_TO_FILTERS = ['state', 'country'];
import SearchInput, { createFilter } from 'react-native-search-filter';


class CommunityScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      register: "Register",
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
    }
  }

  componentDidMount(){
    this.getPartners()
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.getPartners().then(() => {
      this.setState({refreshing: false});
    });
  }

  getPartners= async ()=>{
    var url = apiUrl + "partner/all/location" ;
    var result = await fetch(url, {
      method: 'GET',
      headers: { 
        'content-type': 'application/json',
        "Authorization": `Bearer ${this.props.jwt.jwt}`
       }
    });
    var response = await result;
    if(response.status !== 200 ){
      console.warn("fetching feeds failed response")
      this.setState({
        allPartner: []
      })
      return
    }
    else{
      var res = await response.json();
      console.warn(res)
      if (res[0]._id) {
        // console.warn(res)
        this.setState({
          allPartner: res
        })
      }

      else  {
        console.warn("Can't get feeds")
        this.setState({
          allPartner: []
        })
        
      }
    }
  
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
        })

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
        })

  this.evaluateStateList()
  }
}

evaluateStateList =()=>{
  let countryIndex = this.state.countryList.indexOf(this.state.country)
  let stateList = state(countryIndex)
  this.setState( { stateList, showState: true })
  // console.warn(stateList)
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

    const filteredPartner = this.state.allPartner.filter(createFilter( this.state.state || this.state.country, KEYS_TO_FILTERS))
    return (
      <Container>
        <Header hasSegment style={{ backgroundColor: "#990000", paddingBottom: 40, paddingTop: 50 }}>
          <Left>
            <Button transparent onPress={()=> this.props.navigation.navigate("Home")}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>Community</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="people" />
            </Button>
          </Right>
        </Header>
        <Content>
              <Body>
                  <Text style={{padding: 20 }}>You can process verification or authorization from partners close to you.</Text>
                  {/* <TouchableOpacity>
                    <Text style={{ color: 'blue' }}> Join the community</Text>
                  </TouchableOpacity> */}
                  <Text note>Select your location to see list of partners</Text>
              </Body>
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
            { this.state.showSearchBtn ? (
              <Button block transparent 
              onPress={()=> this.setState({ search: true })}
              >
                <Text>See Members</Text>
              </Button>
            ) : null }

        <ScrollView>
          { this.state.search ? filteredPartner.map(name => {
            return (
              <List key={name._id}>
                <TouchableOpacity >
                  <ListItem avatar>
                    <Left>
                      <Thumbnail source={{uri : name.profileImage }} />
                    </Left>
                    <Body>
                      <Text>{name.companyName}</Text>
                      <Text note>{name.email}</Text>
                      <Text note>{name.phone}</Text>
                      <Text note>{name.address}</Text>
                      <Text note>{name.state}</Text>
                      <Text note>{name.country}</Text>
                    </Body>
                  </ListItem>
                </TouchableOpacity>
            </List>
            )
          }) : null }
        </ScrollView>
        </Content>
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
   moreArtworkDetailsAction, getUserProfileAction })(CommunityScreen)