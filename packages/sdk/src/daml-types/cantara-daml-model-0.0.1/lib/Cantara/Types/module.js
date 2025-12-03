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


exports.RiskParams = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({rpMaxLtv: damlTypes.Numeric(10).decoder, rpLiquidationThreshold: damlTypes.Numeric(10).decoder, rpLiquidationBonus: damlTypes.Numeric(10).decoder, rpMinHealthFactor: damlTypes.Numeric(10).decoder, rpRailType: exports.RailType.decoder, }); }),
  encode: function (__typed__) {
  return {
    rpMaxLtv: damlTypes.Numeric(10).encode(__typed__.rpMaxLtv),
    rpLiquidationThreshold: damlTypes.Numeric(10).encode(__typed__.rpLiquidationThreshold),
    rpLiquidationBonus: damlTypes.Numeric(10).encode(__typed__.rpLiquidationBonus),
    rpMinHealthFactor: damlTypes.Numeric(10).encode(__typed__.rpMinHealthFactor),
    rpRailType: exports.RailType.encode(__typed__.rpRailType),
  };
}
,
};



exports.AssetClass = {
  ClassA: 'ClassA',
  ClassAA: 'ClassAA',
  ClassB: 'ClassB',
  ClassR: 'ClassR',
  keys: ['ClassA','ClassAA','ClassB','ClassR',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.AssetClass.ClassA), jtv.constant(exports.AssetClass.ClassAA), jtv.constant(exports.AssetClass.ClassB), jtv.constant(exports.AssetClass.ClassR)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.Visibility = {
  Public: 'Public',
  Private: 'Private',
  keys: ['Public','Private',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.Visibility.Public), jtv.constant(exports.Visibility.Private)); }),
  encode: function (__typed__) { return __typed__; },
};



exports.RailType = {
  Permissionless: 'Permissionless',
  Permissioned: 'Permissioned',
  keys: ['Permissionless','Permissioned',],
  decoder: damlTypes.lazyMemo(function () { return jtv.oneOf(jtv.constant(exports.RailType.Permissionless), jtv.constant(exports.RailType.Permissioned)); }),
  encode: function (__typed__) { return __typed__; },
};

