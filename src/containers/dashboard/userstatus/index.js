import React from "react";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import "./styles.css";
import { makeStyles } from "@material-ui/styles";
import { deepPurple } from "@material-ui/core/colors";
import config from "../../../config/config";

const useStyles = makeStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    color: "white",
    height: 48,
    padding: "0 30px"
  },

  avatar: {
    margin: 5,
    width: 50,
    height: 50,
    backgroundColor: deepPurple[500] 
  },
  avatarPicture: {
    margin: 5,
    width: 50,
    height: 50,
  },

  avatar_right: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10
  },

  status_on: {
    width: 10,
    height: 10,
    display: "inline-block",
    borderRadius: 9999,
    marginRight: 5,
    backgroundColor: "#8ad919"
  },

  status_off: {
    width: 10,
    height: 10,
    display: "inline-block",
    borderRadius: 9999,
    marginRight: 5,
    backgroundColor: "#AAA"
  }
});

const UserStatus = props => {
  const classes = useStyles();
  let statusMark, statusContent;
  if (props.online) {
    statusMark = <div className={classes.status_on} />;
    statusContent = <small>ONLINE</small>;
  } else {
    statusMark = <div className={classes.status_off} />;
    statusContent = <small>OFFLINE</small>;
  }
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="center"
      style={{ padding: 10 }}
    >
      {props.avatar ? 
        <Avatar className={classes.avatarPicture} src={config.apiBaseUrl + props.avatar} />
        :
      <Avatar className={classes.avatar}>{props.shortname}</Avatar>
      }
      <div className={classes.avatar_right}>
        <span>{props.name}</span>
        <br />
        {statusMark}
        {statusContent}
      </div>
    </Grid>
  );
};

export default UserStatus;
