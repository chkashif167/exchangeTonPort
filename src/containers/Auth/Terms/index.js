import React, { Component } from "react";
import { Container } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  container: {
    "& p": {
    //   marginLeft: 16
    }
  }
});

class Terms extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container className={classes.container}>
          <h1>Conditions générales « echange ton port »</h1>
          <p>
            Le site, propriété de fullservice-marketing S.à r.l. est uniquement
            un site de mise en relation entre navigateurs, dans le but de
            connaître les possibilités d’échange de place de port pour une durée
            déterminée.{" "}
          </p>
          <p>
            Le site ne prend aucune responsabilité sur la finalité de l’échange
            et s’interdit de facturer tout montant lié à l’échange lui-même.
          </p>
          <p>
            Sur le principe, les participants s’interdisent tout facturation. Il
            s’agit d’échange uniquement.
          </p>
          <p>
            Un montant forfaitaire de 5.— est perçu pour toute demande
            d’échange. Aucun autre frais n’est perçu.
          </p>
          <p>Fullservice-marketing S.à r.l.</p>
          <p>CP 90</p>
          <p>CH – 1523 – Granges-près-Marnand, le 24 juillet 2019</p>
        </Container>
      </div>
    );
  }
}

export default withStyles(styles)(Terms);
