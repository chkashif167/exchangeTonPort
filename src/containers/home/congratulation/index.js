import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import BackLink from "../../../components/backline";
import Box from "@material-ui/core/Box";
import { any } from "prop-types";
import Typography from "@material-ui/core/Typography"
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import config from "../../../config/config";
import * as types from "../../../actions/types";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },

  toolbar: theme.mixins.toolbar,

  cardGrid: {
    padding: 4
    // paddingRight: 16,
  }
});
class Congratulation extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  handleDashboard = () => {
    axios
    .request({
      url: "/api/users/visited",
      baseURL: config.apiBaseUrl,
      method: "POST",
    })
    .then(res => {
      console.log("congratulation", res);
      // this.props.dispatch({
      //   type: types.CURRENT_STEP,
      //   payload: res.data.step
      // });
      
    })
    .catch(err => {
      console.log("payment error", err);
    });
    this.props.history.push("/dashboard");
  }
  render() {
    const { classes } = this.props;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <h1>Congratulation!</h1>
        <Box bgcolor="#2196f3" color="background.paper" p={2} component="h3">
          You successed all of registration.
        </Box>
        <Typography>
            We will send messages to your boatinfo and you.
            You will receive confirm message for every 15days.
            Kind regards,
            Thanks.
        </Typography>

        <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={this.handleDashboard}
          >
            Go To Dashboard
          </Button>

        <BackLink />
      </main>
    );
  }
}

const mapStateToProps = state => ({
});

export default withStyles(styles)(withRouter(Congratulation));
