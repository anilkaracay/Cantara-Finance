// Generated from Cantara/Pool.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Cantara_Types from '../../Cantara/Types/module';

export declare type UpdatePoolState = {
  actor: damlTypes.Party;
  deltaDeposits: damlTypes.Numeric;
  deltaBorrows: damlTypes.Numeric;
};

export declare const UpdatePoolState:
  damlTypes.Serializable<UpdatePoolState> & {
  }
;


export declare type ConfigureInterestModel = {
  newBaseRate: damlTypes.Numeric;
  newSlope1: damlTypes.Numeric;
  newSlope2: damlTypes.Numeric;
  newKinkUtilization: damlTypes.Numeric;
};

export declare const ConfigureInterestModel:
  damlTypes.Serializable<ConfigureInterestModel> & {
  }
;


export declare type LendingPool = {
  admin: damlTypes.Party;
  observers: damlTypes.Party[];
  poolId: string;
  railType: Cantara_Types.RailType;
  assetSymbol: string;
  assetClass: Cantara_Types.AssetClass;
  totalDeposits: damlTypes.Numeric;
  totalBorrows: damlTypes.Numeric;
  baseRate: damlTypes.Numeric;
  slope1: damlTypes.Numeric;
  slope2: damlTypes.Numeric;
  kinkUtilization: damlTypes.Numeric;
  riskParams: Cantara_Types.RiskParams;
  ownerInstitution: damlTypes.Optional<damlTypes.Party>;
  rwaReference: damlTypes.Optional<string>;
  maturityDate: damlTypes.Optional<damlTypes.Time>;
  visibility: damlTypes.Optional<Cantara_Types.Visibility>;
  category: damlTypes.Optional<string>;
};

export declare interface LendingPoolInterface {
  UpdatePoolState: damlTypes.Choice<LendingPool, UpdatePoolState, damlTypes.ContractId<LendingPool>, LendingPool.Key> & damlTypes.ChoiceFrom<damlTypes.Template<LendingPool, LendingPool.Key>>;
  ConfigureInterestModel: damlTypes.Choice<LendingPool, ConfigureInterestModel, damlTypes.ContractId<LendingPool>, LendingPool.Key> & damlTypes.ChoiceFrom<damlTypes.Template<LendingPool, LendingPool.Key>>;
  Archive: damlTypes.Choice<LendingPool, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, LendingPool.Key> & damlTypes.ChoiceFrom<damlTypes.Template<LendingPool, LendingPool.Key>>;
}
export declare const LendingPool:
  damlTypes.Template<LendingPool, LendingPool.Key, 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Pool:LendingPool'> &
  damlTypes.ToInterface<LendingPool, never> &
  LendingPoolInterface;

export declare namespace LendingPool {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<LendingPool, LendingPool.Key, typeof LendingPool.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LendingPool, typeof LendingPool.templateId>
  export type Event = damlLedger.Event<LendingPool, LendingPool.Key, typeof LendingPool.templateId>
  export type QueryResult = damlLedger.QueryResult<LendingPool, LendingPool.Key, typeof LendingPool.templateId>
}


