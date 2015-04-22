import DS from 'ember-data';

export default DS.Model.extend({
  tokenId: DS.attr("string"),
  createdAt: DS.attr("number"),
  email: DS.attr("string"),
  livemode: DS.attr("boolean"),
  verification_allowed: DS.attr("boolean"),
  amount: DS.attr(""),
  currency: DS.attr("string"),
  description: DS.attr("string")
});
