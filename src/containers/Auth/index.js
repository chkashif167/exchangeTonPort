import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import SwipeableViews from "react-swipeable-views";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Login from "./login";
import Register from "./register";
import Snackbar from "@material-ui/core/Snackbar";
import ToastContent from "../../components/Toast";
import { connect } from "react-redux";
import Paper from "@material-ui/core/Paper";
import { saveLoginInfo, LoadLoginInfo } from "../../service/authentication";
import t from '../../constants/language'

const styles = theme => ({
  paper: {
    maxWidth: 640,
    // [theme.breakpoints.down("1350")]: {
    //   width: 'auto'
    // },
    // [theme.breakpoints.down("md")]: {
    //   minWidth: 540
    // },
    // [theme.breakpoints.down("sm")]: {
    //   minWidth: 480
    // },
    // [theme.breakpoints.down("540")]: {
    //   minWidth: 320
    // },
    // [theme.breakpoints.down(400)]: {
    //   minWidth: 270
    // },
    margin: 20
  },
  SwipeableViews: {
    // maxWidth: 640,
    [theme.breakpoints.down("510")]: {
      width: 320
    },
    [theme.breakpoints.down("450")]: {
      width: 280
    },
    [theme.breakpoints.down("380")]: {
      width: 220
    }
  },
  tab: {
    padding: 20
  }
});

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIndex: 0,
      toastOpen: false
    };
  }

  componentDidMount() {
    const loginInfo = LoadLoginInfo();
    if (loginInfo.email) {
      this.setState({ tabIndex: 1 });
    }
    else
    this.setState({ tabIndex: 0 });
  }

  handleChange = (event, newVal) => {
    this.setState({ tabIndex: newVal });
  };

  handChangeIndex = index => {
    this.setState({ tabIndex: index });
  };

  handleClose = () => {
    // this.setState({ toastOpen: false });
    this.props.dispatch({ type: "CLOSE_TOAST" });
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <Paper className={classes.paper}>
        <div className={classes.tab}>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            // variant="fullWidth"
          >
            <Tab label={t[this.props.lang].register} />
            <Tab label={t[this.props.lang].login} />
          </Tabs>
          <SwipeableViews
            axis={theme === "rtl" ? "x-reverse" : "x"}
            index={this.state.tabIndex}
            onChangeIndex={this.handChangeIndex}
            className={classes.SwipeableViews}
          >
            <Register />
            <Login />
          </SwipeableViews>
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  error: state.errors.error,
  lang: state.menu.lang
});

export default connect(mapStateToProps)(
  withStyles(styles, { withTheme: true })(Auth)
);
