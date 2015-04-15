import Ember from 'ember';

export default Ember.Component.extend({
  tagName: "div",
  classNames: ["donateForm"],
  description: "",
  amountInEuros: 0,
  receivedDonations: 0,
  price: 0,
  name: "",
  shortName: ""
});
