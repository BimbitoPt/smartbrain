import React from "react";

class Register extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      signInEmail:'' ,
      signInPassword:'',
      signInName:''
  }
}

  onEmailChange =(event) =>{
    this.setState({signInEmail : event.target.value})
  }
  onPasswordChange =(event) =>{
    this.setState({signInPassword : event.target.value})
  }
  onNameChange =(event) =>{
    this.setState({signInName : event.target.value})
  }

  render() {
    const { onRouteChange } = this.props;
  return (
    <article classname="br3 ba  b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
      <main classname="pa4 black-80">
        <form classname="measure ">
          <fieldset id="sign_up" classname="ba b--transparent ph0 mh0">
            <legend classname="f4 fw6 ph0 mh0">Register</legend>
            <div classname="mt3">
              <label classname="db fw6 lh-copy f6" for="Name">
                Name
              </label>
              <input
                classname="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="text"
                name="Name"
                id="Name"
              />
            </div>
            <div classname="mt3">
              <label classname="db fw6 lh-copy f6" for="email-address">
                Email
              </label>
              <input
                classname="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="email"
                name="email-address"
                id="email-address"
              />
            </div>
            <div classname="mv3">
              <label classname="db fw6 lh-copy f6" for="password">
                Password
              </label>
              <input
                classname="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </fieldset>
          <div classname="">
            <input
              onClick={()=>onRouteChange('home')}
              classname="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
              type="submit"
              value="Register"
            />
          </div>
        </form>
      </main>
    </article>
  );
 }
};

export default Register;