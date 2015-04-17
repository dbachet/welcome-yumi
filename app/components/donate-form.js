import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["donateForm"],
  description: "",
  amountInEuros: 0,
  receivedDonations: 0,
  price: 0,
  name: "",
  shortName: "",
  hasErrors: false,
  errors: null,
  formatError: "Le montant n'est pas valide. Entrer uniquement des nombres et séparer les centimes par un \".\" (ex: 5.50)",
  minimumAmountError: "Le montant minimum est de 1 €",

  amountInCents: function() {
    return this.get("amountInEuros") * 100;
  }.property("amountInEuros"),

  handler: function() {
    return StripeCheckout.configure({
      key: 'pk_test_QUIN6n5t6j64jmvJb68n4Llw',
      image: 'https://s3.eu-central-1.amazonaws.com/welcome-yumi/assets/images/small-logo.png',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
      }
    });
  }.property(''),

  actions: {
    clickButton: function() {
      this.send("validateAmount");
      if (!this.get("hasErrors")) {
        this.send("showStripeForm");
      }
    },

    validateAmount: function() {
      if (!isFinite(this.get("amountInEuros"))) {
        this.send("showFormatError");
      } else {
        if (this.get("amountInEuros") < 1) {
          this.send("showMinimumAmountError");
        } else {
          this.send("resetErrors");
        }
      }
    },

    showFormatError: function() {
      this.set("hasErrors", true);
      this.set("errors", this.get("formatError"));
      this.$("input").addClass("has-errors");
    },

    showMinimumAmountError: function() {
      this.set("hasErrors", true);
      this.set("errors", this.get("minimumAmountError"));
      this.$("input").addClass("has-errors");
    },

    resetErrors: function() {
      this.set("hasErrors", false);
      this.set("errors", null);
      this.$("input").removeClass("has-errors");
    },

    showStripeForm: function() {
      this.get("handler").open({
        name: 'Welcome Yumi',
        description: this.get("description"),
        currency: "eur",
        amount: this.get("amountInCents"),
        allowRememberMe: false
      });
    }
  }
});
