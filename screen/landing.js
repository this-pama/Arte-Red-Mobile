import React from "react"
import { Content, Container, Button, ListItem, Body, Icon, Left, Text } from "native-base"
import { ImageBackground, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";

export default class LandingScreen extends React.Component{
    render(){
        return (
            <Container >
                
                <ImageBackground imageStyle={{resizeMode:"cover"}} source={ require("../assets/bg.png")} style={{ flex: 1 }}>
                <Content>
                    <Body>
                        <Image source={ require("../assets/logo.png")} 
                            style={{height: 300, width: 400, flex: 1}} />
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
                                style={{ paddingBottom: 50, paddingTop: 200 }}
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