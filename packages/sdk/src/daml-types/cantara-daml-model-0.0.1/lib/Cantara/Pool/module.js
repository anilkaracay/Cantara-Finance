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

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');

var Cantara_Types = require('../../Cantara/Types/module');


exports.UpdatePoolState = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({actor: damlTypes.Party.decoder, deltaDeposits: damlTypes.Numeric(10).decoder, deltaBorrows: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    actor: damlTypes.Party.encode(__typed__.actor),
    deltaDeposits: damlTypes.Numeric(10).encode(__typed__.deltaDeposits),
    deltaBorrows: damlTypes.Numeric(10).encode(__typed__.deltaBorrows),
  };
}
,
};



exports.ConfigureInterestModel = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newBaseRate: damlTypes.Numeric(10).decoder, newSlope1: damlTypes.Numeric(10).decoder, newSlope2: damlTypes.Numeric(10).decoder, newKinkUtilization: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    newBaseRate: damlTypes.Numeric(10).encode(__typed__.newBaseRate),
    newSlope1: damlTypes.Numeric(10).encode(__typed__.newSlope1),
    newSlope2: damlTypes.Numeric(10).encode(__typed__.newSlope2),
    newKinkUtilization: damlTypes.Numeric(10).encode(__typed__.newKinkUtilization),
  };
}
,
};



exports.LendingPool = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Pool:LendingPool',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, observers: damlTypes.List(damlTypes.Party).decoder, poolId: damlTypes.Text.decoder, railType: Cantara_Types.RailType.decoder, assetSymbol: damlTypes.Text.decoder, assetClass: Cantara_Types.AssetClass.decoder, totalDeposits: damlTypes.Numeric(10).decoder, totalBorrows: damlTypes.Numeric(10).decoder, baseRate: damlTypes.Numeric(10).decoder, slope1: damlTypes.Numeric(10).decoder, slope2: damlTypes.Numeric(10).decoder, kinkUtilization: damlTypes.Numeric(10).decoder, riskParams: Cantara_Types.RiskParams.decoder, ownerInstitution: damlTypes.Optional(damlTypes.Party).decoder, rwaReference: damlTypes.Optional(damlTypes.Text).decoder, maturityDate: damlTypes.Optional(damlTypes.Time).decoder, visibility: damlTypes.Optional(Cantara_Types.Visibility).decoder, category: damlTypes.Optional(damlTypes.Text).decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
    poolId: damlTypes.Text.encode(__typed__.poolId),
    railType: Cantara_Types.RailType.encode(__typed__.railType),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    assetClass: Cantara_Types.AssetClass.encode(__typed__.assetClass),
    totalDeposits: damlTypes.Numeric(10).encode(__typed__.totalDeposits),
    totalBorrows: damlTypes.Numeric(10).encode(__typed__.totalBorrows),
    baseRate: damlTypes.Numeric(10).encode(__typed__.baseRate),
    slope1: damlTypes.Numeric(10).encode(__typed__.slope1),
    slope2: damlTypes.Numeric(10).encode(__typed__.slope2),
    kinkUtilization: damlTypes.Numeric(10).encode(__typed__.kinkUtilization),
    riskParams: Cantara_Types.RiskParams.encode(__typed__.riskParams),
    ownerInstitution: damlTypes.Optional(damlTypes.Party).encode(__typed__.ownerInstitution),
    rwaReference: damlTypes.Optional(damlTypes.Text).encode(__typed__.rwaReference),
    maturityDate: damlTypes.Optional(damlTypes.Time).encode(__typed__.maturityDate),
    visibility: damlTypes.Optional(Cantara_Types.Visibility).encode(__typed__.visibility),
    category: damlTypes.Optional(damlTypes.Text).encode(__typed__.category),
  };
}
,
  UpdatePoolState: {
    template: function () { return exports.LendingPool; },
    choiceName: 'UpdatePoolState',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdatePoolState.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdatePoolState.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LendingPool).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LendingPool).encode(__typed__); },
  },
  ConfigureInterestModel: {
    template: function () { return exports.LendingPool; },
    choiceName: 'ConfigureInterestModel',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConfigureInterestModel.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConfigureInterestModel.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.LendingPool).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.LendingPool).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.LendingPool; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.LendingPool, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);

