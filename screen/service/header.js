import React from 'react'
import PropTypes from 'prop-types';
import {Header, Left, Button, Icon, Body, Title, Right } from 'native-base'
import { DrawerActions } from 'react-navigation';

export default class HeaderTheme extends React.Component{
    render(){
       return(
            <Header
              androidStatusBarColor = "#800000"
              iosBarStyle = "dark-content"
            >
          <Left>
            <Button transparent>
              <Icon name='arrow-back' 
                onPress={()=> this.props.navigation.goBack()}
              />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.title}</Title>
          </Body>
          <Right>
            <Button transparent  onPress={ this.props.drawer } >
                <Icon name='menu'  />
            </Button>
          </Right>
        </Header>
       )
    }
}

HeaderTheme.propTypes={
    title: PropTypes.string.isRequired
}