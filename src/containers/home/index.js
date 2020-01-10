import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Register from "../Auth/register";
import Login from "../Auth/login";
import Paper from "@material-ui/core/Paper";
import { connect } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
import ToastContent from "../../components/Toast";
import { isAuthenticated } from "../../service/authentication";
import axios from "axios";
import config from "../../config/config";
import * as types from "../../actions/types";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import setAuthToken from "../../utils/setAuthToken";
import { logoutUser } from "../../actions/authActions";
import Payment from "../../components/payment";
import Congratulation from "../home/congratulation";
import Header from "../../components/header";
import Auth from "../Auth";
import { Container } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Image from "material-ui-image";
import Landing from '../Landing/index'
import Background from "../../assets/more1.jpg";
const styles = theme => ({
  root:{
      // backgroundImage:
      //   'url('+Background+')',
      //   backgroundPosition: 'center',
      //   backgroundSize: 'cover',
      //   backgroundRepeat: 'no-repeat',
      //   height: '100vh'
  },
  content: {
    flexGrow: 1
    // padding: theme.spacing(1)
  },
  toolbar: theme.mixins.toolbar
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loginDlg: false
    };

    if (isAuthenticated()) {
      const jwtToken = localStorage.getItem("jwtToken");
      console.log("authed", jwtToken);
      setAuthToken(jwtToken);

      // axios
      //   .request({
      //     url: "/api/users/currentstep",
      //     baseURL: config.apiBaseUrl,
      //     method: "get"
      //   })
      //   .then(res => {
      //     console.log("currentStep", res);
      //     //   this.setState({ boatinfoArray: res.data.currentStep });
      //     this.props.dispatch({
      //       type: types.CURRENT_STEP,
      //       payload: res.data.step
      //     });
      //     if(res.data.step > 4) {
      //       this.props.historyhistory.push("/dashboard");shboard")
      //     }
      //   })
      //   .catch(err => {
      //     console.log("get CurrentStep", err);
      //   });
    }
  }

  handleClose = () => {
    this.props.dispatch({ type: "CLOSE_TOAST" });
    // this.props.error = null;
  };
  handleLoginClose = () => {
    this.setState({ loginDlg: false });
  };
  handleLogin = () => {
    this.setState({ loginDlg: true });
  };
  handleLogout = () => {
    this.props.logout(this.props.history);
  };
  render() {
    const { classes } = this.props;
    const { loginDlg } = this.state;
    return (
      <div className={classes.root}>
        <Header
          menuOn={false}
          logo={{ name: "EXCHANGE TON PORT", title: "" }}
        />
        <main className={classes.content}>
          <div className={classes.toolbar} />
          {/* <Grid container direction="row" justify="flex-start" spacing={0}>
            <Grid item xs={6}>
              <Image alt="background image" src={backgroundImg} style={{width:'100%', height:'auto'}}/>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 30
                }}
              >
                <Auth />
              </div>
            </Grid>
          </Grid> */}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              
            }}
          >
            <Landing />
          </div>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            // key={`${vertical},${horizontal}`}
            open={this.props.openToast}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            autoHideDuration={3000}
          >
            <ToastContent
              message={this.props.error.message}
              onClose={this.handleClose}
              variant="warning"
            />
          </Snackbar>
        </main>
        
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.errors.error,
  openToast: state.errors.openToast
});

const mapDispatchToProps = dispatch => {
  return {
    logout: history => {
      dispatch(logoutUser(history));
    },
    dispatch
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Home));
