import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Nav from './Nav.jsx';
import Carousel from './Carousel.jsx';
import Hero from './Hero.jsx';


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      name: "",
      isLoggedIn: false,
      goals: [],
      view: "DailyGoals",
      badges: 0,
      newBadge: false,
    }

    this.renderPage = this.renderPage.bind(this);
    this.verifyLogin = this.verifyLogin.bind(this);
    this.updateFromDatabase = this.updateFromDatabase.bind(this);
    this.setView = this.setView.bind(this);
    this.updateBadge = this.updateBadge.bind(this);
    this.resetBadgeAlert = this.resetBadgeAlert.bind(this);

  }

  componentWillMount(){
    this.updateFromDatabase();
    this.verifyLogin();
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.state.goals !== nextState.goals) {
      return true;
    } else if (this.state.view !== nextState.view) {
      return true;
    } else if (this.state.newBadge !== nextState.newBadge){
      return true;
    }
    return false;
  }

  setView(view){
    if (view === 1) {
      this.setState({view: "AllGoals"});
    }
    if (view === 2) {
      this.setState({view: "DailyGoals"});
    }
    if (view === 3) {
      this.setState({view: "Badges"});
    }
    if (view === 4) {
      this.setState({view: "Dashboard"});
    }
  }

  updateFromDatabase () {
    console.log("Calling DB from App, goallist is", this.state.goals);
    $.ajax({
      method: "get",
      url: "/api/goals",
    }).done((response) => {
      this.setState({goals: response.data});
    });
  }

  verifyLogin(){
    $.ajax({
      method: "get",
      url: "/login",
      dataType: 'json'
    }).done((data) => {
      this.setState({isLoggedIn: data.isLoggedIn, name: data.name, badges: data.badges});
      this.updateFromDatabase();
    });
  }

  updateBadge(){
    let badges = this.state.badges + 1;

    $.ajax({
        method: 'post',
        url: `/api/users/update`,
        data: {
          data: {
            badges: badges
          }
        }
      }).done(() => {
        if (badges <= 9) {
          this.setState({badges: badges, newBadge: true});
        } else {
          this.setState({badges: badges});

        }
      });
  }

  resetBadgeAlert(){
        this.setState({newBadge: false});
  }

//this renders appropriate component if user is not logged in
  renderPage() {
          console.log("GOAL LIST App :", this.state.goals)

    if (this.state.isLoggedIn === false) {
      return (<Hero
        setUserId={this.setUserId}
        verifyLogin={this.verifyLogin}
        setView={this.setView}
        />);
    } else {
      return (
        <ReactCSSTransitionGroup
          className="slide-animation"
          component="div"
          transitionName="background"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}>
          <Carousel
          name={this.state.name}
          setView={this.setView}
          badges={this.state.badges}
          updateBadge={this.updateBadge}
          updateGoalsIndex={this.updateFromDatabase}
          goalList={this.state.goals}
          view={this.state.view}
          key={this.state.view}
          update={this.updateFromDatabase}
          component="animated-component"/>
        </ReactCSSTransitionGroup>);
    }
  }

  render() {
    console.log("Rendering <App/>");
    return (
      <div id="wrapper">
        <Nav
          name={this.state.name}
          isLoggedIn={this.state.isLoggedIn}
          verifyLogin={this.verifyLogin}
          setView={this.setView}
          newBadge={this.state.newBadge}
          resetBadgeAlert={this.resetBadgeAlert}
          updateGoals={this.updateFromDatabase}
         />
        {this.renderPage()}
      </div>
    );
  }

}
export default App;
