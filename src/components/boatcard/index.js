import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import TextField from "@material-ui/core/TextField";
import validator from "validator";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import config from "../../config/config";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../constants/language";

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
  filedName: {
    display: "flex",
    alignItems: "center"
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
    padding: 4
    // paddingBottom: 4
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

class BoatCard extends Component {
  constructor(props) {
    super(props);

    const { siblingInfo } = this.props;
    this.state = {
      boatName: "",
      boatType: "",
      width: "",
      draught: "",
      harbour: "",
      myplace: "",

      editing: false
    };
  }

  componentDidMount() {
    this.getBoatInfo();
  }

  handleEditButton = () => {
    if (this.state.editing) {
      // process on save button click.
      console.log("save button clicked");
      const {
        boatName,
        boatType,
        width,
        draught,
        harbour,
        myplace
      } = this.state;

      if (
        !boatName ||
        !boatType ||
        !width ||
        !draught ||
        !harbour ||
        !myplace
      ) {
        NotificationManager.warning(t[this.props.lang].wrong_input);
        return;
      }
      this.uploadBoatInfo();
    }
    this.setState({ editing: !this.state.editing });
  };

  getBoatInfo = () => {
    axios
      .request({
        url: "/api/dashboard/boat",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("get BoatInfo", res);
        this.setState({
          boatName: res.data.boatName,
          boatType: res.data.boatType,
          width: res.data.width,
          draught: res.data.draught,
          harbour: res.data.harbour,
          myplace: res.data.myplace
        });
      })
      .catch(err => {
        console.log("get Boats", err);
        this.setState({ editing: true });

        // alert("getBoatinfo Error", err);
      });
  };

  uploadBoatInfo = () => {
    const boatInfo = {
      boatName: this.state.boatName,
      boatType: this.state.boatType,
      width: this.state.width,
      draught: this.state.draught,
      harbour: this.state.harbour,
      myplace: this.state.myplace
    };
    axios
      .request({
        url: "/api/dashboard/boat",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: boatInfo
      })
      .then(res => {
        console.log("BoatInfo", res);
        // this.setState({ BoatsArray: res.data.Boat });
        this.setState({
          boatName: res.data.boatName,
          boatType: res.data.boatType,
          width: res.data.width,
          draught: res.data.draught,
          harbour: res.data.harbour,
          myplace: res.data.myplace
        });
        NotificationManager.success(t[this.props.lang].success);
      })
      .catch(err => {
        console.log("put Boats", err);
        // alert("uploadBoatInfo Error", err);
        NotificationManager.error(t[this.props.lang].failed);
      });
  };

  handleEdit = input => e => {
    this.setState({ [input]: e.target.value });
  };

  render() {
    const { classes } = this.props;
    const {
      boatName,
      boatType,
      width,
      draught,
      harbour,
      myplace,
      editing
    } = this.state;
    return (
      <Card className={classes.card}>
        <CardHeader
          title={t[this.props.lang].boat_specification}
          className={classes.cardheader}
        />
        <CardContent style={{paddingBottom: 16}}>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].boat_name}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <TextField
                InputProps={{
                  readOnly: !editing
                }}
                placeholder={t[this.props.lang].boat_name}
                value={boatName}
                onChange={this.handleEdit("boatName")}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].type}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <InputLabel required className={classes.formControl}>
                <Select
                  value={boatType}
                  onChange={this.handleEdit("boatType")}
                  readOnly={!editing}
                >
                  <MenuItem value="sail">{t[this.props.lang].sail}</MenuItem>
                  <MenuItem value="motor">{t[this.props.lang].motor}</MenuItem>
                </Select>
              </InputLabel>
            </Grid>
          </Grid>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].width}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <TextField
                value={width}
                onChange={this.handleEdit("width")}
                InputProps={{
                  readOnly: !editing
                }}
                placeholder="(m)"
              />
            </Grid>
          </Grid>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].draught}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <TextField
                value={draught}
                onChange={this.handleEdit("draught")}
                InputProps={{
                  readOnly: !editing
                }}
                placeholder="(m)"
              />
            </Grid>
          </Grid>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].harbour}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <TextField
                value={harbour}
                onChange={this.handleEdit("harbour")}
                InputProps={{
                  readOnly: !editing
                }}
                placeholder={t[this.props.lang].myplace_example}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.cardGrid}>
            <Grid item xs={5} className={classes.filedName}>
              <strong>
                {t[this.props.lang].my_place}
              </strong>
            </Grid>
            <Grid item xs={7}>
              <TextField
                value={myplace}
                onChange={this.handleEdit("myplace")}
                InputProps={{
                  readOnly: !editing
                }}
                placeholder={t[this.props.lang].harbour_example}
              />
            </Grid>
          </Grid>
          <br />
          <Divider />
          <Grid container style={{ display: "flex", justifyContent: "center" }}>
            <Button
              style={{ marginTop: 20 }}
              variant="contained"
              className={!editing ? classes.buttonSave : classes.buttonEdit}
              onClick={this.handleEditButton}
            >
              {!editing
                ? t[this.props.lang].edit_btn
                : t[this.props.lang].save_btn}
            </Button>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(BoatCard));
