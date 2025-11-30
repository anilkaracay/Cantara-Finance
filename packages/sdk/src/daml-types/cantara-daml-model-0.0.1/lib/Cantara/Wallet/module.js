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


exports.Merge = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({otherCid: damlTypes.ContractId(exports.AssetHolding).decoder, }); }),
  encode: function (__typed__) {
  return {
    otherCid: damlTypes.ContractId(exports.AssetHolding).encode(__typed__.otherCid),
  };
}
,
};



exports.Split = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({splitAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    splitAmount: damlTypes.Numeric(10).encode(__typed__.splitAmount),
  };
}
,
};



exports.Transfer = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({recipient: damlTypes.Party.decoder, amountToTransfer: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    recipient: damlTypes.Party.encode(__typed__.recipient),
    amountToTransfer: damlTypes.Numeric(10).encode(__typed__.amountToTransfer),
  };
}
,
};



exports.AssetHolding = damlTypes.assembleTemplate(
{
  templateId: '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Wallet:AssetHolding',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({owner: damlTypes.Party.decoder, symbol: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    owner: damlTypes.Party.encode(__typed__.owner),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
  Transfer: {
    template: function () { return exports.AssetHolding; },
    choiceName: 'Transfer',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Transfer.decoder; }),
    argumentEncode: function (__typed__) { return exports.Transfer.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetHolding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetHolding).encode(__typed__); },
  },
  Split: {
    template: function () { return exports.AssetHolding; },
    choiceName: 'Split',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Split.decoder; }),
    argumentEncode: function (__typed__) { return exports.Split.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.AssetHolding), damlTypes.ContractId(exports.AssetHolding)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.AssetHolding), damlTypes.ContractId(exports.AssetHolding)).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.AssetHolding; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Merge: {
    template: function () { return exports.AssetHolding; },
    choiceName: 'Merge',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Merge.decoder; }),
    argumentEncode: function (__typed__) { return exports.Merge.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.AssetHolding).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.AssetHolding).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.AssetHolding);

