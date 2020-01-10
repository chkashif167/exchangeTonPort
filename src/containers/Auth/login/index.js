import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import validator from "validator";
import { loginUser } from "../../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { saveLoginInfo, LoadLoginInfo } from "../../../service/authentication";
import t from "../../../constants/language";
import * as types from "../../../actions/types";
import axios from "axios";
import setAuthToken from "../../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import config from "../../../config/config";
import { NotificationManager } from "react-notifications";
const styles = theme => ({
  content: {
    // flexGrow: 1,
    // // padding: theme.spacing(2),
    // // minWidth: 280,
    // [theme.breakpoints.up("sm")]: {
    //   minWidth: 480
    // },
    // [theme.breakpoints.down("sm")]: {
    //   minWidth: 190
    // }
    // minWidth: 190
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
    // width: 400,
  },
  checkbox: {
    marginLeft: -2,
    marginTop: 4,
    color: "#303f9f"
  },
  forgot: {
    color: "#303f9f"
  }
});
class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      rememberMe: false,

      errors: {
        email: "",
        password: ""
      },
      clicked: false
    };
  }

  componentDidMount() {
    const logininfo = LoadLoginInfo();
    if (logininfo.email) {
      this.setState({
        email: logininfo.email,
        password: logininfo.password,
        rememberMe: true
      });
    }
  }

  handleClose = () => {
    this.setState({ toastOpen: false });
  };
  validation = () => {
    const { email, password } = this.state;

    const errors = {};
    let isError = false;
    if (!validator.isEmail(email)) {
      isError = true;
      errors.email = "Invalid email";
    }
    if (password.length < 6) {
      isError = true;
      errors.password = "password must be more than 6 letters";
    }
    this.setState({ errors: errors });
    return !isError;
  };

  handleTextInput = input => e => {
    this.setState({ [input]: e.target.value }, function() {
      if (this.state.clicked) this.validation();
    });
  };

  handleRememberMe = () => {
    this.setState({ rememberMe: !this.state.rememberMe });
  };
  onSubmit = () => {
    this.setState({ clicked: true });
    if (!this.validation()) {
      return;
    }

    if (this.state.rememberMe) {
      saveLoginInfo(this.state.email, this.state.password);
    } else {
      saveLoginInfo("", "");
    }

    const newUser = {
      email: this.state.email,
      password: this.state.password
    };
    console.log(newUser);
    this.props.loginUser(newUser, this.props.history);
  };

  loginUser = (userData, history) => {
    this.props.dispatch({ type: types.USER_LOADING, payload: true });
    axios
      .request({
        url: "/api/users/login",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: userData
      })
      .then(res => {
        // Save to localStorage
        // Set token to localStorage
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        // Set token to Auth header
        setAuthToken(token);
        // Decode token to get user data
        const decoded = jwt_decode(token);
        // Set current user
        this.props.dispatch({
          type: types.SET_CURRENT_USER,
          payload: decoded
        });
        this.props.dispatch({ type: types.USER_LOADING, payload: false });
        history.push("/dashboard");
      })
      .catch(err => {
        try {
          if (err.response.data.title === "Email") {
            NotificationManager.error("Email not found");
          }
          if (err.response.data.title === "Password") {
            NotificationManager.error("Password incorrect");
          }
        } catch (err) {
          NotificationManager.error("Server error");
        }
        this.props.dispatch({ type: types.USER_LOADING, payload: false });
      });
  };

  handleKeyDown = e => {
    if (e.keyCode == 13) this.onSubmit();
  };
  render() {
    const { email, password, errors, rememberMe } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.content}>
        <FormGroup>
          <TextField
            required
            id="email"
            label={t[this.props.lang].email}
            type="email"
            placeholder={t[this.props.lang].enter_your_email}
            className={classes.textField}
            margin="normal"
            error={errors.email ? true : false}
            value={email}
            onChange={this.handleTextInput("email")}
          />

          <TextField
            required
            id="password"
            label={t[this.props.lang].password}
            type="password"
            placeholder={t[this.props.lang].enter_your_password}
            className={classes.textField}
            margin="normal"
            error={errors.password ? true : false}
            value={password}
            onChange={this.handleTextInput("password")}
            onKeyDown={this.handleKeyDown}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <FormControlLabel
              className={classes.checkbox}
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={this.handleRememberMe}
                  value="rememberMe"
                  color="primary"
                />
              }
              label={t[this.props.lang].remember_me}
            />

            <a
              href="/#/password_reset"
              target="_blank"
              className={classes.forgot}
            >
              {t[this.props.lang].forgot_password}
            </a>
          </div>
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
            default
          >
            {/* {this.props.loading ? 'Loging in...' : 'Login'} */}
            {t[this.props.lang].login}
          </Button>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  lang: state.menu.lang
});
export default connect(mapStateToProps, { loginUser })(
  withStyles(styles)(withRouter(Login))
);
