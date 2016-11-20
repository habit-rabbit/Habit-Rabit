import React, {Component} from 'react';
import Nav from './Nav.jsx';

class Login extends Component {

  constructor(props) {
    super(props);
    this.users = {};
    this.state = {email: "", password: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // for demonstration
    $.ajax({
      method: 'get',
      url: '/api/users/2',
      // data: {
      //   data: {
      //     first_name: "Ublueeous",
      //     last_name: "Granger",
      //     email: "iLoveCats@hogwarts.uk",
      //     password:"apples",
      //     password_confirmation: "apples"
      //   }
      // }
    });
  }

  handleChange(event) {
    let id = event.target.id;
    let value = event.target.value.trim();

    if (id === "email") {
      this.setState({email: value});
      console.log(this.state.email)
    }
    if (id === "password") {
      this.setState({password: value});
      console.log(this.state.password)
    }
  }

 handleSubmit(event) {
    event.preventDefault();

    $.ajax({
      method: 'post',
      url: '/login',
      data: {
        data: {
          email: this.state.email,
          password: this.state.password,
        }
      }
    }).then( (data) => {
      console.log("DAATAA", data)
    });
  }

  render() {
    console.log("Rendering <Login/>");

    return (
      <div className="modal fade" id="login-modal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h1 className="modal-title" id="myModalLabel">Login To Your Account</h1>
            </div>

            <div id="login-body" className="modal-body">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input id="email" type="text" value={this.state.value} onChange={this.handleChange} name="email" placeholder="Email"/>
              </div>

              <div className="form-group">
                <input id="password" type="password" value={this.state.password} onChange={this.handleChange} name="password" placeholder="Password"/>
              </div>

              <div className="form-group">
                <input type="submit" name="login" className="btn btn-default" value="Login" />
              </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Login