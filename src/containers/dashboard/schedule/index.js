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
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ErrorOutline from "@material-ui/icons/ErrorOutline";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import { IconButton, TableSortLabel } from "@material-ui/core";
import { Add, Edit, Delete, Save, Cancel } from "@material-ui/icons";
import axios from "axios";
import config from "../../../config/config";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Grid } from "@material-ui/core";
import AdsDetail from "../../../components/adsDetail";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import adsDetail from "../../../components/adsDetail";
import { NotificationManager } from "react-notifications";
import { connect } from "react-redux";
import t from "../../../constants/language";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import Checkbox from "@material-ui/core/Checkbox";
import { formatDate } from "../../../utils";
import RemoveRedEye from "@material-ui/icons/RemoveRedEye";
import CloseIcon from "@material-ui/icons/Close";
import { getUser } from "../../../service";
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
  history: {
    backgroundColor: "#eee"
  },

  formControl: {
    // margin: theme.spacing(1)
  },
  checkGroup: {
    margin: 0
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
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
    id: "startHarbour",
    numeric: false,
    disablePadding: false,
    label: ["Start Harbour", "départ"]
  },
  {
    id: "endHarbour",
    numeric: false,
    disablePadding: false,
    label: ["End Harbour", "arrivée"]
  },
  // {
  //   id: "myPlace",
  //   numeric: false,
  //   disablePadding: false,
  //   label: ["My Place", "Ma Place"]
  // },
  {
    id: "width",
    numeric: true,
    disablePadding: false,
    label: ["Width", "Largeur"]
  },
  {
    id: "draught",
    numeric: true,
    disablePadding: false,
    label: ["Draught", "Tiran d'eau"]
  },
  {
    id: "arrivalDate",
    numeric: false,
    disablePadding: false,
    label: ["Arrival", "Arrivée"]
  },
  {
    id: "leaveDate",
    numeric: false,
    disablePadding: false,
    label: ["Return", "Retour"]
  }
  // {
  //   id: "name",
  //   numeric: false,
  //   disablePadding: false,
  //   label: ["Name", "Nom"]
  // }
];

class Schedule extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startHarbour: "",
      endHarbour: "",
      myPlace: "",
      width: "",
      draught: "",
      arrivalDate: "",
      leaveDate: "",
      name: "",
      adsType: "",

      tmp_row: {
        startHarbour: "",
        endHarbour: "",
        myPlace: "",
        width: "",
        draught: "",
        arrivalDate: "",
        leaveDate: "",
        name: "",
        adsType: ""
      },

      tableData: new Array(),
      userinfo: null,
      boatinfo: null,

      detailViewDlg: false,
      detailViewInfo: null,

      isCreatingNew: false,
      editModeIndex: -1,
      currentPage: 0,
      rowsPerPage: 10,
      isLoading: true,

      order: "asc",
      orderBy: "No",
      selected: [],

      adsType: "",
      offer: true,
      demand: true,
      exchange: true,
      history: true,

      showAcceptDlg: false,

      user: getUser()
    };
  }

  componentDidMount() {
    this.getSchedule();
  }

  getSchedule = () => {
    this.setState({ isLoading: true });
    axios
      .request({
        url: "/api/dashboard/schedule",
        baseURL: config.apiBaseUrl,
        method: "GET"
      })
      .then(res => {
        console.log("GET schedule", res.data);
        this.setState({ tableData: res.data.scheduleData, isLoading: false });
      })
      .catch(err => {
        console.log("GET schedule Error: ", err);
        // alert("GET Schedule from Server failed");
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

  onClickEdit = index => {
    this.setState({
      editModeIndex: index,
      tmp_row: Object.assign({}, this.state.tableData[index])
    });
  };

  onClickSave = index => {
    if (this.state.isCreatingNew) {
      var i = 0;
      for (i = 0; i < this.state.tableData.length; i++) {
        if (this.state.tableData[i].myPlace === this.state.tmp_row.myPlace) {
          alert("myPlace already exist on line" + (i + 1));
          return;
        }
      }

      axios
        .request({
          url: "/api/dashboard/Schedule",
          baseURL: config.apiBaseUrl,
          method: "POST",
          data: this.state.tmp_row
        })
        .then(res => {
          console.log("POST Contact", res.data);
          this.state.tableData[index] = this.state.tmp_row;
          this.setState({
            tableData: this.state.tableData,
            editModeIndex: -1,
            isCreatingNew: false
          });
        })
        .catch(err => {
          console.log("Post Contact Error: ", err);
          NotificationManager.error(t[this.props.lang].upload_to_server_failed);
        });
      return;
    }

    axios
      .request({
        url: "/api/dashboard/Schedule",
        baseURL: config.apiBaseUrl,
        method: "PUT",
        data: this.state.tmp_row
      })
      .then(res => {
        console.log("PUT Contact", res.data);
        this.state.tableData[index] = this.state.tmp_row;
        this.setState({ tableData: this.state.tableData, editModeIndex: -1 });
      })
      .catch(err => {
        console.log("PUT Contact Error: ", err);
        alert("upload to Server failed");
      });
  };

  onClickCancel = () => {
    if (this.state.isCreatingNew) {
      this.state.tableData.shift();
    }
    this.setState({
      isCreatingNew: false,
      editModeIndex: -1,
      tableData: this.state.tableData
    });
  };

  onClickDelete = index => {
    axios
      .request({
        url: "/api/dashboard/Schedule",
        baseURL: config.apiBaseUrl,
        method: "DELETE",
        data: this.state.tableData[index]
      })
      .then(res => {
        console.log("DELETE Contact", res.data);
        this.state.tableData.splice(index, 1);
        this.setState({ tableData: this.state.tableData });
      })
      .catch(err => {
        console.log("DELETE Contact Error: ", err);
        alert("Delete request to Server failed");
      });
  };

  handleEdit = (input, e) => {
    // console.log('df')
    switch (input) {
      case "startHarbour":
        this.state.tmp_row.startHarbour = e.target.value;
        break;
      case "endHarbour":
        this.state.tmp_row.endHarbour = e.target.value;
        break;
      case "width":
        this.state.tmp_row.width = e.target.value;
        break;
      case "myPlace":
        this.state.tmp_row.myPlace = e.target.value;
        break;
      case "category":
        this.state.tmp_row.category = e.target.value;
        break;
      case "adsType":
        this.setState({ adsType: e.target.value });
        return;
      default:
        break;
    }

    this.setState({ tmp_row: this.state.tmp_row });
  };

  onClickNew = () => {
    this.setState({
      isCreatingNew: true,
      tmp_row: {
        startHarbour: "",
        endHarbour: "",
        myPlace: "",
        width: "",
        category: ""
      }
    });
    this.state.tableData.unshift(this.state.tmp_row);

    this.setState({ tableData: this.state.tableData, editModeIndex: 0 });
  };

  handleDetailView = item => {
    this.setState({ detailViewDlg: true, detailViewInfo: item });
  };
  handleDetailViewClose = () => {
    this.setState({ detailViewDlg: false });
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

  filterArray = array => {
    const { offer, demand, exchange, history, user } = this.state;
    return array.filter((element, index) => {
      if (user.admin === "port") {
        if (element.endHarbour !== user.firstname) return false;
      }
      const status = element.status;
      if (!history && status === "deleted") return false;
      const adstype = element.adsType;
      if (offer && adstype === "offer") return true;
      if (demand && adstype === "demand") return true;
      if (exchange && adstype === "exchange") return true;

      return false;
    });
  };

  handleCheckBox = input => event => {
    this.setState({ [input]: event.target.checked });
  };

  handleClickEye = item => {
    this.setState({ showAcceptDlg: true, detailViewInfo: item });
  };

  handleClickAccept = () => {
    axios
      .request({
        url: "/api/dashboard/accept-click",
        baseURL: config.apiBaseUrl,
        method: "POST"
      })
      .then(res => {
        console.log("accept click", res.data);
        this.setState({ detailViewDlg: true });
      })
      .catch(err => {
        console.log("accept click Error: ", err);
        NotificationManager.error("Failed");
      });
    this.setState({ showAcceptDlg: false });
  };

  handleCloseAcceptDlg = () => {
    this.setState({ showAcceptDlg: false });
  };

  render() {
    const { classes } = this.props;
    const {
      currentPage,
      rowsPerPage,
      editModeIndex,
      tableData,
      tmp_row,

      order,
      orderBy,
      selected,

      adsType,
      offer,
      demand,
      exchange,
      history,

      showAcceptDlg
    } = this.state;
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <h1>{t[this.props.lang].listings_title}</h1>
        <p>{t[this.props.lang].listings_info}</p>
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
            <Typography>{t[this.props.lang].listings_more}</Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <br />
        {/* <h2>Schedule</h2> */}
        <Grid container direction="row" justify="flex-start" spacing={0}>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={offer}
                  onChange={this.handleCheckBox("offer")}
                  value="offer"
                />
              }
              label={
                <p style={{ color: "#6a1b9a", backgroundColor: "#f3e5f5" }}>
                  {t[this.props.lang].offer}
                </p>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={demand}
                  onChange={this.handleCheckBox("demand")}
                  value="demand"
                />
              }
              label={
                <p style={{ color: "#1565c0", backgroundColor: "#e3f2fd" }}>
                  {t[this.props.lang].demand}
                </p>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={exchange}
                  onChange={this.handleCheckBox("exchange")}
                  value="exchange"
                />
              }
              label={
                <p style={{ color: "#00695c", backgroundColor: "#e0f2f1" }}>
                  {t[this.props.lang].exchange}
                </p>
              }
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={history}
                  onChange={this.handleCheckBox("history")}
                  value="history"
                />
              }
              label={
                <p style={{ color: "#333", backgroundColor: "#eee" }}>
                  {t[this.props.lang].history}
                </p>
              }
            />
          </Grid>
        </Grid>

        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {/* <TableCell align="center">
                  <IconButton onClick={this.onClickNew}>
                    <Add />
                  </IconButton>
                </TableCell> */}
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
                <TableCell align={"left"} padding={"default"}>
                  {t[this.props.lang].Detail}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.isLoading && (
                <p style={{ marginLeft: 20 }}>loading...</p>
              )}
              {tableData &&
                this.stableSort(
                  this.filterArray(tableData),
                  this.getSorting(order, orderBy)
                )
                  .slice(
                    currentPage * rowsPerPage,
                    currentPage * rowsPerPage + rowsPerPage
                  )
                  .map((item, index) => (
                    <TableRow
                      key={index}
                      className={
                        item.status === "deleted"
                          ? classes.history
                          : item.adsType === "offer"
                          ? classes.offer
                          : item.adsType === "demand"
                          ? classes.demand
                          : classes.exchange
                      }
                    >
                      {/* <TableCell align="center">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <div>
                            <IconButton
                              onClick={() =>
                                this.onClickSave(
                                  currentPage * rowsPerPage + index
                                )
                              }
                            >
                              <Save style={{ color: "#039be5" }} />
                            </IconButton>
                            <IconButton onClick={() => this.onClickCancel()}>
                              <Cancel style={{ color: "#ec407a" }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div>
                            <IconButton
                              onClick={() =>
                                this.onClickEdit(
                                  currentPage * rowsPerPage + index
                                )
                              }
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                this.onClickDelete(
                                  currentPage * rowsPerPage + index
                                )
                              }
                            >
                              <Delete />
                            </IconButton>
                          </div>
                        )}
                      </TableCell> */}
                      <TableCell component="th" scope="row" align="left">
                        {currentPage * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.startHarbour}
                            onChange={e => this.handleEdit("startHarbour", e)}
                          />
                        ) : (
                          item.startHarbour
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.endHarbour}
                            onChange={e => this.handleEdit("endHarbour", e)}
                          />
                        ) : (
                          item.endHarbour
                        )}
                      </TableCell>
                      {/* <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.myPlace}
                            onChange={e => this.handleEdit("myPlace", e)}
                          />
                        ) : (
                          item.myPlace
                        )}
                      </TableCell> */}
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.width}
                            onChange={e => this.handleEdit("width", e)}
                          />
                        ) : (
                          item.width
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.draught}
                            onChange={e => this.handleEdit("draught", e)}
                          />
                        ) : (
                          item.draught
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.arrivalDate}
                            onChange={e => this.handleEdit("arrivalDate", e)}
                          />
                        ) : (
                          formatDate(item.arrivalDate)
                        )}
                      </TableCell>
                      <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.leaveDate}
                            onChange={e => this.handleEdit("leaveDate", e)}
                          />
                        ) : (
                          formatDate(item.leaveDate)
                        )}
                      </TableCell>
                      {/* <TableCell align="left">
                        {editModeIndex > -1 &&
                        editModeIndex === currentPage * rowsPerPage + index ? (
                          <TextField
                            value={tmp_row.name}
                            onChange={e => this.handleEdit("name", e)}
                          />
                        ) : (
                          <span
                            className={classes.username}
                            onClick={() => this.handleDetailView(item)}
                          >
                            {item.name}
                          </span>
                        )}
                      </TableCell> */}
                      <TableCell align="left">
                        <IconButton
                          aria-label="view"
                          onClick={() => this.handleClickEye(item)}
                        >
                          <RemoveRedEye />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          <div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={this.filterArray(this.state.tableData).length}
              rowsPerPage={this.state.rowsPerPage}
              labelRowsPerPage={t[this.props.lang].labelRowsPerPage}
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

        <Dialog
          open={this.state.detailViewDlg}
          onClose={this.handleDetailViewClose}
          aria-labelledby="form-dialog-title"
          // maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">
            {t[this.props.lang].detail_view}
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={this.handleDetailViewClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AdsDetail detailViewInfo={this.state.detailViewInfo} />
          </DialogContent>
        </Dialog>

        <Dialog
          open={showAcceptDlg}
          onClose={this.handleCloseAcceptDlg}
          // maxWidth="sm"
          aria-labelledby="customized-dialog-title"
        >
          <DialogTitle>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={this.handleCloseAcceptDlg}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t[this.props.lang].payment_desc}
            </DialogContentText>
            <Box display="flex" justifyContent="center" m={1}>
              <Button
                variant="contained"
                color="primary"
                // size="large"
                className={classes.button}
                onClick={this.handleClickAccept}
              >
                {t[this.props.lang].acceptButton}
              </Button>
            </Box>
            {/* <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Save changes
              </Button>
            </DialogActions> */}
          </DialogContent>
        </Dialog>
        <BackLink />
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    mobileOpen: state.mobileOpen,
    lang: state.menu.lang
  };
};

export default connect(mapStateToProps)(withStyles(styles)(Schedule));
