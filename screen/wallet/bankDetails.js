import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import PropTypes from "prop-types"
import { getBankDetailsAction } from "../../redux/getBankDetails"
import {connect} from 'react-redux'

class BankDetail extends Component{
    render(){
        return(
            <List>
            <ListItem >
              <Body>
                <Text>{ this.props.bank.firstName ? `${this.props.bank.firstName} ${this.props.bank.lastName}` : "No Name Registered"}</Text>
                <Text note>{this.props.bank.bankName ? this.props.bank.bankName : "No Bank"}</Text>
                <Text note>{this.props.bank.accountNumber ? this.props.bank.accountNumber : "Account Number"}</Text>
                <Text note>{this.props.bank.email ? this.props.bank.email : "Email address"}</Text>
              </Body>
              <Right>
                <Text note>{this.props.bank.createdAt}</Text>
              </Right>
            </ListItem>
          </List>
        )
    }
}


const mapStateToProps = state => ({
    bank: state.bankDetails
})
  
  export default connect(mapStateToProps, { getBankDetailsAction })(BankDetail )