import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import BackLink from "../../../components/backline";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AdsCard from "../../../components/adscard";
import { Grid } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import config from "../../../config/config";
import { NotificationManager } from "react-notifications";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddCircle from "@material-ui/icons/AddCircle";
import { connect } from "react-redux";
import t from "../../../constants/language";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },

  toolbar: theme.mixins.toolbar,

  formContainer: {
    margin: 20,
    width: 400,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#30a5ff",
    width: 60
  },
  expansionheading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: "center"
  },
  more: {
    // width: 60,
    // margin:10
  },
  moreSummary: {
    "& div": {
      flexGrow: 0
    }
  },
  leftIcon: {
    marginRight: theme.spacing(1)
  }
});

class Ads extends Component {
  constructor(props) {
    super(props);

    this.state = {
      adsArray: [],
      isCreateDialog: false,
      createAds: {}
    };
  }

  componentDidMount() {
    this.getAdsInfo();
  }

  getAdsInfo = () => {
    axios
      .request({
        url: "/api/dashboard/ads",
        baseURL: config.apiBaseUrl,
        method: "get"
      })
      .then(res => {
        console.log("get Ads", res);
        this.setState({ adsArray: res.data.adsArray });
      })
      .catch(err => {
        console.log("get siblings", err);
      });
  };

  uploadAdsInfo = adsArray => {
    axios
      .request({
        url: "/api/dashboard/ads",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: { adsArray: adsArray }
      })
      .then(res => {
        console.log("post ads", res);
        // this.setState({ adsArray: res.data.adsArray });
        // NotificationManager.success(t[this.props.lang].success);
      })
      .catch(err => {
        console.log("post adsArray", err);
        NotificationManager.error(t[this.props.lang].failed);
      });
  };
  saveAdsInfo = (index, changedValue) => {
    this.state.adsArray[index] = {
      ...this.state.adsArray[index],
      ...changedValue
    };
    this.setState({ adsArray: this.state.adsArray }, function() {
      this.uploadAdsInfo(this.state.adsArray);
    });
  };

  deleteAdsInfo = index => {
    this.state.adsArray[index] = {
      ...this.state.adsArray[index],
      status: "deleted"
    };
    this.setState({ adsArray: this.state.adsArray }, function() {
      this.uploadAdsInfo(this.state.adsArray);
    });
  };

  restoreAdsInfo = index => {
    this.state.adsArray[index] = {
      ...this.state.adsArray[index],
      status: "active"
    };
    this.setState({ adsArray: this.state.adsArray }, function() {
      this.uploadAdsInfo(this.state.adsArray);
    });
  };

  addAdsInfo = newValue => {
    this.state.adsArray.push({ ...newValue, status: "active" });
    this.setState({ adsArray: this.state.adsArray }, function() {
      this.uploadAdsInfo(this.state.adsArray);
    });
  };

  handleCreateButton = () => {
    const initValue = {
      adsType: "",
      boatName: "",
      arrivalDate: null,
      leaveDate: null,
      harbour: "", //my harbour
      destHarbour: "",
      status: "active"
    };
    this.setState({ createAds: initValue, isCreateDialog: true });
  };
  handleCloseCreateDialog = () => {
    this.setState({ isCreateDialog: false });
  };
  handleCreateOne = () => {
    const newValue = this.state.createAds;
    this.addAdsInfo(newValue);
  };

  addNewAds = newValue => {
    this.addAdsInfo(newValue);
    this.setState({ isCreateDialog: false });
  };

  render() {
    const { classes } = this.props;
    const { adsArray, isCreateDialog, createAds } = this.state;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <h1>{t[this.props.lang].ads_title}</h1>
        <p>{t[this.props.lang].ads_info}</p>
        <br />
        <ExpansionPanel className={classes.more}>
          <ExpansionPanelSummary
            className={classes.moreSummary}
            expandIcon={<ExpandMoreIcon />}
            // aria-controls="panel1a-content"
            id="expand-more"
          >
            <Typography>{t[this.props.lang].more}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>{t[this.props.lang].ads_more}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <br />
        <Box display="flex" justifyContent="center" m={2}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
            onClick={this.handleCreateButton}
          >
            <AddCircle className={classes.leftIcon} />
            {t[this.props.lang].add}
          </Button>
        </Box>
        <Grid container direction="row" justify="flex-start" spacing={3}>
          {adsArray &&
            adsArray.map((item, index) => (
              <Grid item key={index}>
                <AdsCard
                  adsIndex={index}
                  adsInfo={item}
                  saveAdsInfo={this.saveAdsInfo}
                  delete={this.deleteAdsInfo}
                  restore={this.restoreAdsInfo}
                />
              </Grid>
            ))}
        </Grid>

        <BackLink />

        <Dialog open={isCreateDialog} onClose={this.handleCloseCreateDialog}>
          {/* <DialogTitle id="create-dialog-title">New Ads</DialogTitle> */}
          <DialogContent style={{ padding: 0 }}>
            <AdsCard
              index={0}
              adsInfo={createAds}
              saveAdsInfo={this.addNewAds}
              createMode
            />
          </DialogContent>
          {/* <DialogActions>
            <Button onClick={this.handleEmailChange} color="primary" />
            <Button onClick={this.handlePasswordClose} color="primary">
              Cancel
            </Button>
          </DialogActions> */}
        </Dialog>
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Ads));
