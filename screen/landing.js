import React from "react"
import { Content, Container, Button, ListItem, Body, Icon, Left, Text } from "native-base"
import { ImageBackground, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { apiUrl } from './service/env';
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { getUserProfileAction } from "../redux/userProfileAction"
import { buyArtworkAction } from "../redux/buyAction"
import { moreArtworkDetailsAction } from "../redux/artworkDetailsAction"
import {connect} from 'react-redux'

class LandingScreen extends React.Component{

    componentDidMount(){
        // console.warn(this.props.jwt)
        if(this.props.jwt ){
            this.props.navigation.navigate('Home')
        }
        else{
            return 
        }
    }
    render(){
        return (
            <Container >
                
                <ImageBackground imageStyle={{resizeMode:"cover"}} source={ require("../assets/bg.jpg")} style={{ flex: 1 }}>
                <Content>
                    <Body style={{ paddingTop: 100, paddingBottom: 60 }}>
                        <Image source={ require("../assets/logo.jpg")} 
                            style={{ flex: 1}} />
                    </Body>
                    <Body>
                    <ListItem style={{ justifyContent: "center", alignItems: "center", }}>
                            <Button  danger
                                onPress={()=> this.props.navigation.navigate("Home")}
                            >   
                                <Icon  name="book" />
                                <Text>Explore</Text>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button danger
                                onPress={()=> this.props.navigation.navigate("SignUp")}
                             >
                                <Icon  name="log-in" />
                                <Text>Register</Text>
                            </Button>
                        </ListItem>
                        
                            <TouchableOpacity
                                style={{ paddingBottom: 50, marginTop: 20 }}
                                onPress={()=> this.props.navigation.navigate("Login")}
                            >
                                <Text style={{ color: "red"}}>Already registered. Sign In</Text>
                            </TouchableOpacity>
                        </Body>
                    </Content>
                </ImageBackground>
               
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    jwt: state.login.jwt,
    userId: state.getUserId.userId,
    profile: state.userProfile
  })
  
  export default connect(mapStateToProps, {loginAction, getUserIdAction,buyArtworkAction,
     moreArtworkDetailsAction, getUserProfileAction })(LandingScreen)