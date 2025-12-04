"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var Cantara_Types = require('../../Cantara/Types/module');


exports.Revoke = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.KycVerifiedUser = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:KycVerifiedUser',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, user: damlTypes.Party.decoder, railType: Cantara_Types.RailType.decoder, createdAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    institution: damlTypes.Party.encode(__typed__.institution),
    user: damlTypes.Party.encode(__typed__.user),
    railType: Cantara_Types.RailType.encode(__typed__.railType),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
  };
}
,
  Archive: {
    template: function () { return exports.KycVerifiedUser; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Revoke: {
    template: function () { return exports.KycVerifiedUser; },
    choiceName: 'Revoke',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Revoke.decoder; }),
    argumentEncode: function (__typed__) { return exports.Revoke.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.KycVerifiedUser, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);



exports.WithdrawCapital = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, now: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    now: damlTypes.Time.encode(__typed__.now),
  };
}
,
};



exports.DepositMoreCapital = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, now: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    now: damlTypes.Time.encode(__typed__.now),
  };
}
,
};



exports.InstitutionalCapital = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:InstitutionalCapital',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, poolId: damlTypes.Text.decoder, railType: Cantara_Types.RailType.decoder, visibility: Cantara_Types.Visibility.decoder, assetSymbol: damlTypes.Text.decoder, suppliedAmount: damlTypes.Numeric(10).decoder, createdAt: damlTypes.Time.decoder, regulator: damlTypes.Optional(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    institution: damlTypes.Party.encode(__typed__.institution),
    poolId: damlTypes.Text.encode(__typed__.poolId),
    railType: Cantara_Types.RailType.encode(__typed__.railType),
    visibility: Cantara_Types.Visibility.encode(__typed__.visibility),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    suppliedAmount: damlTypes.Numeric(10).encode(__typed__.suppliedAmount),
    createdAt: damlTypes.Time.encode(__typed__.createdAt),
    regulator: damlTypes.Optional(damlTypes.Party).encode(__typed__.regulator),
  };
}
,
  DepositMoreCapital: {
    template: function () { return exports.InstitutionalCapital; },
    choiceName: 'DepositMoreCapital',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.DepositMoreCapital.decoder; }),
    argumentEncode: function (__typed__) { return exports.DepositMoreCapital.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.InstitutionalCapital).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.InstitutionalCapital).encode(__typed__); },
  },
  WithdrawCapital: {
    template: function () { return exports.InstitutionalCapital; },
    choiceName: 'WithdrawCapital',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.WithdrawCapital.decoder; }),
    argumentEncode: function (__typed__) { return exports.WithdrawCapital.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.InstitutionalCapital).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.InstitutionalCapital).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.InstitutionalCapital; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.InstitutionalCapital, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);



exports.UpdateRiskProfile = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newRiskProfile: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    newRiskProfile: damlTypes.Text.encode(__typed__.newRiskProfile),
  };
}
,
};



exports.Institution = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:Institution',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, institution: damlTypes.Party.decoder, name: damlTypes.Text.decoder, country: damlTypes.Text.decoder, riskProfile: damlTypes.Text.decoder, visibility: Cantara_Types.Visibility.decoder, regulator: damlTypes.Optional(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    institution: damlTypes.Party.encode(__typed__.institution),
    name: damlTypes.Text.encode(__typed__.name),
    country: damlTypes.Text.encode(__typed__.country),
    riskProfile: damlTypes.Text.encode(__typed__.riskProfile),
    visibility: Cantara_Types.Visibility.encode(__typed__.visibility),
    regulator: damlTypes.Optional(damlTypes.Party).encode(__typed__.regulator),
  };
}
,
  UpdateRiskProfile: {
    template: function () { return exports.Institution; },
    choiceName: 'UpdateRiskProfile',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdateRiskProfile.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdateRiskProfile.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Institution).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Institution).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Institution; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Institution, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);

