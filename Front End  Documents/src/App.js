import React, { Component } from 'react';
import Navigation           from './components/navigation/Navigation.js';
import Logo                 from './components/Logo/Logo.js';
import ImgLink              from './components/ImgLink/ImgLink.js';
import FaceR                from './components/FaceRecognition/FaceRecognition.js';
import Rank                 from './components/Rank/Rank.js';
import SignIn               from './components/SignIn/SignIn';
import RegisterIn               from './components/Register/Register';
import Particles            from 'react-particles-js';
import Clarifai             from 'clarifai';
import                           './App.css';


// particles for background wich will be used at end
const particleOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}


//API for face recognition parameters
const app = new Clarifai.App({
      apiKey: '3f4c276e49e242648ada1321d441fd2a'
});

//Basic needed information for the app (states)
class App extends Component {
  constructor() {
    super();
    this.state = {
         input:        '',
         imageUrl:     '',
         box:          { },
         route:        'signin',
         isSignnedIn:  false,
         user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
         }
    }
  }

//loading user information as an object
loadUser = (data) => {  
  this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    
  }})
}
//Face cordinates calcualtion for face recognition
faceLocation = (data) => {
  const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image =  document.getElementById('inputimage');
  const width =  Number(image.width);
  const height = Number(image.height);

  return {
    leftCol:   clarifaiFace.left_col * width,
    topRow:    clarifaiFace.top_row * height,
    rightCol:  width - (clarifaiFace.right_col * width),
    bottomRow: height - (clarifaiFace.bottom_row * height)
  }

}
//Box for face recognition area
displayFaceBox = (box) => {
  this.setState({box: box});
}
//Event change for the sign in/out and register
onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

//Button event for the face recognition request
onButtonSubmit = () => {
  this.setState({imageUrl: this.state.input});
  app.models.predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                  id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
      }
      this.displayFaceBox (this.faceLocation(response))
    })

  }


//Event change for the buttons for 1 page change between sign in/out and register 
onRouteChange =(route) => {
  if (route === 'signout') {
    this.setState({isSignnedIn: false})
  } else if (route === 'home') {
    this.setState({isSignnedIn: true})
  }
  this.setState({route: route});
}

//App Sections to implement as 1 page
render() {
  const { isSignnedIn, imageUrl, route, box } = this.state;
  return (
    <div className="App">
      <Particles className='particles' params={particleOptions}/>
      <Navigation isSignnedIn={isSignnedIn} onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home' 
      ? <div>
          <Logo />
          <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
          />
          <ImgLink 
              onInputChange= {this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
          />
          <FaceR 
              box=      {box} 
              imageUrl= {imageUrl}
          />
      </div>
      : (
        route === 'signin'
        ? <SignIn  
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          />
        : <RegisterIn 
            loadUser={this.loadUser} 
            onRouteChange={this.onRouteChange}
          /> 
      ) 
      }
    </div>
    );
  }
}

export default App;

