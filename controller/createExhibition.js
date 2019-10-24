import React, { Component} from "react"
import CreateExhibition from "../screen/createExhibition"
import { loginAction } from "../redux/loginAction"
import { getUserIdAction } from "../redux/getUserId"
import { apiUrl, cloudinaryUrl } from "../screen/service/env"
import {connect} from 'react-redux'
import { Permissions } from 'expo';
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker';

class Exhibition extends Component{
    constructor(props){
        super(props)
        this.state={
            title: "",
            address: "",
            name: "",
            email: "",
            short: "",
            long: "",
            country: "",
            capacity: 0,
            time: 0,
            switch: false,
            date: new Date(),  
            errMessage: "",
            disable: true,
            spin: false,
            image: "",
            imageUrl: "",
            base64: "",
        }
    }

    componentDidMount() {
      // console.warn(this.props.jwt)
      this.getPermissionAsync();
    }
    
        getPermissionAsync = async () => {
        if (Constants.platform.ios) {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to post!');
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
            return alert("There seams to be an error with the image")
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
            errMessage: 'Title cannot be empty'
          });
        }
      };

      handleDate = (newDate) => {
        this.setState({ date: newDate.toString().substr(4, 12) });
      }


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

      handleCountry = country => {
        if (country.length > 0) {
          this.setState(
            {
              country
            },
            this.validateForm
          );
        } else {
          this.setState({
            country: '',
            errMessage: 'Country cannot be empty'
          });
        }
      };

      handleShort = short => {
        if (short.length > 0) {
          this.setState(
            {
              short
            },
            this.validateForm
          );
        } else {
          this.setState({
            short: '',
            errMessage: 'Give a short description'
          });
        }
      };

      handleLong = long => {
        if (long.length > 0) {
          this.setState(
            {
              long
            },
            this.validateForm
          );
        } else {
          this.setState({
            long: '',
            errMessage: 'Give a full description'
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

      handleCapacity = capacity => {
        if (capacity.length > 0 && +capacity > 0) {
          this.setState(
            {
              capacity
            },
            this.validateForm
          );
        } else {
          this.setState({
              capacity: 0,
            errMessage: 'What is your Exhibition Capacity?'
          });
        }
      };

      handleTime = time => {
        let hour
        if(this.state.switch){
          hour = 12
        }
        else{
          hour = 0
        }
        if (time.length > 0 && +time > 0) {
          let dayTime = time + hour
          this.setState(
            {
              time : dayTime
            },
            this.validateForm
          );
        } else {
          this.setState({
              time: 0,
            errMessage: 'Please specify time'
          });
        }
      };

    handleName = name => {
        if (name.length > 0) {
          this.setState(
            {
              name
            },
            this.validateForm
          );
        } else {
          this.setState({
            name: '',
            errMessage: 'Organizer Name cannot be empty'
          });
        }
      };
    
      handleSwitch= ()=>{
        if(this.state.switch){
          this.setState({
            switch: false
          })
        }
        else{
          this.setState({
            switch: true
          })
        }
      }

      validateForm = () => {
        let testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (
          this.state.title.length > 0 &&
          this.state.email.length > 0 &&
          this.state.name.length > 0 &&
          this.state.date.length > 0 &&
          this.state.capacity > 0 &&
          this.state.address.length > 0 &&
          this.state.country.length > 0 &&
          this.state.short.length > 0 &&
          this.state.long.length > 0 &&
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
               this.setState({ imageUrl : data.secure_url })
               this.create(data.secure_url)
             })
           .catch(err=>console.log(err))
    }

      create = async (base64) => {
        // console.warn(base64)
          var url = apiUrl + "exhibition/" + this.props.userId;
          var result = await fetch(url, {
            method: 'POST',
            headers: { 
                'content-type': 'application/json',
                "Authorization": `Bearer ${this.props.jwt}`
         },
            body: JSON.stringify({
              title: this.state.title,
              address: this.state.address,
              shortDescription : this.state.short,
              longDescription: this.state.long,
              country: this.state.country,
              capacity: this.state.quantity,
              time: this.state.time,
              organizerName: this.state.name,
              date: this.state.date,
              email: this.state.email,
              imageUrl: base64,
              userId: this.props.userId
            })
          });
          var response = await result;
          // console.warn(await result)
          if(response.status !== 200 ){
            console.warn("failed response")
            this.setState({
                title: "",
                address: "",
                name: "",
                email: "",
                short: "",
                long: "",
                country: "",
                capacity: 0,
                image: "",
                date: "", 
                errMessage: "Error while creating Exhibition",
                spin: false
            });
          }
          else{
            var res = await response.json();
            // console.warn(res)
            if (res._id) {
              this.setState({
                title: "",
                address: "",
                name: "",
                email: "",
                short: "",
                long: "",
                country: "",
                capacity: 0,
                date: "", 
                image: "",
                spin: false,
              });
              
              this.props.navigation.navigate("Exhibition")
            } 
            else  {
              console.warn("failed ")
              this.setState({
                title: "",
                address: "",
                name: "",
                email: "",
                short: "",
                long: "",
                country: "",
                capacity: 0,
                date: "", 
                image: "",
                errMessage: "Creating Exhibition Failure",
                spin: false
              });
            }
          }
          
      };

    render(){
        return (
            <CreateExhibition 
            title={this.state.title}
            address={this.state.address}
            short ={this.state.short}
            long={this.state.long}
            country={this.state.country}
            capacity={this.state.capacity}
            name={this.state.name}
            date={this.state.date}
            email={this.state.email}
            handleTitle={this.handleTitle}
            handleAddress={this.handleAddress}
            handleShort={this.handleShort}
            handleLong={this.handleLong}
            handleCountry ={this.handleCountry}
            handleCapacity={this.handleCapacity}
            handleName ={this.handleName}
            handleDate ={this.handleDate}
            handleEmail ={this.handleEmail}
            handleTime={this.handleTime}
            handleSwitch={this.handleSwitch}
            create ={this.postImageToCloud}
            disable ={this.state.disable}
            spin ={this.state.spin}
            switch={ this.state.switch}
            time={this.state.time}
            errMessage ={this.state.errMessage}
            navigation= {this.props.navigation}
            pickImage= {this.pickImage}
            image= {this.state.image}
            />
        )
    }
}

const mapStateToProps = state => ({
    jwt: state.login.jwt,
    accountId: state.login.accountId,
    userId: state.getUserId.userId
  })
  
  export default connect(mapStateToProps, {loginAction, getUserIdAction })(Exhibition)