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
var Cantara_Wallet = require('../../Cantara/Wallet/module');


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
  templateId: '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Position:Portfolio',
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


damlTypes.registerTemplate(exports.Portfolio);

