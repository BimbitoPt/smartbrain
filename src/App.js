import React, { Component } from "react";
import Navigation from "./Components/Navigation/Navigation";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import Logo from "./Components/Logo/Logo";
import Signin from "./Components/Signin/Signin";
import Register from "./Components/Register/Register";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";

import "./App.css";
import "tachyons";
import ParticlesBg from "particles-bg";



const initialState ={
  input: '',
  imageUrl:'',
  box:{},
  route: 'signin',
  isSignedIn: false,
  user:{
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  }
}

class App extends Component {
  constructor() {
    super()
    this.state = initialState
  }

  loadUser = (data) => {
    this.setState({user : { 
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  };



  calculateFaceLocation = (data) => {
    if (!data || !data.outputs || !data.outputs[0].data || !data.outputs[0].data.regions || data.outputs[0].data.regions.length === 0) {
      return []; // Return an empty array for no faces detected.
    }
    
    const faceLocations = data.outputs[0].data.regions.map(region => {
      const clarifaiFace = region.region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      };
    });
  
    return faceLocations;
  }

  displayFaceBox = (faceLocations) => {
    this.setState({ faceLocations });
  }

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
  
    fetch('http://localhost:3000/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Error fetching data from the server');
        }
      })
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => {
              if (response.ok) {
                return response.json();
              } else {
                throw new Error('Error updating user data');
              }
            })
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(error => {
              console.error('Error updating user data:', error);
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch(error => {
        console.error('Error fetching data from the server:', error);
      });
  }
//----------------------------------------------------------------
  onRouteChange= (route) =>{
    if (route === 'signout') {
      this.setState(initialState)
    }else if(route === 'home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route : route});
  }
  render() {
    return (
      <div className="App">
        <ParticlesBg type="polygon" bg={true} className="particles" />
        <Navigation isSignedin={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {this.state.route === 'home' 
        ?
        <div>
        <Logo />
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onPictureSubmit={this.onPictureSubmit}
        />
        <FaceRecognition faceLocations={this.state.faceLocations} imageUrl={this.state.imageUrl}/>
        </div>
        :(
          this.state.route === 'signin' ?
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          :<Register loadUser={this.loadUser}onRouteChange={this.onRouteChange}/>
        )
        }
        

      </div>
    );
  }
}

export default App;
