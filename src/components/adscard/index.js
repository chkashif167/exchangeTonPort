import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Button from "@material-ui/core/Button";
import { Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { KeyboardDatePicker, DatePicker } from "@material-ui/pickers";
import axios from "axios";
import config from "../../config/config";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../constants/language";
import { SettingsBackupRestore, DeleteSweep } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

const styles = theme => ({
  card: {
    maxWidth: 420,
    [theme.breakpoints.up("md")]: {
      minWidth: 400
    },
    [theme.breakpoints.down("md")]: {
      minWidth: 330
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 280
    },
    [theme.breakpoints.down("540")]: {
      minWidth: 270
    },
    [theme.breakpoints.down(400)]: {
      minWidth: 250
    }
  },
  cardheader: {
    backgroundColor: "#009688",
    color: "#fff"
  },
  cardheader_deleted: {
    backgroundColor: "#888",
    color: "#ccc"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  buttonSave: {
    margin: theme.spacing(1),
    backgroundColor: "#009688",
    color: "#fff"
  },
  buttonEdit: {
    margin: theme.spacing(1),
    backgroundColor: "#ec407a",
    color: "#fff"
  },

  cardGrid: {
    padding: 20,
    paddingBottom: 4
  },
  cardContent: {
    wordWrap: "break-word"
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
});

class AdsCard extends Component {
  constructor(props) {
    super(props);
    const { adsInfo } = this.props;
    this.state = {
      adsType: adsInfo.adsType,
      boatName: adsInfo.boatName,
      arrivalDate: adsInfo.arrivalDate,
      leaveDate: adsInfo.leaveDate,
      harbour: adsInfo.harbour, //my harbour
      destHarbour: adsInfo.destHarbour,
      status: adsInfo.status,

      editing: this.props.createMode ? true : false,
      boatNames: []
    };
  }

  componentDidMount() {
    this.getBoatNames();
  }
  componentWillReceiveProps(newProps) {
    const { adsInfo } = newProps;
    this.state = {
      adsType: adsInfo.adsType,
      boatName: adsInfo.boatName,
      arrivalDate: adsInfo.arrivalDate,
      leaveDate: adsInfo.leaveDate,
      harbour: adsInfo.harbour, //my harbour
      destHarbour: adsInfo.destHarbour,
      status: adsInfo.status
    };
    this.getBoatNames();
  }
  handleEditButton = () => {
    if (this.state.editing) {
      // process on save button click.
      const {
        adsType,
        boatName,
        arrivalDate,
        leaveDate,
        harbour,
        destHarbour
      } = this.state;

      if (
        !adsType ||
        !boatName ||
        !arrivalDate ||
        !leaveDate ||
        (adsType === "offer" && !harbour) ||
        (adsType === "demand" && !destHarbour) ||
        (adsType === "exchange" && (!harbour || !destHarbour))
      ) {
        NotificationManager.warning(t[this.props.lang].wrong_input);
        return;
      }

      const newAds = {
        adsType: adsType,
        boatName: boatName,
        arrivalDate: arrivalDate,
        leaveDate: leaveDate,
        harbour: harbour, //my harbour
        destHarbour: destHarbour
      };

      if (adsType === "offer") {
        newAds.destHarbour = "";
      }
      if (adsType === "demand") {
        newAds.harbour = "";
      }

      if (this.props.createMode) {
        this.props.saveAdsInfo(newAds);
        return;
      } else this.props.saveAdsInfo(this.props.adsIndex, newAds);
    }
    this.setState({ editing: !this.state.editing });
  };

  getBoatNames = () => {
    axios
      .request({
        url: "/api/dashboard/boatnames",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("get boatname", res);
        this.setState({
          boatNames: res.data.boatNames,
          boatName: res.data.boatNames[0],
          harbour: res.data.boatHarbours[0]
        });
      })
      .catch(err => {
        console.log("get boatnames err", err);
        // alert("getAdsinfo Error", err);
      });
  };

  handleEdit = input => e => {
    if ([input] == "adsType" && !this.state.editing) return;
    this.setState({ [input]: e.target.value });
  };

  handleArrivalDate = val => {
    this.setState({ arrivalDate: val });
  };

  handleLeaveDate = val => {
    this.setState({ leaveDate: val });
  };

  render() {
    const { classes } = this.props;
    const {
      adsType,
      boatName,
      arrivalDate,
      leaveDate,
      harbour,
      destHarbour,
      status,

      editing
    } = this.state;
    console.log("123", status);
    return (
      <Card className={classes.card}>
        <CardHeader
          title={t[this.props.lang].ads}
          className={
            status === "active"
              ? classes.cardheader
              : classes.cardheader_deleted
          }
          action={
            !this.props.createMode && (
              <>
                {status === "active" ? (
                  <IconButton
                    onClick={() => {
                      this.props.delete(this.props.adsIndex);
                    }}
                  >
                    <DeleteSweep style={{ color: "#f00" }} />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => {
                      this.props.restore(this.props.adsIndex);
                    }}
                  >
                    <SettingsBackupRestore style={{ color: "#fff" }} />
                  </IconButton>
                )}
              </>
            )
          }
        />
        <Grid
          container
          direction="column"
          justify="flex-start"
          spacing={1}
          className={classes.cardGrid}
        >
          <Grid item>
            <FormControl className={classes.formControl}>
              <RadioGroup
                name="adstype"
                className={classes.group}
                value={adsType}
                onChange={this.handleEdit("adsType")}
                row
              >
                <FormControlLabel
                  value="offer"
                  control={<Radio />}
                  label={t[this.props.lang].offer}
                />
                <FormControlLabel
                  value="demand"
                  control={<Radio />}
                  label={t[this.props.lang].demand}
                />
                <FormControlLabel
                  value="exchange"
                  control={<Radio />}
                  label={t[this.props.lang].exchange}
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={5}>
                <strong>{t[this.props.lang].boat}*</strong>
              </Grid>
              <Grid item xs={7}>
                <InputLabel required className={classes.formControl}>
                  <Select
                    value={boatName}
                    onChange={this.handleEdit("boatName")}
                    readOnly={!editing}
                  >
                    {this.state.boatNames &&
                      this.state.boatNames.map((item, index) => {
                        return (
                          <MenuItem value={item} key={index}>
                            {item}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </InputLabel>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={5}>
                <strong>{t[this.props.lang].arrival}*</strong>
              </Grid>
              <Grid item xs={7}>
                <DatePicker
                  className={classes.formControl}
                  disablePast
                  // format="yyyy/MM/dd"
                  format="dd/MM/yyyy"
                  views={["year", "month", "date"]}
                  placeholder="01/07/2019"
                  value={arrivalDate}
                  onChange={value => this.handleArrivalDate(value)}
                  // disabled={!editing}
                  cancelLabel={t[this.props.lang].cancel}
                  okLabel={t[this.props.lang].ok}
                  clearLabel={t[this.props.lang].clear}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              container
              direction="row"
              justify="flex-start"
              alignItems="center"
              spacing={1}
            >
              <Grid item xs={5}>
                <strong>{t[this.props.lang].return}*</strong>
              </Grid>
              <Grid item xs={7}>
                <DatePicker
                  className={classes.formControl}
                  disablePast
                  // format="yyyy/MM/dd"
                  format="dd/MM/yyyy"
                  views={["year", "month", "date"]}
                  placeholder="31/07/2019"
                  value={leaveDate}
                  onChange={value => this.handleLeaveDate(value)}
                  disabled={!editing}
                  cancelLabel={t[this.props.lang].cancel}
                  okLabel={t[this.props.lang].ok}
                  clearLabel={t[this.props.lang].clear}
                  minDate={arrivalDate}
                />
              </Grid>
            </Grid>
          </Grid>
          {adsType !== "demand" && (
            <Grid item>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={5}>
                  <strong>{t[this.props.lang].harbour}*</strong>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    value={harbour}
                    onChange={this.handleEdit("harbour")}
                    InputProps={{
                      readOnly: !editing
                    }}
                    placeholder="Lorem ipsum"
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          {adsType !== "offer" && (
            <Grid item>
              <Grid
                container
                direction="row"
                justify="flex-start"
                alignItems="center"
                spacing={1}
              >
                <Grid item xs={5}>
                  <strong>{t[this.props.lang].destHarbour}*</strong>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    value={destHarbour}
                    onChange={this.handleEdit("destHarbour")}
                    InputProps={{
                      readOnly: !editing
                    }}
                    placeholder={t[this.props.lang].destination_example}
                  />
                </Grid>
              </Grid>
            </Grid>
          )}
          <br />
          <Divider />
          <Grid item>
            <Grid
              container
              direction="row"
              justify="center"
              alignItems="center"
              spacing={1}
            >
              <Grid item>
                <Button
                  style={{ marginTop: 10 }}
                  variant="contained"
                  className={!editing ? classes.buttonSave : classes.buttonEdit}
                  onClick={this.handleEditButton}
                  disabled={status === "deleted"}
                >
                  {!editing
                    ? t[this.props.lang].edit_btn
                    : t[this.props.lang].save_btn}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* </CardContent> */}
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(AdsCard));
