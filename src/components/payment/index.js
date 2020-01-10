import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { countryList, months, years } from "../../constants/country.json";
import { Button } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import { typography } from "@material-ui/system";
import axios from "axios";
import config from "../../config/config";
import Image from "material-ui-image";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import LocationOnRounded from "@material-ui/icons/LocationOnRounded";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import * as types from "../../actions/types";
import { connect } from "react-redux";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  formControl: {
    margin: theme.spacing(1),
    marginTop: theme.spacing(2)
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
    padding: 20
  },
  card_selected: {
    backgroundColor: "#eceff1"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
});
class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      payMethod: "card",

      fullname: "",
      billingAddress: "",
      city: "",
      zipCode: "",
      country: "",

      cardHolder: "",
      cardNumber: "",
      expMonth: "",
      expYear: "",
      CVCNumber: ""
    };
  }

  componentDidMount() {}

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

  selectCountry(val) {
    this.setState({ country: val });
  }

  handleProceed = () => {
    axios
      .request({
        url: "/api/users/payment",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: {}
      })
      .then(res => {
        console.log("payment", res);
        this.props.dispatch({
          type: types.CURRENT_STEP,
          payload: res.data.step
        });
      })
      .catch(err => {
        console.log("payment error", err);
      });
  };
  render() {
    const { classes } = this.props;
    const {
      payMethod,
      fullname,
      billingAddress,
      city,
      zipCode,
      country,
      cardHolder,
      cardNumber,
      expMonth,
      expYear,
      CVCNumber
    } = this.state;
    return (
      <main className={classes.content}>
        <h1>Payment</h1>
        <p>Chose payment method below</p>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={2}
        >
          <Grid item xs={6} style={{ minWidth: 280, maxWidth: 480 }}>
            <Paper className={clsx(classes.card, classes.card_selected)}>
              <p>Biling Info</p>
              <FormGroup>
                <TextField
                  required
                  id="fullname"
                  label="FULL NAME"
                  placeholder="John Doe"
                  className={classes.textField}
                  margin="normal"
                  value={fullname}
                  onChange={this.handleTextInput("fullname")}
                />

                <TextField
                  required
                  id="billingaddress"
                  label="BILLING ADDRESS"
                  placeholder="London"
                  className={classes.textField}
                  margin="normal"
                  value={billingAddress}
                  onChange={this.handleTextInput("billingAddress")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="locationOn">
                          <LocationOnRounded />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
                <TextField
                  required
                  id="city"
                  label="CITY"
                  placeholder="LONDON"
                  className={classes.textField}
                  margin="normal"
                  value={city}
                  onChange={this.handleTextInput("city")}
                />
                <TextField
                  required
                  id="zipcode"
                  label="ZIP CODE"
                  placeholder="1234"
                  className={classes.textField}
                  margin="normal"
                  value={zipCode}
                  onChange={this.handleTextInput("zipCode")}
                />
                <FormControl className={classes.formControl} required>
                  <InputLabel htmlFor="age-simple">COUNTRY</InputLabel>
                  <Select
                    value={country}
                    onChange={this.handleTextInput("country")}
                  >
                    {countryList.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item.name}>
                          {item.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </FormGroup>
            </Paper>
          </Grid>
          <Grid item xs={6} style={{ minWidth: 280, maxWidth: 480 }}>
            <Paper className={classes.card}>
              <p>Credit Card Info</p>
              <FormGroup>
                <TextField
                  required
                  id="cardholder"
                  label="CARD HOLDERS"
                  placeholder="John Doe"
                  className={classes.textField}
                  margin="normal"
                  value={cardHolder}
                  onChange={this.handleTextInput("cardHolder")}
                />

                <TextField
                  required
                  id="cardnumber"
                  label="CARD NUMBER"
                  placeholder="1234-1234-1234-1234"
                  className={classes.textField}
                  margin="normal"
                  value={billingAddress}
                  onChange={this.handleTextInput("billingAddress")}
                />
                <FormControl className={classes.formControl} required>
                  <InputLabel>EXP.MONTH</InputLabel>
                  <Select
                    value={expMonth}
                    onChange={this.handleTextInput("expMonth")}
                  >
                    {months.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl} required>
                  <InputLabel>EXP.YEAR</InputLabel>
                  <Select
                    value={expYear}
                    onChange={this.handleTextInput("expYear")}
                  >
                    {years.map((item, index) => {
                      return (
                        <MenuItem key={index} value={item}>
                          {item}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  required
                  id="cvcnumber"
                  label="CVC NUMBER"
                  placeholder="789"
                  className={classes.textField}
                  margin="normal"
                  value={CVCNumber}
                  onChange={this.handleTextInput("CVCNumber")}
                />
              </FormGroup>
            </Paper>
          </Grid>
        </Grid>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 20
          }}
        >
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleProceed}
          >
            PROCEED
          </Button>
        </div>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading
});

export default connect(mapStateToProps)(withStyles(styles)(Payment));
