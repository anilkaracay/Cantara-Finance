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


exports.UpdatePrice = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({newPrice: damlTypes.Numeric(10).decoder, now: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    newPrice: damlTypes.Numeric(10).encode(__typed__.newPrice),
    now: damlTypes.Time.encode(__typed__.now),
  };
}
,
};



exports.OraclePrice = damlTypes.assembleTemplate(
{
  templateId: '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac:Cantara.Oracle:OraclePrice',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({oracleUpdater: damlTypes.Party.decoder, admin: damlTypes.Party.decoder, observers: damlTypes.List(damlTypes.Party).decoder, symbol: damlTypes.Text.decoder, price: damlTypes.Numeric(10).decoder, lastUpdatedAt: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    oracleUpdater: damlTypes.Party.encode(__typed__.oracleUpdater),
    admin: damlTypes.Party.encode(__typed__.admin),
    observers: damlTypes.List(damlTypes.Party).encode(__typed__.observers),
    symbol: damlTypes.Text.encode(__typed__.symbol),
    price: damlTypes.Numeric(10).encode(__typed__.price),
    lastUpdatedAt: damlTypes.Time.encode(__typed__.lastUpdatedAt),
  };
}
,
  Archive: {
    template: function () { return exports.OraclePrice; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  UpdatePrice: {
    template: function () { return exports.OraclePrice; },
    choiceName: 'UpdatePrice',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.UpdatePrice.decoder; }),
    argumentEncode: function (__typed__) { return exports.UpdatePrice.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.OraclePrice).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.OraclePrice).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.OraclePrice, ['8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac', '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac']);

