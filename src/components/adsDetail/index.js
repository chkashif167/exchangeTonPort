import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import config from "../../config/config";
import Image from "material-ui-image";
import ProfileDefaultImg from "../../assets/profile_default.jpg";
import { connect } from "react-redux";
import t from "../../constants/language";
import { formatDate } from "../../utils";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(2)
  },
  toolbar: theme.mixins.toolbar,
  formControl: {
    margin: theme.spacing(1)
  },
  group: {
    margin: theme.spacing(1, 0)
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
    // width: 400,
  },
  card: {
    maxWidth: 400
  },
  cardheader: {
    backgroundColor: "#3f51b5",
    color: "#fff"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
});

const translateManually = (src, lang) => {
  const sail = ["Sail", "Voilier", "sail-de", "sail-it"];
  const motor = ["Motor", "Moteur", "Motor-de", "Motor-it"];
  if (src === "sail") {
    return sail[lang];
  }
  if (src === "motor") {
    return motor[lang];
  }
  const exchange = ["Exchange", "Echange", "Exchange-de", "Exchange-it"];
  const offer = ["Offer", "Offre", "Offer-de", "Offer-it"];
  const demand = ["Demand", "Demande", "Demand-de", "Demand-it"];
  if (src === "exchange") return exchange[lang];
  if (src === "offer") return offer[lang];
  if (src === "demand") return demand[lang];
};

class AdsDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gender: "",
      lastname: "",
      firstname: "",
      languageforCorrespondance: "",
      email: "",
      phonenumber: "",

      address: "",
      address2: "",
      postCode: "",
      townCity: "",
      country: "",

      profilePicture: "",

      boatName: "",
      boatType: "",
      width: "",
      draught: "",
      myHarbour: "",
      myplace: "",

      adsType: "",
      arrivalDate: null,
      leaveDate: null,
      startharbour: "",
      endharbour: "",

      count: 0,
      isLoading: true
    };
  }

  componentDidMount() {
    this.getAdsDetail();
  }

  getAdsDetail = () => {
    axios
      .request({
        url: "/api/dashboard/adsdetail",
        baseURL: config.apiBaseUrl,
        method: "POST",
        data: { user_id: this.props.detailViewInfo.user_id }
      })
      .then(res => {
        console.log("get adsDetail", res.data);
        this.setState({
          gender: res.data.gender,
          lastname: res.data.lastname,
          firstname: res.data.firstname,
          languageforCorrespondance: res.data.languageforCorrespondance,
          email: res.data.email,
          phonenumber: res.data.phonenumber,

          address: res.data.address,
          address2: res.data.address2,
          postCode: res.data.postCode,
          townCity: res.data.townCity,
          country: res.data.country,

          profilePicture: res.data.profilePicture
            ? config.apiBaseUrl + res.data.profilePicture
            : "",

          boatName: res.data.boatName,
          boatType: res.data.boatType,
          width: res.data.width,
          draught: res.data.draught,
          myHarbour: res.data.myHarbour,
          myplace: res.data.myplace,

          adsType: this.props.detailViewInfo.adsType,
          arrivalDate: this.props.detailViewInfo.arrivalDate,
          leaveDate: this.props.detailViewInfo.leaveDate,
          startharbour: this.props.detailViewInfo.startHarbour,
          endharbour: this.props.detailViewInfo.endHarbour,

          isLoading: false
        });
      })
      .catch(err => {
        console.log("get adsDetail error", err);
      });
  };

  render() {
    const { classes } = this.props;
    const {
      gender,
      lastname,
      firstname,
      languageforCorrespondance,
      email,
      phonenumber,

      profilePicture,

      boatName,
      boatType,
      width,
      draught,
      myHarbour,
      myplace,

      adsType,
      arrivalDate,
      leaveDate,
      startharbour,
      endharbour
    } = this.state;
    if (this.state.isLoading) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }
    return (
      <main className={classes.content}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
          spacing={5}
        >
          <Grid item style={{}}>
            <h1>{t[this.props.lang].profil}</h1>
            <Grid container direction="column" justify="flex-start" spacing={1}>
              <Grid item>
                <strong>{t[this.props.lang].civility}:</strong>{" "}
                <span>{gender}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].first_name}:</strong>{" "}
                <span>{firstname}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].last_name}:</strong>{" "}
                <span>{lastname}</span>
              </Grid>

              <Grid item>
                <strong>{t[this.props.lang].language}:</strong>{" "}
                <span>{languageforCorrespondance}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].email}:</strong>{" "}
                <span><a href={`mailto:${email}`}>{email}</a></span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].phone_number}:</strong>{" "}
                {isMobile && 
                  <span><a href={`tel:${phonenumber}`}>{phonenumber}</a></span>
                }
                {!isMobile &&
                 <span>{phonenumber}</span>
                }
              </Grid>
              {/* <Grid item>
                <strong>{t[this.props.lang].address}:</strong>{" "}
                <span>{address}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].address2}:</strong>{" "}
                <span>{address2}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].postcode}:</strong>{" "}
                <span>{postCode}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].town_city}:</strong>{" "}
                <span>{townCity}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].country}:</strong>{" "}
                <span>{country}</span>
              </Grid> */}
            </Grid>
          </Grid>
          <Grid item style={{ marginTop: 30, width: 200 }}>
            {profilePicture && (
              <Image
                alt="avatar img"
                src={profilePicture ? profilePicture : ProfileDefaultImg}
                imageStyle={{
                  width: "auto",
                  height: "auto",
                  position: "relative",
                  maxWidth: 200,
                  maxHeight: 200
                }}
                style={{ paddingTop: 0 }}
              />
            )}
          </Grid>
          <Grid item style={{}}>
            <h1>{t[this.props.lang].boat_information}</h1>
            <Grid container direction="column" justify="flex-start" spacing={1}>
              <Grid item>
                <strong>{t[this.props.lang].boat_name}:</strong>{" "}
                <span>{boatName}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].boat_type}:</strong>{" "}
                <span>{translateManually(boatType, this.props.lang)}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].width}:</strong>{" "}
                <span>{width}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].draught}:</strong>{" "}
                <span>{draught}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].my_harbour}:</strong>{" "}
                <span>{myHarbour}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].my_place}:</strong>{" "}
                <span>{myplace}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{}}>
            <h1>{t[this.props.lang].ads_information}</h1>
            <Grid container direction="column" justify="flex-start" spacing={1}>
              <Grid item>
                <strong>{t[this.props.lang].ads_type}:</strong>{" "}
                <span>{translateManually(adsType, this.props.lang)}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].arrival}:</strong>{" "}
                <span>{formatDate(arrivalDate)}</span>
              </Grid>
              <Grid item>
                <strong>{t[this.props.lang].return}:</strong>{" "}
                <span>{formatDate(leaveDate)}</span>
              </Grid>
              {adsType !== "demand" && (
                <Grid item>
                  <strong>{t[this.props.lang].start_harbour}:</strong>{" "}
                  <span>{startharbour}</span>
                </Grid>
              )}
              {adsType !== "offer" && (
                <Grid item>
                  <strong>{t[this.props.lang].end_harbour}:</strong>{" "}
                  <span>{endharbour}</span>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
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

export default connect(mapStateToProps)(withStyles(styles)(AdsDetail));
