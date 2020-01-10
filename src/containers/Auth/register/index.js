import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import { withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { registerUser } from "../../../actions/authActions";
import validator from "validator";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import t from "../../../constants/language";
import FormControl from "@material-ui/core/FormControl";
import { bindActionCreators } from "redux";
import * as types from "../../../actions/types";
import axios from "axios";
import setAuthToken from "../../../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import config from "../../../config/config";
import { NotificationManager } from "react-notifications";
const styles = theme => ({
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
    // width: 400,
  },
  container: {
    // flexGrow: 1,
    //  maxWidth: 600,
  },
  checkbox: {
    marginLeft: -2,
    marginTop: 4
  }
});
class Register extends Component {
  constructor() {
    super();
    this.state = {
      firstname: "",
      lastname: "",
      email: "",
      phonenumber: "",
      password: "",
      password2: "",
      errors: {
        firstname: "",
        lastname: "",
        email: "",
        phonenumber: "",
        password: "",
        password2: ""
      },
      clicked: false,
      checkedAgree: false
    };
  }

  validation = () => {
    const {
      firstname,
      lastname,
      phonenumber,
      email,
      password,
      password2
    } = this.state;

    const errors = {};
    let isError = false;
    if (firstname.length < 3) {
      isError = true;
      errors.firstname = "Firstname must be more than 3 letters";
    }
    if (lastname.length < 3) {
      isError = true;
      errors.lastname = "Lastname must be more than 3 letters";
    }
    if (!validator.isEmail(email)) {
      isError = true;
      errors.email = "Invalid email";
    }
    // if (!validator.isMobilePhone(phonenumber)) {
    //   isError = true;
    //   errors.phonenumber = "Invalid phonenumber";
    // }
    if (password.length < 6) {
      isError = true;
      errors.password = "password must be more than 6 letters";
    }
    if (!validator.equals(password, password2) || password2.length < 1) {
      isError = true;
      errors.password2 = "password is not matched";
    }
    this.setState({ errors: errors });
    return !isError;
  };

  handleTextInput = input => e => {
    this.setState({ [input]: e.target.value }, function() {
      if (this.state.clicked) this.validation();
    });
  };

  handleAgreeTerm = () => {
    this.setState({ checkedAgree: !this.state.checkedAgree });
  };
  onSubmit = () => {
    this.setState({ clicked: true });
    if (!this.validation()) {
      return;
    }
    const newUser = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      phonenumber: this.state.phonenumber,
      password: this.state.password,
      password2: this.state.password2
    };
    this.registerUser(newUser, this.props.history);
  };

  registerUser = (userData, history) => {
    this.props.dispatch({ type: types.USER_LOADING, payload: true });
    axios
      .request({
        url: "/api/users/register",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: userData
      })
      .then(response => {
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        this.props.dispatch({
          type: types.SET_CURRENT_USER,
          payload: decoded
        });
        history.push("/dashboard");
      })
      .catch(err => {
        console.log("err", err);
        try {
          if (err.response.data.title === "Email") {
            NotificationManager.error("Email already exist"); // multi - language
          }
        } catch (err) {
          NotificationManager.error("Server error");
        }
        this.props.dispatch({ type: types.USER_LOADING, payload: false });
      });
  };
  render() {
    const {
      errors,
      firstname,
      lastname,
      phonenumber,
      email,
      password,
      password2
    } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <FormGroup>
          <TextField
            required
            id="firstname"
            label={t[this.props.lang].first_name}
            placeholder={t[this.props.lang].enter_your_first_name}
            className={classes.textField}
            margin="normal"
            error={errors.firstname ? true : false}
            value={firstname}
            onChange={this.handleTextInput("firstname")}
          />
          {/* <FormHelperText id="firstname" error>requried</FormHelperText> */}

          <TextField
            required
            id="lastname"
            label={t[this.props.lang].last_name}
            placeholder={t[this.props.lang].enter_your_last_name}
            className={classes.textField}
            margin="normal"
            error={errors.lastname ? true : false}
            value={lastname}
            onChange={this.handleTextInput("lastname")}
          />

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
          />

          <TextField
            required
            id="password2"
            label={t[this.props.lang].confirm_password}
            type="password"
            placeholder={t[this.props.lang].confirm_password}
            className={classes.textField}
            margin="normal"
            error={errors.password2 ? true : false}
            value={password2}
            onChange={this.handleTextInput("password2")}
          />

          <TextField
            required
            id="phone"
            label={t[this.props.lang].phone_number}
            // type="number"
            placeholder={t[this.props.lang].enter_your_phone_number}
            className={classes.textField}
            margin="normal"
            error={errors.phonenumber ? true : false}
            value={phonenumber}
            onChange={this.handleTextInput("phonenumber")}
          />

          <FormControl>
            <FormControlLabel
              className={classes.checkbox}
              control={
                <Checkbox
                  checked={this.state.checkedAgree}
                  onChange={this.handleAgreeTerm}
                  value="AgreeTerm"
                  color="primary"
                />
              }
              required
              label={
                <span>
                  <span>{t[this.props.lang].i_accept} </span>
                  <a href="/#/terms" target="_blank">
                    {t[this.props.lang].terms}
                  </a>
                </span>
              }
            />
          </FormControl>
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
            disabled={this.props.loading || !this.state.checkedAgree}
            color="primary"
            onClick={this.onSubmit}
          >
            {t[this.props.lang].register}
          </Button>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  lang: state.menu.lang
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    ...bindActionCreators({ registerUser }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withRouter(Register)));
