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
import BoatCard from "../../../components/boatcard";
import { Grid } from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import axios from "axios";
import config from "../../../config/config";
import { connect } from 'react-redux' 
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
  }
});

class Boat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      BoatsArray: null
    };
  }

  componentDidMount() {
    // // request for create Boats
    // axios
    //   .request({
    //     url: "/api/dashboard/Boats",
    //     baseURL: config.apiBaseUrl,
    //     method: "post",
    //     data: [
    //         {
    //           lastname: "lastname1",
    //           firstname: "firstname1",
    //           phone: "phonenumber1",
    //           email: "email1@email.com",
    //           family: "son"
    //         },
    //         {
    //           lastname: "lastname2",
    //           firstname: "firstname2",
    //           phone: "phonenumber2222",
    //           email: "email1@email123.com",
    //           family: "son"
    //         },
    //         {
    //           lastname: "lastname33",
    //           firstname: "firstname3333",
    //           phone: "phonenumber3333",
    //           email: "gjonathan93113@gmail.com",
    //           family: "close friend"
    //         }
    //       ]

    //   })
    //   .then(res => {
    //     console.log("Boats", res);
    //     this.setState({ BoatsArray: res.data.Boat });
    //   })
    //   .catch(err => {
    //     console.log("get Boats", err);
    //   });
   
  }

  onSubmit() {}

  onSaveBoat = (index, changedValue) => {
    this.state.BoatsArray[index] = changedValue;
    this.setState({ BoatsArray: this.state.BoatsArray }, function() {
      axios
        .request({
          url: "/api/dashboard/Boats",
          baseURL: config.apiBaseUrl,
          method: "put",
          data: this.state.BoatsArray
        })
        .then(res => {
          console.log("Boats", res);
          this.setState({ BoatsArray: res.data.Boat });
        })
        .catch(err => {
          console.log("get Boats", err);
        });
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <h1>{t[this.props.lang].boat_title}</h1>
        <p>
          {t[this.props.lang].boat_desc}
        </p>
        <br/>
        <ExpansionPanel className={classes.more}>
          <ExpansionPanelSummary
            className={classes.moreSummary}
            expandIcon={<ExpandMoreIcon />}
            // aria-controls="panel1a-content"
            id="expand-more"
          >
            <Typography>
              {t[this.props.lang].more}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              {t[this.props.lang].boat_more}
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <br />
        <Grid container direction="row" justify="space-around" spacing={5}>
          <Grid item>
            <BoatCard />
          </Grid>
        </Grid>

        <BackLink />
      </main>
    );
  }
}

const mapStateToProps = ( state ) => {
  return {
    lang: state.menu.lang
  }
}

export default connect(mapStateToProps)(withStyles(styles)(Boat));
