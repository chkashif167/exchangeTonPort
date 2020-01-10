import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { connect } from "react-redux";
import Auth from "../Auth";
import Box from "@material-ui/core/Box";
import Background from "../../assets/more1.jpg";
import firstIcon from "../../assets/icon1.png";
import secondIcon from "../../assets/icon2.png";
import thirdIcon from "../../assets/icon3.png";
import t from "../../constants/language";
import BW_Logo from "../../assets/logo-bw.png";
import Image from "material-ui-image";

const styles = theme => ({
  img: {
    width: 80,
    height: 80,
    [theme.breakpoints.down("530")]: {
      width: 50,
      height: 50
    },
    [theme.breakpoints.down("430")]: {
      width: 30,
      height: 30
    },
    [theme.breakpoints.down("360")]: {
      width: 15,
      height: 15
    }
  }
});

class Landing extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          fontFamily: "Roboto",
          height: "calc(100vh - 64px)",
          display: "flex",
          flexDirection: "column"
          // justifyContent: "space-between"
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <Grid container style={{ height: "100%" }}>
            <Grid
              item
              xs={12}
              md={6}
              style={{
                backgroundImage: `url(${Background})`,
                backgroundPosition: "left",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                color: "#fff",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 600
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px"
                  }}
                >
                  <img className={classes.img} src={firstIcon} alt="img" />
                  <span
                    style={{
                      verticalAlign: "middle",
                      marginLeft: "10px",
                      fontWeight: "700"
                    }}
                  >
                    {t[this.props.lang].offer}
                  </span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px"
                  }}
                >
                  <img className={classes.img} src={secondIcon} />
                  <span
                    style={{
                      verticalAlign: "middle",
                      marginLeft: "10px",
                      fontWeight: "700"
                    }}
                  >
                    {t[this.props.lang].exchange}
                  </span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px"
                  }}
                >
                  <img alt="" className={classes.img} src={thirdIcon} />
                  <span
                    style={{
                      verticalAlign: "middle",
                      marginLeft: "10px",
                      fontWeight: "700"
                    }}
                  >
                    {t[this.props.lang].demand}
                  </span>
                </Box>
              </div>

              <h2
                style={{
                  color: "#2FA5FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "300",
                  margin: 20
                }}
              >
                {t[this.props.lang].lading_heading}
              </h2>
              <p
                style={{
                  textAlign: "justify",
                  marginLeft: "10%",
                  marginRight: "10%",
                  lineHeight: "170%",
                  fontStyle: "italic",
                  fontWeight: "300"
                }}
              >
                {t[this.props.lang].leading_desc}
              </p>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              direction="column"
              alignItems="center"
              justify="center"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Auth />
              <div>
                <a href="https://www.bucher-walt.ch/" target="_blank">
                  <Image
                    alt="avatar img"
                    src={BW_Logo}
                    imageStyle={{
                      width: "auto",
                      height: "auto",
                      position: "relative",
                      maxWidth: 150,
                      maxHeight: 100
                    }}
                    style={{ paddingTop: 0, backgroundColor: "transparent" }}
                  />
                </a>
              </div>
            </Grid>
          </Grid>
        </div>
        <div
          style={{
            backgroundColor: "#17181A",
            textAlign: "center",
            color: "#fff",
            height: "fit-content",
            bottom: 0
          }}
        >
          <p style={{ marginTop: "3", marginBottom: "3", minWidth: "500" }}>
            info@echangetonport.ch
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.menu.lang
});

export default connect(mapStateToProps)(withStyles(styles)(Landing));
