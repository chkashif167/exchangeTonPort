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
    alignItems: 'center',
    maxWidth: 400,
  },
  container: {
    display: 'flex',
    flexDirection:'column',
    justifyContent:'center',
    alignItems: 'center',
  }
  
});
class ForgotPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      is_valid: true,
      clicked: false
    };
  }

  componentDidMount() {}

  validation = () => {
    const { email } = this.state;
    let is_valid = false;
    if (validator.isEmail(email)) {
      is_valid = true;
    }
    this.setState({ is_valid: is_valid });
    return is_valid;
  };

  handleTextInput = input => e => {
    this.setState({ [input]: e.target.value }, function() {
      if (this.state.clicked) this.validation();
    });
  };

  onSubmit = () => {
    this.setState({ clicked: true });
    if (!this.validation()) {
      return;
    }

    axios
    .request({
      url: "/api/users/forgotpassword",
      baseURL: config.apiBaseUrl,
      method: "POST",
      data: {email: this.state.email}
    })
    .then(res => {
      console.log("forgotpassword", res);
      NotificationManager.success("We sent a message to your email.");
    })
    .catch(err => {
      console.log("forgotpassword err", err);
      NotificationManager.error("Failed. Please try again.");
    });
  };

  render() {
    const { email, is_valid } = this.state;
    const { classes } = this.props;
    return (
      <div >
      <Container maxWidth="sm" className={classes.container}>
        <div>
          <h1>Forgot </h1>
        </div>
        <Paper className={classes.paper}>
          <p>
            Enter your email address and we will send you a link to reset your
            password.
          </p>
          <FormGroup>
            <TextField
              required
              id="email"
              label="Email"
              type="email"
              placeholder="Enter your Email address"
              className={classes.textField}
              margin="normal"
              error={!is_valid}
              value={email}
              onChange={this.handleTextInput("email")}
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
            <Button
              variant="contained"
              disabled={this.props.loading}
              color="primary"
              onClick={this.onSubmit}
            >
              Send password reset email
            </Button>
          </div>
        </Paper>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.menu.lang
});

export default withStyles(styles)(withRouter(ForgotPassword));
