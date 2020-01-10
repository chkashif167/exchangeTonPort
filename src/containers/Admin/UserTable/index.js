import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { IconButton, TableSortLabel, Divider } from "@material-ui/core";
import { Add, Edit, Delete, Save, Cancel } from "@material-ui/icons";
import axios from "axios";
import config from "../../../config/config";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../../constants/language";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";

const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    overflowX: "auto"
  },

  toolbar: theme.mixins.toolbar,
  paper: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },

  submitButton: {
    marginTop: 10,
    backgroundColor: "#30a5ff",
    width: 60
  },

  moreSummary: {
    "& div": {
      flexGrow: 0
    }
  },
  username: {
    color: "#2065bf",
    cursor: "pointer"
  },
  offer: {
    backgroundColor: "#f3e5f5"
  },
  demand: {
    backgroundColor: "#e3f2fd"
  },
  exchange: {
    backgroundColor: "#e0f2f1"
  },

  formControl: {
    margin: theme.spacing(1)
  }
});

const headRows = [
  {
    id: "No",
    numeric: true,
    disablePadding: false,
    label: ["No", "Num"]
  },
  {
    id: "firstName",
    numeric: false,
    disablePadding: false,
    label: ["First Name", "Prénom"]
  },
  {
    id: "lastName",
    numeric: true,
    disablePadding: false,
    label: ["Last Name", "Nom de famille"]
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: ["Email", "Email"]
  },
  {
    id: "phoneNumber",
    numeric: false,
    disablePadding: false,
    label: ["PhoneNumber", "Numéro de téléphone"]
  },
  {
    id: "acceptCount",
    numeric: false,
    disablePadding: false,
    label: ["AcceptCount", "acceptCount-fr"]
  }
];

class UserTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: new Array(),

      isLoading: true,
      currentPage: 0,
      rowsPerPage: 5,

      order: "asc",
      orderBy: "No"
    };
  }

  componentWillMount() {
    // const jwtToken = localStorage.getItem("jwtToken");
    // console.log("jwt", jwtToken);
    // if (!isAuthenticated()) {
    //   this.props.history.push("/");
    // }
    // setAuthToken(jwtToken);
  }
  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {
    this.setState({ isLoading: true });
    axios
      .request({
        url: "/api/admin/userlist",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("GET userlist", res.data);
        this.setState({ tableData: res.data.users, isLoading: false });
      })
      .catch(err => {
        console.log("GET userlist Error: ", err);
        this.setState({ isLoading: false });
      });
  };

  handleChangePage = (event, newPage) => {
    this.setState({ currentPage: newPage });
  };

  handleChangeRowsPerPage = event => {
    this.setState({
      rowsPerPage: event.target.value,
      currentPage: 0
    });
  };

  onClickDelete = item => {
      console.log("213")
    axios
      .request({
        url: "/api/admin/user",
        baseURL: config.apiBaseUrl,
        method: "DELETE",
        data: { user_id: item._id }
      })
      .then(res => {
        console.log("DELETE user", res.data);
        const array = this.state.tableData.filter(element => {
          if (element == item) return false;
          return true;
        });
        this.setState({ tableData: array });
        NotificationManager.success("success");
      })
      .catch(err => {
        console.log("DELETE user Error: ", err);
        // alert("Delete request to Server failed");
        NotificationManager.error("Failed");
      });
  };

  handleSort = rowId => {
    console.log("handleSort", rowId);
    const isDesc = this.state.orderBy === rowId && this.state.order === "desc";
    this.setState({ order: isDesc ? "asc" : "desc", orderBy: rowId });
  };

  desc(a, b, orderBy) {
    var left = a[orderBy];
    var right = b[orderBy];
    if (orderBy === "width" || orderBy === "draught") {
      left = parseInt(left);
      right = parseInt(right);
    } else {
      if (typeof left === "string") left = left.toLowerCase();
      if (typeof right === "string") right = right.toLowerCase();
    }

    if (right < left) {
      return -1;
    }
    if (right > left) {
      return 1;
    }
    return 0;
  }

  getSorting = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => this.desc(a, b, orderBy)
      : (a, b) => -this.desc(a, b, orderBy);
  };

  stableSort = (array, cmp) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map(el => el[0]);
  };

  render() {
    const { classes } = this.props;
    const {
      currentPage,
      rowsPerPage,
      tableData,

      order,
      orderBy
    } = this.state;
    return (
      <div>
        <main>
          <h2>{t[this.props.lang].user_list}</h2>
          <Paper className={classes.paper}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    {/* <IconButton onClick={this.onClickNew}>
                    <Add />
                  </IconButton> */}
                  </TableCell>
                  {headRows.map((row, index) => (
                    <TableCell
                      key={row.id}
                      align={"left"}
                      padding={row.disablePadding ? "none" : "default"}
                      sortDirection={orderBy === row.id ? order : false}
                    >
                      {index === 0 ? (
                        row.label[this.props.lang]
                      ) : (
                        <TableSortLabel
                          active={orderBy === row.id}
                          direction={order}
                          onClick={() => this.handleSort(row.id)}
                        >
                          {row.label[this.props.lang]}
                        </TableSortLabel>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.isLoading && (
                  <p style={{ marginLeft: 20 }}>loading...</p>
                )}

                {tableData &&
                  this.stableSort(tableData, this.getSorting(order, orderBy))
                    .slice(
                      currentPage * rowsPerPage,
                      currentPage * rowsPerPage + rowsPerPage
                    )
                    .map((item, index) => (
                      <TableRow key={index}>
                        <TableCell align="center">
                          <IconButton onClick={() => this.onClickDelete(item)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                        <TableCell component="th" scope="row" align="left">
                          {currentPage * rowsPerPage + index + 1}
                        </TableCell>
                        <TableCell align="left">{item.firstname}</TableCell>
                        <TableCell align="left">{item.lastname}</TableCell>
                        <TableCell align="left">{item.email}</TableCell>
                        <TableCell align="left">{item.phonenumber}</TableCell>
                        <TableCell align="left">{item.profile[0].acceptCount}</TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>
            <div>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={this.state.tableData.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.currentPage}
                backIconButtonProps={{
                  "aria-label": "Previous Page"
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page"
                }}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
              />
            </div>
          </Paper>
        </main>
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

export default connect(mapStateToProps)(withStyles(styles)(UserTable));
