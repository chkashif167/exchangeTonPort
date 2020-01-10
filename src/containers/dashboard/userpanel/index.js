import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { countryList } from "../../../constants/country.json";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { Button, Container } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Security from "@material-ui/icons/Security";
import Email from "@material-ui/icons/Email";
import Divider from "@material-ui/core/Divider";
import { typography } from "@material-ui/system";
import axios from "axios";
import config from "../../../config/config";
import Image from "material-ui-image";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import validator from "validator";
import { NotificationManager } from "react-notifications";
import ProfileDefaultImg from "../../../assets/profile_default.jpg";
import BackLink from "../../../components/backline";
import { connect } from "react-redux";
import t from "../../../constants/language";
import Payment from "@material-ui/icons/Payment";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  toolbar: theme.mixins.toolbar,
  formGroup: {
    maxWidth: 320,
    padding: 16
  },
  formControl: {
    margin: theme.spacing(1)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
    // width: 400,
  },
  card: {
    maxWidth: 400,
    minWidth: 240
  },
  cardheader: {
    backgroundColor: "#3f51b5",
    color: "#fff"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  dialog: {
    maxWidth: 500
  }
});
class UserPanel extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gender: "male",
      lastname: "",
      firstname: "",
      languageforCorrespondance: "",
      email: "",
      phonenumber: "",

      address: "",
      address2: "",
      postCode: "",
      townCity: "",
      country: "",

      profilePicture: "",
      count: 0,
      resetPwdDlg: false,
      oldPassword: "",
      newPassword: "",
      newPassword2: "",
      isValidPassword2: true,

      newEmail: "",
      changeEmailDlg: false,
      newEmailValid: true,

      acceptCount: 0
    };
  }

  componentDidMount() {
    this.getProfileInfo();
  }

  saveProfileInfo = () => {
    const {
      gender,
      lastname,
      firstname,
      languageforCorrespondance,
      email,
      phonenumber,

      address,
      address2,
      postCode,
      townCity,
      country,
      profilePicture
    } = this.state;

    axios
      .request({
        url: "/api/dashboard/profile",
        baseURL: config.apiBaseUrl,
        method: "PUT",
        data: {
          lastname: lastname,
          firstname: firstname,
          email: email,

          gender: gender,
          languageforCorrespondance: languageforCorrespondance,
          phonenumber: phonenumber,

          address: address,
          address2: address2,
          postCode: postCode,
          townCity: townCity,
          country: country

          // profilePicture: profilePicture
        }
      })
      .then(res => {
        console.log("saveProfile", res);
        NotificationManager.success(
          t[this.props.lang].profile_saved_successfully
        );
      })
      .catch(err => {
        console.log("saveProfile Error", err);
        NotificationManager.error(t[this.props.lang].failed_to_save_profile);
      });
  };

  getProfileInfo = () => {
    console.log("get profile started");

    axios
      .request({
        url: "/api/dashboard/profile",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("get Profile", res.data);
        this.setState({
          lastname: res.data.user_id.lastname,
          firstname: res.data.user_id.firstname,
          email: res.data.user_id.email,
          phonenumber: res.data.user_id.phonenumber,

          gender: res.data.gender,
          languageforCorrespondance: res.data.languageforCorrespondance,

          address: res.data.address,
          address2: res.data.address2,
          postCode: res.data.postCode,
          townCity: res.data.townCity,
          country: res.data.country,

          profilePicture: res.data.avatar
            ? config.apiBaseUrl + res.data.avatar
            : "",
          acceptCount: res.data.acceptCount
        });
      })
      .catch(err => {
        console.log("get profile error", err);
      });
  };

  handleTextInput = input => e => {
    this.setState({ [input]: e.target.value }, function() {
      if ([input] == "newPassword2") {
        if (this.state.newPassword === this.state.newPassword2) {
          this.setState({ isValidPassword2: true });
        } else {
          this.setState({ isValidPassword2: false });
        }
      }
    });
  };

  handleBirthOfDate = (data, val) => {
    console.log("tag", val);
    this.setState({ dateOfBirth: val });
  };

  selectCountry(val) {
    this.setState({ nationality: val });
  }

  handleSelectedAvatar = event => {
    if (event.target.files.length === 0) {
      return;
    }
    // this.setState({ selectedFile: event.target.files[0]});
    // this.getPreviewData(event.target.files[0]);

    let uploadFile = event.target.files[0];
    const data = new FormData();
    data.append("file", uploadFile);
    axios
      .request({
        url: "/api/dashboard/avatar",
        baseURL: config.apiBaseUrl,
        method: "post",
        data: data,
        onUploadProgress: progressEvent => {
          var percent = (progressEvent.loaded * 100) / progressEvent.total;
          // this.setState({ upload_progress: percent });
        }
      })
      .then(res => {
        this.setState({
          profilePicture: config.apiBaseUrl + res.data.path,
          count: this.state.count + 1
        });
        this.props.dispatch({
          type: "AVATAR_CHANGED",
          payload: res.data.path + "?" + this.state.count
        });
      })
      .catch(err => {
        console.log("avatar err", err);
      });
  };

  handleEmailDlgClose = () => {
    this.setState({ changeEmailDlg: !this.state.changeEmailDlg });
  };

  handleEmailChange = () => {
    if (!this.state.newEmail) return;
    if (!validator.isEmail(this.state.newEmail)) {
      this.setState({ newEmailValid: false });
      return;
    }
    axios
      .request({
        url: "/api/dashboard/changeemail",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: { email: this.state.newEmail }
      })
      .then(res => {
        console.log("email changing", res.data);
        this.setState({ email: res.data.email, changeEmailDlg: false });
        NotificationManager.success(t[this.props.lang].success);
      })
      .catch(err => {
        console.log("email changing err", err);
        NotificationManager.error(t[this.props.lang].failed);
      });
  };

  handlePasswordClose = () => {
    this.setState({ resetPwdDlg: !this.state.resetPwdDlg });
  };

  handlePasswordChange = () => {
    if (this.state.newPassword2.length > 0 && this.state.isValidPassword2) {
      const passwordData = {
        oldPassword: this.state.oldPassword,
        newPassword: this.state.newPassword
      };
      axios
        .request({
          url: "/api/dashboard/passwordchange",
          baseURL: config.apiBaseUrl,
          method: "post",
          data: passwordData
        })
        .then(res => {
          NotificationManager.success(t[this.props.lang].password_changed);
          this.handlePasswordClose();
        })
        .catch(err => {
          console.log("password changing err", err);
          NotificationManager.error(
            t[this.props.lang].password_change_is_failed
          );
        });
      // this.handlePasswordClose();
    }
  };

  render() {
    const { classes } = this.props;
    const {
      gender,
      lastname,
      firstname,
      languageforCorrespondance,
      email,
      phonenumber,

      address,
      address2,
      postCode,
      townCity,
      country,
      profilePicture,
      resetPwdDlg,
      oldPassword,
      newPassword,
      newPassword2,
      isValidPassword2,
      changeEmailDlg,
      newEmail,
      newEmailValid
    } = this.state;
    return (
      <div className={classes.content}>
        <div className={classes.toolbar} />
        <Grid container>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <FormGroup className={classes.formGroup}>
              <h1>{t[this.props.lang].profil}</h1>
              <FormControl required className={classes.formControl}>
                <InputLabel htmlFor="">
                  {t[this.props.lang].civility}
                </InputLabel>
                <Select
                  value={gender}
                  onChange={this.handleTextInput("gender")}
                >
                  <MenuItem value="Mr">{t[this.props.lang].mr}</MenuItem>
                  <MenuItem value="Mrs">{t[this.props.lang].mrs}</MenuItem>
                  <MenuItem value="Ms">{t[this.props.lang].ms}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                required
                id="firstname"
                label={t[this.props.lang].first_name}
                placeholder={t[this.props.lang].enter_your_first_name}
                className={classes.textField}
                margin="normal"
                value={firstname}
                onChange={this.handleTextInput("firstname")}
              />

              <TextField
                required
                id="lastname"
                label={t[this.props.lang].last_name}
                placeholder={t[this.props.lang].last_name}
                className={classes.textField}
                margin="normal"
                value={lastname}
                onChange={this.handleTextInput("lastname")}
              />

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="languageforcorrespond">
                  {t[this.props.lang].language}
                </InputLabel>
                <Select
                  value={languageforCorrespondance}
                  onChange={this.handleTextInput("languageforCorrespondance")}
                >
                  <MenuItem value="english">
                    {t[this.props.lang].english}
                  </MenuItem>
                  <MenuItem value="french">
                    {t[this.props.lang].french}
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                required
                id="email"
                label={t[this.props.lang].email}
                placeholder={t[this.props.lang].enter_your_email}
                className={classes.textField}
                margin="normal"
                InputProps={{
                  readOnly: true
                }}
                value={email}
                onChange={this.handleTextInput("email")}
              />

              <TextField
                required
                id="phonenumber"
                label={t[this.props.lang].phone_number}
                placeholder={t[this.props.lang].enter_your_phone_number}
                className={classes.textField}
                margin="normal"
                value={phonenumber}
                onChange={this.handleTextInput("phonenumber")}
              />

              <br />
              <h1 style={{ marginBottom: 0 }}>{t[this.props.lang].address}</h1>
              <TextField
                id="address"
                label={t[this.props.lang].address}
                placeholder={t[this.props.lang].enter_your_addres}
                className={classes.textField}
                margin="normal"
                value={address}
                onChange={this.handleTextInput("address")}
              />

              <TextField
                id="address2"
                label={t[this.props.lang].address2}
                placeholder={t[this.props.lang].enter_your_addres}
                className={classes.textField}
                margin="normal"
                value={address2}
                onChange={this.handleTextInput("address2")}
              />

              <TextField
                id="postcode"
                label={t[this.props.lang].postcode}
                placeholder={t[this.props.lang].enter_your_postcode}
                className={classes.textField}
                margin="normal"
                value={postCode}
                onChange={this.handleTextInput("postCode")}
              />

              <TextField
                id="towncity"
                label={t[this.props.lang].town_city}
                placeholder={t[this.props.lang].enter_your_city}
                className={classes.textField}
                margin="normal"
                value={townCity}
                onChange={this.handleTextInput("townCity")}
              />

              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="">{t[this.props.lang].country}</InputLabel>
                <Select
                  value={country}
                  onChange={this.handleTextInput("country")}
                >
                  {countryList.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.name[0]}>
                        {item.name[this.props.lang]}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  style={{ marginLeft: 16 }}
                  onClick={this.saveProfileInfo}
                >
                  {t[this.props.lang].save_my_profile}
                </Button>
              </div>
            </FormGroup>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                margin: 16
              }}
            >
              <Card className={classes.card}>
                <CardHeader
                  title={t[this.props.lang].profile_picture}
                  className={classes.cardheader}
                />
                <CardContent
                  style={{
                    margin: 20,
                    display: "flex",
                    justifyContent: "center"
                  }}
                >
                  <Image
                    alt="avatar img"
                    src={
                      this.state.profilePicture
                        ? this.state.profilePicture + "?" + this.state.count
                        : ProfileDefaultImg
                    }
                    imageStyle={{
                      width: 180,
                      height: "auto",
                      position: "relative"
                      // maxWidth: 200,
                      // maxHeight: 300
                    }}
                    style={{ paddingTop: 0 }}
                  />
                </CardContent>
                <CardActions
                  disableSpacing
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    component="label"
                    className={classes.button}
                    style={{ marginBottom: 20 }}
                  >
                    <input
                      accept="Image/*"
                      style={{ display: "none" }}
                      type="file"
                      onChange={this.handleSelectedAvatar}
                    />
                    {t[this.props.lang].add_profile_picture}
                  </Button>
                </CardActions>
              </Card>
              <br />
              <Card className={classes.card}>
                <CardHeader
                  title={t[this.props.lang].security}
                  className={classes.cardheader}
                  avatar={<Security />}
                />
                <CardContent>
                  <h4>{t[this.props.lang].password}</h4>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.setState({ resetPwdDlg: true })}
                  >
                    {t[this.props.lang].change_password}
                  </Button>
                  <Dialog
                    open={resetPwdDlg}
                    onClose={this.handlePasswordClose}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      {t[this.props.lang].change_password}
                    </DialogTitle>
                    <DialogContent>
                      {/* <DialogContentText>
                      To subscribe to this website, please enter your email
                      address here. We will send updates occasionally.
                    </DialogContentText> */}
                      <TextField
                        margin="dense"
                        id="name"
                        label={t[this.props.lang].old_password}
                        type="password"
                        fullWidth
                        value={oldPassword}
                        onChange={this.handleTextInput("oldPassword")}
                      />
                      <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label={t[this.props.lang].new_password}
                        type="password"
                        fullWidth
                        value={newPassword}
                        onChange={this.handleTextInput("newPassword")}
                      />
                      <TextField
                        margin="dense"
                        id="name"
                        label={t[this.props.lang].confirm_password}
                        type="password"
                        fullWidth
                        error={!isValidPassword2}
                        value={newPassword2}
                        onChange={this.handleTextInput("newPassword2")}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button
                        onClick={this.handlePasswordChange}
                        color="primary"
                      >
                        {t[this.props.lang].change}
                      </Button>
                      {/* <Button onClick={this.handlePasswordClose} color="primary">
                      Cancel
                    </Button> */}
                    </DialogActions>
                  </Dialog>
                </CardContent>
              </Card>
              <br />
              <Card className={classes.card}>
                <CardHeader
                  title={t[this.props.lang].email}
                  className={classes.cardheader}
                  avatar={<Email />}
                />
                <CardContent>
                  <p>{email}</p>
                  <Button
                    variant="outlined"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.setState({ changeEmailDlg: true })}
                  >
                    {t[this.props.lang].change_email}
                  </Button>
                  <Dialog
                    open={changeEmailDlg}
                    onClose={this.handleEmailDlgClose}
                    aria-labelledby="form-dialog-title"
                  >
                    <DialogTitle id="form-dialog-title">
                      Change Email
                    </DialogTitle>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label={t[this.props.lang].new_email}
                        fullWidth
                        value={newEmail}
                        onChange={this.handleTextInput("newEmail")}
                        error={!newEmailValid}
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={this.handleEmailChange} color="primary">
                        {t[this.props.lang].change}
                      </Button>
                      {/* <Button onClick={this.handlePasswordClose} color="primary">
                      Cancel
                    </Button> */}
                    </DialogActions>
                  </Dialog>
                </CardContent>
                {/* <Divider /> */}
              </Card>
              <br />
              <Card className={classes.card}>
                <CardHeader
                  title={t[this.props.lang].payment}
                  className={classes.cardheader}
                  avatar={<Payment />}
                />
                <CardContent>
                  <p>{t[this.props.lang].payment_desc}</p>
                </CardContent>
              </Card>
            </div>
          </Grid>
        </Grid>
        <BackLink />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(UserPanel));
