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

var Cantara_Liquidation = require('../../Cantara/Liquidation/module');
var Cantara_Oracle = require('../../Cantara/Oracle/module');
var Cantara_Pool = require('../../Cantara/Pool/module');
var Cantara_Types = require('../../Cantara/Types/module');
var Cantara_Wallet = require('../../Cantara/Wallet/module');


exports.OpenPermissionedPosition = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({user: damlTypes.Party.decoder, poolId: damlTypes.Text.decoder, assetSymbol: damlTypes.Text.decoder, institution: damlTypes.Party.decoder, riskParams: Cantara_Types.RiskParams.decoder, now: damlTypes.Time.decoder, kycVerifiedInput: damlTypes.Bool.decoder, visibility: Cantara_Types.Visibility.decoder, regulator: damlTypes.Optional(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    user: damlTypes.Party.encode(__typed__.user),
    poolId: damlTypes.Text.encode(__typed__.poolId),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    institution: damlTypes.Party.encode(__typed__.institution),
    riskParams: Cantara_Types.RiskParams.encode(__typed__.riskParams),
    now: damlTypes.Time.encode(__typed__.now),
    kycVerifiedInput: damlTypes.Bool.encode(__typed__.kycVerifiedInput),
    visibility: Cantara_Types.Visibility.encode(__typed__.visibility),
    regulator: damlTypes.Optional(damlTypes.Party).encode(__typed__.regulator),
  };
}
,
};



exports.PositionFactory = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Position:PositionFactory',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({admin: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    admin: damlTypes.Party.encode(__typed__.admin),
  };
}
,
  Archive: {
    template: function () { return exports.PositionFactory; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  OpenPermissionedPosition: {
    template: function () { return exports.PositionFactory; },
    choiceName: 'OpenPermissionedPosition',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.OpenPermissionedPosition.decoder; }),
    argumentEncode: function (__typed__) { return exports.OpenPermissionedPosition.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.UserPosition).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.UserPosition).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PositionFactory, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);



exports.UserPosition = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Position:UserPosition',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({user: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, poolId: damlTypes.Text.decoder, railType: Cantara_Types.RailType.decoder, assetSymbol: damlTypes.Text.decoder, collateralAmount: damlTypes.Numeric(10).decoder, debtAmount: damlTypes.Numeric(10).decoder, lastAccrualTime: damlTypes.Time.decoder, riskParams: Cantara_Types.RiskParams.decoder, ownerInstitution: damlTypes.Optional(damlTypes.Party).decoder, kycVerified: damlTypes.Bool.decoder, visibility: damlTypes.Optional(Cantara_Types.Visibility).decoder, regulator: damlTypes.Optional(damlTypes.Party).decoder, }); }),
  encode: function (__typed__) {
  return {
    user: damlTypes.Party.encode(__typed__.user),
    admin: damlTypes.Party.encode(__typed__.admin),
    poolId: damlTypes.Text.encode(__typed__.poolId),
    railType: Cantara_Types.RailType.encode(__typed__.railType),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    collateralAmount: damlTypes.Numeric(10).encode(__typed__.collateralAmount),
    debtAmount: damlTypes.Numeric(10).encode(__typed__.debtAmount),
    lastAccrualTime: damlTypes.Time.encode(__typed__.lastAccrualTime),
    riskParams: Cantara_Types.RiskParams.encode(__typed__.riskParams),
    ownerInstitution: damlTypes.Optional(damlTypes.Party).encode(__typed__.ownerInstitution),
    kycVerified: damlTypes.Bool.encode(__typed__.kycVerified),
    visibility: damlTypes.Optional(Cantara_Types.Visibility).encode(__typed__.visibility),
    regulator: damlTypes.Optional(damlTypes.Party).encode(__typed__.regulator),
  };
}
,
  Archive: {
    template: function () { return exports.UserPosition; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.UserPosition, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);



exports.Liquidate = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({liquidator: damlTypes.Party.decoder, liquidationRightCid: damlTypes.ContractId(Cantara_Liquidation.LiquidationRight).decoder, assetSymbol: damlTypes.Text.decoder, debtSymbol: damlTypes.Text.decoder, repayAmount: damlTypes.Numeric(10).decoder, oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).decoder, }); }),
  encode: function (__typed__) {
  return {
    liquidator: damlTypes.Party.encode(__typed__.liquidator),
    liquidationRightCid: damlTypes.ContractId(Cantara_Liquidation.LiquidationRight).encode(__typed__.liquidationRightCid),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    debtSymbol: damlTypes.Text.encode(__typed__.debtSymbol),
    repayAmount: damlTypes.Numeric(10).encode(__typed__.repayAmount),
    oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).encode(__typed__.oracleCids),
  };
}
,
};



exports.Withdraw = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({symbol: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).decoder, oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).decoder, }); }),
  encode: function (__typed__) {
  return {
    symbol: damlTypes.Text.encode(__typed__.symbol),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).encode(__typed__.poolCid),
    oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).encode(__typed__.oracleCids),
  };
}
,
};



exports.Repay = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetCid: damlTypes.ContractId(Cantara_Wallet.AssetHolding).decoder, poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetCid: damlTypes.ContractId(Cantara_Wallet.AssetHolding).encode(__typed__.assetCid),
    poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).encode(__typed__.poolCid),
  };
}
,
};



exports.Borrow = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({symbol: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).decoder, oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).decoder, }); }),
  encode: function (__typed__) {
  return {
    symbol: damlTypes.Text.encode(__typed__.symbol),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).encode(__typed__.poolCid),
    oracleCids: damlTypes.List(damlTypes.ContractId(Cantara_Oracle.OraclePrice)).encode(__typed__.oracleCids),
  };
}
,
};



exports.Deposit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({assetCid: damlTypes.ContractId(Cantara_Wallet.AssetHolding).decoder, poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).decoder, }); }),
  encode: function (__typed__) {
  return {
    assetCid: damlTypes.ContractId(Cantara_Wallet.AssetHolding).encode(__typed__.assetCid),
    poolCid: damlTypes.ContractId(Cantara_Pool.LendingPool).encode(__typed__.poolCid),
  };
}
,
};



exports.Portfolio = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Position:Portfolio',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return damlTypes.Party.decoder; }); }),
  keyEncode: function (__typed__) { return damlTypes.Party.encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({user: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, deposits: damlTypes.Map(damlTypes.Text, damlTypes.Numeric(10)).decoder, borrows: damlTypes.Map(damlTypes.Text, damlTypes.Numeric(10)).decoder, lastAccrualTime: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    user: damlTypes.Party.encode(__typed__.user),
    admin: damlTypes.Party.encode(__typed__.admin),
    deposits: damlTypes.Map(damlTypes.Text, damlTypes.Numeric(10)).encode(__typed__.deposits),
    borrows: damlTypes.Map(damlTypes.Text, damlTypes.Numeric(10)).encode(__typed__.borrows),
    lastAccrualTime: damlTypes.Time.encode(__typed__.lastAccrualTime),
  };
}
,
  Deposit: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Deposit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Deposit.decoder; }),
    argumentEncode: function (__typed__) { return exports.Deposit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Portfolio).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Portfolio).encode(__typed__); },
  },
  Borrow: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Borrow',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Borrow.decoder; }),
    argumentEncode: function (__typed__) { return exports.Borrow.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).encode(__typed__); },
  },
  Repay: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Repay',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Repay.decoder; }),
    argumentEncode: function (__typed__) { return exports.Repay.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Portfolio).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Portfolio).encode(__typed__); },
  },
  Withdraw: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Withdraw',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Withdraw.decoder; }),
    argumentEncode: function (__typed__) { return exports.Withdraw.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).encode(__typed__); },
  },
  Liquidate: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Liquidate',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Liquidate.decoder; }),
    argumentEncode: function (__typed__) { return exports.Liquidate.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.Portfolio), damlTypes.ContractId(Cantara_Wallet.AssetHolding)).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.Portfolio; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Portfolio, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);



exports.UserAction = damlTypes.assembleTemplate(
{
  templateId: 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Position:UserAction',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({actor: damlTypes.Party.decoder, user: damlTypes.Party.decoder, actionType: damlTypes.Text.decoder, assetSymbol: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, timestamp: damlTypes.Time.decoder, visibility: Cantara_Types.Visibility.decoder, }); }),
  encode: function (__typed__) {
  return {
    actor: damlTypes.Party.encode(__typed__.actor),
    user: damlTypes.Party.encode(__typed__.user),
    actionType: damlTypes.Text.encode(__typed__.actionType),
    assetSymbol: damlTypes.Text.encode(__typed__.assetSymbol),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
    timestamp: damlTypes.Time.encode(__typed__.timestamp),
    visibility: Cantara_Types.Visibility.encode(__typed__.visibility),
  };
}
,
  Archive: {
    template: function () { return exports.UserAction; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.UserAction, ['e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c', 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c']);

