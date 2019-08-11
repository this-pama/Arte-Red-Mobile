import React from "react"
import { Content, Container, Button, ListItem, Body, Icon, Left, Text } from "native-base"
import { ImageBackground } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";

export default class LandingScreen extends React.Component{
    render(){
        return (
            <Container >
                
                <ImageBackground imageStyle={{resizeMode:"cover"}} source={ require("../assets/splash.png")} style={{ opacity: 0.7, flex: 1 }}>
                <Content>
                    <Body>
                    <ListItem style={{ justifyContent: "center", alignItems: "center", paddingTop: 100 }}>
                            <Button  
                                onPress={()=> this.props.navigation.navigate("Home")}
                            >   
                                <Icon  name="book" />
                                <Text>Explore</Text>
                            </Button>
                        </ListItem>
                        <ListItem>
                            <Button 
                                onPress={()=> this.props.navigation.navigate("SignUp")}
                             >
                                <Icon  name="log-in" />
                                <Text>Register</Text>
                            </Button>
                        </ListItem>
                        
                            <TouchableOpacity
                                style={{ paddingBottom: 50, paddingTop: 15 }}
                                onPress={()=> this.props.navigation.navigate("Login")}
                            >
                                <Text style={{ color: "white"}}>Already registered. Sign In</Text>
                            </TouchableOpacity>
                        </Body>
                    </Content>
                    </ImageBackground>
               
            </Container>
        )
    }
}