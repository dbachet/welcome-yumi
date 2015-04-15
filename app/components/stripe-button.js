import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "button",
  classNames: ["donate-button", "btn-block"],
  attributeBindings: ['type'],
  type: "button",
  description: "",
  amountInEuros: null,
  shortName: "",

  amountInCents: function() {
    return this.get("amountInEuros") * 100;
  }.property("amountInEuros"),

  handler: function() {
    return StripeCheckout.configure({
      key: 'pk_test_QUIN6n5t6j64jmvJb68n4Llw',
      image: '/img/documentation/checkout/marketplace.png',
      token: function(token) {
        // Use the token to create the charge with a server-side script.
        // You can access the token ID with `token.id`
      }
    });
  }.property(''),

  click: function(e) {
    this.get("handler").open({
      name: 'Welcome Yumi',
      description: this.get("description"),
      currency: "eur",
      amount: this.get("amountInCents")
    });
    e.preventDefault();
  }
});
