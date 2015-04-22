import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["donateForm"],
  description: "",
  currency: "eur",
  amountInEuros: 0,
  receivedDonations: 0,
  price: 0,
  name: "",
  shortName: "",
  hasErrors: false,
  errors: null,
  formatError: "Le montant n'est pas valide. Entrer uniquement des nombres et séparer les centimes par un \".\" (ex: 5.50)",
  minimumAmountError: "Le montant minimum est de 1 €",
  store: null,
  paymentError: '',
  performingPayment: false,

  amountInCents: function() {
    return this.get("amountInEuros") * 100;
  }.property("amountInEuros"),

  handler: function() {
    var self = this;
    return StripeCheckout.configure({
      // test key = 'pk_test_QUIN6n5t6j64jmvJb68n4Llw'
      // live key = 'pk_live_yj8Q1zaUElF1OuYQhmkdJRtH'
      key: "pk_test_QUIN6n5t6j64jmvJb68n4Llw",
      image: 'https://s3.eu-central-1.amazonaws.com/welcome-yumi/assets/images/small-logo.png',
      token: function(token) {
        self.send("actionAfterStripeSubmission", self, token);
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
        currency: this.get("currency"),
        amount: this.get("amountInCents"),
        allowRememberMe: false
      });
    },
    showOtherPaymentFacilities: function() {
      this.$(".online-payment").css("opacity", 0);
    },
    actionAfterStripeSubmission: function(self, token) {
      self.send("hidePaymentForm");

      self.set("performingPayment", true);

      self.send("sendRequestToBackendToPerformPayment", self, token);
    },
    hidePaymentForm: function() {
      this.$(".payment").hide();
    },
    showSuccessAlert: function() {
      this.$(".payment-success").show();
      this.$(".payment-error").hide();
    },
    showErrorAlert: function(errorMessage) {
      this.set("paymentError", errorMessage);
      this.$(".payment-success").hide();
      this.$(".payment-error").show();
    },
    sendRequestToBackendToPerformPayment: function(self, token) {
      var charge = self.store.createRecord('charge', {
        tokenId: token.id,
        createdAt: token.created,
        email: token.email,
        livemode: token.livemode,
        verificationAllowed: token.verification_allowed,
        amount: self.get("amountInCents"),
        description: self.get("description"),
        currency: self.get("currency")
      });

      charge.save().then(function() {
        self.set("performingPayment", false);
        self.send("showSuccessAlert");
      }, function(response) {
        self.set("performingPayment", false);
        self.send("showErrorAlert", response.errors.error);
      });
    }
  }
});
