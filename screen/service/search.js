import { Text, Image } from 'react-native'
import React, { Component } from 'react';
import { Modal, TouchableHighlight, Alert, ScrollView, StyleSheet } from 'react-native';
import { Icon, Toast, Left, View, Right, ListItem, List, Input, Form,
Item, Button } from 'native-base'
import { TouchableOpacity } from "react-native-gesture-handler"
import {connect} from 'react-redux'
import { loginAction } from "../../redux/loginAction"
import { getUserIdAction } from "../../redux/getUserId"
import { getUserProfileAction } from "../../redux/userProfileAction"
import { buyArtworkAction } from "../../redux/buyAction"
import { moreArtworkDetailsAction } from "../../redux/artworkDetailsAction"
import {apiUrl} from "./env"
import SearchInput, { createFilter } from 'react-native-search-filter';
const KEYS_TO_FILTERS = ['title', "firstName", "lastName"];

class SearchIcon extends Component{
    constructor(props){
      super(props);
      this.state={
        modalVisible: false,
        search: false,
        feed: [],
        searchTerm:""
      }
    }

    componentDidMount(){
      this.getFeed()
    }
  
    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }
    
    searchUpdated(term) {
      this.setState({ searchTerm: term })
    }


    getFeed= async ()=>{
      var url = apiUrl + "artwork" ;
      if(  !this.props.jwt || this.props.jwt.length <= 0
        || !this.props.userId
        ){
        url = apiUrl + "artwork/withoutJwt" ;
      }
      var result = await fetch(url, {
        method: 'GET',
        headers: { 
          'content-type': 'application/json',
          "Authorization": `Bearer ${this.props.jwt}`
         }
      });
      var response = await result;
      if(response.status !== 200 ){
        console.warn("fetching feeds failed response")
        this.setState({
          feed: []
        })
        return
      }
      else{
        var res = await response.json();
        if (res[0]._id) {
          // console.warn(res[0])
          let reverseResp = res.reverse()
          this.setState({
            feed: reverseResp
          })
        }

        else  {
          console.warn("Can't get feeds")
          this.setState({
            feed: []
          })
          
        }
      }
    
  }
  
  
    render(){
      const filteredArtwork = this.state.feed.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))

        return(
          <View>
            <TouchableOpacity
              onPress={()=> this.setModalVisible(true) }
            >
              <Icon name="search" style={{color: "white", fontSize: 20, paddingRight: 20}} />
            </TouchableOpacity>
              
                <Modal
                  animationType="slide"
                  transparent={false}
                  visible={this.state.modalVisible}
                  onRequestClose={() => {
                    console.warn('Modal has been closed.');
                  }}
                >
                <ListItem>
                  <Left>
                    <Button transparent
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    >
                        <Icon name="close" />
                    </Button>
                  </Left>
                </ListItem>
                <View style={styles.container}>
                <ListItem>
                      <SearchInput 
                        onChangeText={(term) => { this.searchUpdated(term) }} 
                        placeholder="Type a message to search"
                      />
                      
                      <Button transparent>
                        <Icon name="ios-people" />
                        <Text>Search</Text>
                      </Button>
                </ListItem>  
                    <ScrollView>
                      { filteredArtwork.map(search => {
        if(this.state.searchTerm.length < 3){
          return 
        }
        return (
          <View key={search._id}>
          <TouchableHighlight 
              onPress={()=>{
                this.setModalVisible(!this.state.modalVisible)
                this.props.moreArtworkDetailsAction({ artworkId : search._id })
                if(!this.props.userId){
                  return Toast.show({
                    text: "You need to sign in",
                    buttonText: "Okay",
                    duration: 3000,
                    type: 'danger'
                  })
                }
                this.props.navigation.navigate("Detail")}} 
               style={styles.searchItem}>
            <View>
              <Text>{search.title}</Text>
              <Text style={styles.searchSubject}>{search.story}</Text>
            </View>
          </TouchableHighlight >
          </View>
        )
      }) }
                    </ScrollView>
                  </View>
                </Modal>
              </View>
  
          )
        }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'flex-start'
    },
    searchItem:{
      borderBottomWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.3)',
      padding: 10
    },
    searchSubject: {
      color: 'rgba(0,0,0,0.5)'
    },
    searchInput:{
      padding: 10,
      borderColor: '#CCC',
      borderWidth: 1
    }
  });
  
  const mapStateToProps = state => ({
    jwt: state.login.jwt,
    userId: state.getUserId.userId,
    profile: state.userProfile,
    artworkId: state.artworkDetails.artworkId
  })
  
  export default connect(mapStateToProps, {loginAction, getUserIdAction, 
      getUserProfileAction, buyArtworkAction, moreArtworkDetailsAction })(SearchIcon)