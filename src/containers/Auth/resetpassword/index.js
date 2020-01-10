import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import validator from "validator";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import config from "../../../config/config";
import { NotificationManager } from "react-notifications";

const styles = theme => ({
  paper: {
    padding: 20,
    alignItems: "center",
    maxWidth: 400
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});
class ResetPassword extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      isAbleReset: false,
      isResetSuccessed: false,
    };
  }

  componentDidMount() {
    console.log("token", this.props.match.params.token);
    axios
      .request({
        url: "/api/users/resetpassword",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: { token: this.props.match.params.token }
      })
      .then(res => {
        console.log("resetpassword1", res);
        this.setState({ isAbleReset: true });
        // NotificationManager.success("We sent a message to your password.");
      })
      .catch(err => {
        console.log("forgotpassword err", err);
        this.setState({ isAbleReset: false });
        // NotificationManager.error("Failed. Please try again.");
      });
  }

  handleTextInput = input => e => {
    this.setState({ [input]: e.target.value });
  };

  onSubmit = () => {
    if (!this.state.password) {
      NotificationManager.warning("Please type your password");
      return;
    }

    axios
      .request({
        url: "/api/users/resetpassword",
        baseURL: config.apiBaseUrl,
        method: "PUT",
        data: {
          newPassword: this.state.password,
          token: this.props.match.params.token
        }
      })
      .then(res => {
        console.log("resetpassword", res);
        NotificationManager.success("Reset password successfully.");
        this.setState({isResetSuccessed: true});
      })
      .catch(err => {
        console.log("resetpassword err", err);
        NotificationManager.error("Failed. Please try again.");
      });
  };

  backToLogin = () => {
      this.props.history.push("/");
  }
  render() {
    const { password, isAbleReset, isResetSuccessed } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <Container maxWidth="sm" className={classes.container}>
          <div>
            <h1>Reset your password</h1>
          </div>
          {isAbleReset ? (
            <Paper className={classes.paper}>
              <p>Enter your new password.</p>
              <FormGroup>
                <TextField
                  required
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="new password"
                  className={classes.textField}
                  margin="normal"
                  value={password}
                  onChange={this.handleTextInput("password")}
                />
              </FormGroup>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  paddingTop: 10
                }}
              >
              {!isResetSuccessed ?
                <Button
                  variant="contained"
                //   disabled={this.props.loading}
                  color="primary"
                  onClick={this.onSubmit}
                >
                  Reset Password
                </Button>
                :
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={this.backToLogin}
                >
                  Back To Login
                </Button>
              }
              </div>
            </Paper>
          ) : (
            <Paper className={classes.paper}>
              <p>Something went wrong.</p>
              <p>Please try again.</p>
            </Paper>
          )}
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(ResetPassword));
