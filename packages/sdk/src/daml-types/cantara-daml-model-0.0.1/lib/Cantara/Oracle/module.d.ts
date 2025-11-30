// Generated from Cantara/Oracle.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type UpdatePrice = {
  newPrice: damlTypes.Numeric;
  now: damlTypes.Time;
};

export declare const UpdatePrice:
  damlTypes.Serializable<UpdatePrice> & {
  }
;


export declare type OraclePrice = {
  oracleUpdater: damlTypes.Party;
  admin: damlTypes.Party;
  observers: damlTypes.Party[];
  symbol: string;
  price: damlTypes.Numeric;
  lastUpdatedAt: damlTypes.Time;
};

export declare interface OraclePriceInterface {
  Archive: damlTypes.Choice<OraclePrice, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, OraclePrice.Key> & damlTypes.ChoiceFrom<damlTypes.Template<OraclePrice, OraclePrice.Key>>;
  UpdatePrice: damlTypes.Choice<OraclePrice, UpdatePrice, damlTypes.ContractId<OraclePrice>, OraclePrice.Key> & damlTypes.ChoiceFrom<damlTypes.Template<OraclePrice, OraclePrice.Key>>;
}
export declare const OraclePrice:
  damlTypes.Template<OraclePrice, OraclePrice.Key, '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Oracle:OraclePrice'> &
  damlTypes.ToInterface<OraclePrice, never> &
  OraclePriceInterface;

export declare namespace OraclePrice {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<OraclePrice, OraclePrice.Key, typeof OraclePrice.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<OraclePrice, typeof OraclePrice.templateId>
  export type Event = damlLedger.Event<OraclePrice, OraclePrice.Key, typeof OraclePrice.templateId>
  export type QueryResult = damlLedger.QueryResult<OraclePrice, OraclePrice.Key, typeof OraclePrice.templateId>
}


