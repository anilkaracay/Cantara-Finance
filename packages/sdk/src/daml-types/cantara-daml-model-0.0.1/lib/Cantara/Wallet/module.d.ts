// Generated from Cantara/Wallet.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type Merge = {
  otherCid: damlTypes.ContractId<AssetHolding>;
};

export declare const Merge:
  damlTypes.Serializable<Merge> & {
  }
;


export declare type Split = {
  splitAmount: damlTypes.Numeric;
};

export declare const Split:
  damlTypes.Serializable<Split> & {
  }
;


export declare type Transfer = {
  recipient: damlTypes.Party;
  amountToTransfer: damlTypes.Numeric;
};

export declare const Transfer:
  damlTypes.Serializable<Transfer> & {
  }
;


export declare type AssetHolding = {
  owner: damlTypes.Party;
  symbol: string;
  amount: damlTypes.Numeric;
};

export declare interface AssetHoldingInterface {
  Transfer: damlTypes.Choice<AssetHolding, Transfer, damlTypes.ContractId<AssetHolding>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetHolding, undefined>>;
  Split: damlTypes.Choice<AssetHolding, Split, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<AssetHolding>, damlTypes.ContractId<AssetHolding>>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetHolding, undefined>>;
  Archive: damlTypes.Choice<AssetHolding, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetHolding, undefined>>;
  Merge: damlTypes.Choice<AssetHolding, Merge, damlTypes.ContractId<AssetHolding>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<AssetHolding, undefined>>;
}
export declare const AssetHolding:
  damlTypes.Template<AssetHolding, undefined, '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Wallet:AssetHolding'> &
  damlTypes.ToInterface<AssetHolding, never> &
  AssetHoldingInterface;

export declare namespace AssetHolding {
  export type CreateEvent = damlLedger.CreateEvent<AssetHolding, undefined, typeof AssetHolding.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<AssetHolding, typeof AssetHolding.templateId>
  export type Event = damlLedger.Event<AssetHolding, undefined, typeof AssetHolding.templateId>
  export type QueryResult = damlLedger.QueryResult<AssetHolding, undefined, typeof AssetHolding.templateId>
}


