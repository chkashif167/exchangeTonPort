import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { withRouter } from "react-router-dom";
import "./styles.css";
import Header from "../../components/header";
import Sidebar from "./sidebar";
import UserPanel from "./userpanel";
import Boat from "./boat";
import Schedule from "./schedule";
import Ads from "./ads";
import { logoutUser } from "../../actions/authActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { isAuthenticated } from "../../service/authentication";
import setAuthToken from "../../utils/setAuthToken";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import frLocale from "date-fns/locale/fr";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import itLocale from "date-fns/locale/it";
class DashBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected_tab: 1
    };
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentWillMount() {
    const jwtToken = localStorage.getItem("jwtToken");
    console.log("jwt", jwtToken);
    if (!isAuthenticated()) {
      this.props.history.push("/");
    }
    setAuthToken(jwtToken);
  }

  onChangeTab(index) {
    this.setState({ selected_tab: index });
    if (index === 5) {
      this.props.logoutUser(this.props.history);
    }
  }
  render() {
    const locale = [enLocale, frLocale, deLocale, itLocale];

    return (
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={locale[this.props.lang]}
      >
        <div style={{ display: "flex" }}>
          <Header menuOn={true} />
          <Sidebar ontab={this.onChangeTab} />
          <Switch>
            <Route exact path="/dashboard/profile" component={UserPanel} />
            <Route path="/dashboard/boat" component={Boat} />
            <Route path="/dashboard/ads" component={Ads} />
            <Route path="/dashboard/schedule" component={Schedule} />

            <Redirect from="/dashboard" to="/dashboard/profile" />
          </Switch>
        </div>
      </MuiPickersUtilsProvider>
    );
  }
}

DashBoard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  lang: state.menu.lang
});
export default connect(
  mapStateToProps,
  { logoutUser }
)(withRouter(DashBoard));
