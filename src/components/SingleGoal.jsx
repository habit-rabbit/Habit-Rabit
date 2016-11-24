import React, {Component} from 'react';
import NextTask from './NextTask.jsx';
import ProgressBar from './ProgressBar.jsx';
import GoalInfo from './Goal-info.jsx';

class SingleGoal extends Component {

  constructor(props){
    super(props);
    this.initializeTaskData = this.initializeTaskData.bind(this);
    this.showGoalinfo = this.showGoalinfo.bind(this);
    this.hideGoalInfo = this.hideGoalInfo.bind(this);
    this.getCurrentTask = this.getCurrentTask.bind(this);
    this.updateCurrentTask = this.updateCurrentTask.bind(this);
    this.goalType = this.goalType.bind(this);
    this.state = {
      tasks: {},
      currentTask: {},
      userId: null,
      goalComplete: false,
      showGoalinfo: false
    }
    this.initializeTaskData();
  }

  initializeTaskData () {
    $.ajax({
      method: "get",
      url: `/api/goals/${this.props.goalInfo.id}/tasks`
    }).done((data) => {
      let tasks = data.data;
      tasks.sort((a, b) => {
        if (a.task_order > b.task_order) {
          return 1;
        }
        if (a.task_order < b.task_order) {
          return -1;
        }
        return 0;
      });
      this.setState({tasks: data});
      let currTask = this.getCurrentTask();
      this.setState({currentTask: currTask});
    });
  }

  goalType (goal) {
    if(goal.private === false){
      return (
        <h4 className="goal-type"> Challenge </h4>
      )
    } else {
      return (
        <h4 className="goal-type"> Private </h4>
      )
    }
  }
  showGoalinfo() {
    this.setState({showGoalinfo: true});
  }
  hideGoalInfo() {
    this.setState({showGoalinfo: false});
  }
  getCurrentTask () {
    function findNextTask(task) {
      return !task.is_done
    }
    let taskName = this.state.tasks.data.find(findNextTask);
    if (!taskName) {
      this.setState({goalComplete: true});
    } else {
      return taskName;
    }
  }

  updateCurrentTask (goalId, taskId) {
    let taskUpdate = $.ajax({
      method: "post",
      url: `api/goals/${goalId}/tasks/${taskId}/update`,
      data: {is_done: true}
    }).done((data) => {
      this.initializeTaskData();
    });
  }
  toggleModal() {
    this.props.renderGoalInfoModal(GoalInfo, this.props.goalInfo, this.state.tasks);
  }
  renderGoals() {
    if(!this.state.tasks.data) {
      return (
        <div> {/*this should render as an error message (the one we get back from the server*/}
          <h3>Let's talk about tasks... </h3>
          <h3>YOU NEED TO MAKE SOME. </h3>
          <h3>HOW DO YOU EVEN EXPECT TO ACCOMPLISH YOUR DREAMS WITHOUT A PLAN, BARBARA.</h3>
        </div>
      );
    } else {
      return(
        <div>
          <div className="col-md-3">
            {this.state.showGoalinfo ? <GoalInfo goalInfo={this.props.goalInfo} tasks={this.state.tasks.data} hideGoalInfo={this.hideGoalinfo}/> : <h1 onClick={this.showGoalinfo}> {this.props.goalInfo.name} </h1>}


          </div>
          <div className="col-md-6">
            <div className="progress">
              <ProgressBar
              taskArray={this.state.tasks}/>
            </div>
          </div>
          <div className="col-md-3">
            <h4 className="task-list"> Next Task: </h4>
            <NextTask
            taskInfo={this.state.currentTask}
            updateCurrentTask={this.updateCurrentTask}
            goalInfo={this.props.goalInfo}
            goalComplete={this.state.goalComplete} />
          </div>

        </div>
      );
    }
  }


  render() {
    console.log("Rendering SingleGoal.jsx");
    return (
      <div>
       {this.renderGoals()}
      </div>
    );
  }

}

export default SingleGoal;