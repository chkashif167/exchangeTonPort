import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Badge from "@material-ui/core/Badge";
import MoreIcon from "@material-ui/icons/MoreVert";
import MailIcon from "@material-ui/icons/Mail";
import { withStyles } from "@material-ui/core/styles";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { handleMenuClick } from "../../actions/menuActions";
import { connect } from "react-redux";
import t from "../../constants/language";
import Language from "@material-ui/icons/Language";
import * as types from "../../actions/types";
import axios from "axios";
import config from "../../config/config";
const styles = theme => ({
  appBar: {
    backgroundColor: "black",
    zIndex: theme.zIndex.drawer + 1
  },
  grow: {
    flexGrow: 1
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  }
});

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileMoreAnchorEl: null,
      languageAnchorEl: null
    };

    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
  }

  componentDidMount() {
    this.getLanguage();
  }

  getLanguage = () => {
    axios
      .request({
        url: "/api/users/language",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("get language", res.body);
        const curLanguage = res.data.language;
        var curlang_index = 0;
        if (curLanguage === "french") curlang_index = 1;
        if (curLanguage === "german") curlang_index = 2;
        if (curLanguage === "italian") curlang_index = 3;
        this.props.dispatch({
          type: types.CHANGE_LANG,
          payload: curlang_index
        });
      })
      .catch(err => {
        console.log("post language Error", err);
      });
  };

  mobileMenuId = "primary-search-account-menu-mobile";

  handleMobileMenuOpen(event) {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget
    });
  }

  handleMobileMenuClose() {
    this.setState({
      mobileMoreAnchorEl: null
    });
  }

  handleLangClose = () => {
    this.setState({ languageAnchorEl: null });
  };

  handleLangClick = event => {
    this.setState({ languageAnchorEl: event.currentTarget });
    this.handleMobileMenuClose();
  };

  handleLangItemClick = index => {
    this.props.dispatch({ type: types.CHANGE_LANG, payload: index });
    this.setState({ languageAnchorEl: null });

    const langString = ["english", "french", "german", "italian"];
    axios
      .request({
        url: "/api/users/language",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: { language: langString[index] }
      })
      .then(res => {
        // console.log("saveProfile", res);
      })
      .catch(err => {
        console.log("post language Error", err);
      });
  };

  render() {
    const { classes } = this.props;
    const { languageAnchorEl } = this.state;
    return (
      <div>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            {this.props.menuOn && (
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="Open drawer"
                onClick={this.props.toggleMobileMenu}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" noWrap>
              <span style={{ color: "#30a5ff" }}>
                {t[this.props.lang].app_title}
              </span>
            </Typography>
            <div className={classes.grow} />

            <div className={classes.sectionDesktop}>
              <IconButton
                aria-label=""
                color="inherit"
                onClick={this.handleLangClick}
              >
                <Language />
              </IconButton>
            </div>

            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="Show more"
                aria-controls={this.mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>

        <Menu
          id="language-menu"
          anchorEl={languageAnchorEl}
          keepMounted
          open={languageAnchorEl ? true : false}
          onClose={this.handleLangClose}
        >
          {/* <MenuItem onClick={() => this.handleLangItemClick(2)}>
            {t[this.props.lang].german}
          </MenuItem> */}
          <MenuItem onClick={() => this.handleLangItemClick(1)}>
            {t[this.props.lang].french_native}
          </MenuItem>
          {/* <MenuItem onClick={() => this.handleLangItemClick(3)}>
            {t[this.props.lang].italian}
          </MenuItem> */}
          <MenuItem onClick={() => this.handleLangItemClick(0)}>
            {t[this.props.lang].english_native}
          </MenuItem>
        </Menu>

        <Menu
          anchorEl={this.state.mobileMoreAnchorEl}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          keepMounted
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={Boolean(this.state.mobileMoreAnchorEl)}
          onClose={this.handleMobileMenuClose}
        >
          <MenuItem onClick={this.handleLangClick}>
            <IconButton aria-label="" color="inherit">
              <Language />
            </IconButton>
            <p>Set Language</p>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileOpen: state.mobileOpen,
    lang: state.menu.lang
  };
};

const mapDispatchToProps = dispatch => {
  return {
    toggleMobileMenu: () => {
      dispatch(handleMenuClick());
    },
    dispatch
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Header));
