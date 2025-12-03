// Generated from Cantara/Position.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Cantara_Liquidation from '../../Cantara/Liquidation/module';
import * as Cantara_Oracle from '../../Cantara/Oracle/module';
import * as Cantara_Pool from '../../Cantara/Pool/module';
import * as Cantara_Types from '../../Cantara/Types/module';
import * as Cantara_Wallet from '../../Cantara/Wallet/module';

export declare type OpenPermissionedPosition = {
  user: damlTypes.Party;
  poolId: string;
  assetSymbol: string;
  institution: damlTypes.Party;
  riskParams: Cantara_Types.RiskParams;
  now: damlTypes.Time;
  kycVerifiedInput: boolean;
  visibility: Cantara_Types.Visibility;
  regulator: damlTypes.Optional<damlTypes.Party>;
};

export declare const OpenPermissionedPosition:
  damlTypes.Serializable<OpenPermissionedPosition> & {
  }
;


export declare type PositionFactory = {
  admin: damlTypes.Party;
};

export declare interface PositionFactoryInterface {
  Archive: damlTypes.Choice<PositionFactory, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PositionFactory, undefined>>;
  OpenPermissionedPosition: damlTypes.Choice<PositionFactory, OpenPermissionedPosition, damlTypes.ContractId<UserPosition>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PositionFactory, undefined>>;
}
export declare const PositionFactory:
  damlTypes.Template<PositionFactory, undefined, '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac:Cantara.Position:PositionFactory'> &
  damlTypes.ToInterface<PositionFactory, never> &
  PositionFactoryInterface;

export declare namespace PositionFactory {
  export type CreateEvent = damlLedger.CreateEvent<PositionFactory, undefined, typeof PositionFactory.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PositionFactory, typeof PositionFactory.templateId>
  export type Event = damlLedger.Event<PositionFactory, undefined, typeof PositionFactory.templateId>
  export type QueryResult = damlLedger.QueryResult<PositionFactory, undefined, typeof PositionFactory.templateId>
}



export declare type UserPosition = {
  user: damlTypes.Party;
  admin: damlTypes.Party;
  poolId: string;
  railType: Cantara_Types.RailType;
  assetSymbol: string;
  collateralAmount: damlTypes.Numeric;
  debtAmount: damlTypes.Numeric;
  lastAccrualTime: damlTypes.Time;
  riskParams: Cantara_Types.RiskParams;
  ownerInstitution: damlTypes.Optional<damlTypes.Party>;
  kycVerified: boolean;
  visibility: damlTypes.Optional<Cantara_Types.Visibility>;
  regulator: damlTypes.Optional<damlTypes.Party>;
};

export declare interface UserPositionInterface {
  Archive: damlTypes.Choice<UserPosition, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserPosition, undefined>>;
}
export declare const UserPosition:
  damlTypes.Template<UserPosition, undefined, '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac:Cantara.Position:UserPosition'> &
  damlTypes.ToInterface<UserPosition, never> &
  UserPositionInterface;

export declare namespace UserPosition {
  export type CreateEvent = damlLedger.CreateEvent<UserPosition, undefined, typeof UserPosition.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<UserPosition, typeof UserPosition.templateId>
  export type Event = damlLedger.Event<UserPosition, undefined, typeof UserPosition.templateId>
  export type QueryResult = damlLedger.QueryResult<UserPosition, undefined, typeof UserPosition.templateId>
}



export declare type Liquidate = {
  liquidator: damlTypes.Party;
  liquidationRightCid: damlTypes.ContractId<Cantara_Liquidation.LiquidationRight>;
  assetSymbol: string;
  debtSymbol: string;
  repayAmount: damlTypes.Numeric;
  oracleCids: damlTypes.ContractId<Cantara_Oracle.OraclePrice>[];
};

export declare const Liquidate:
  damlTypes.Serializable<Liquidate> & {
  }
;


export declare type Withdraw = {
  symbol: string;
  amount: damlTypes.Numeric;
  poolCid: damlTypes.ContractId<Cantara_Pool.LendingPool>;
  oracleCids: damlTypes.ContractId<Cantara_Oracle.OraclePrice>[];
};

export declare const Withdraw:
  damlTypes.Serializable<Withdraw> & {
  }
;


export declare type Repay = {
  assetCid: damlTypes.ContractId<Cantara_Wallet.AssetHolding>;
  poolCid: damlTypes.ContractId<Cantara_Pool.LendingPool>;
};

export declare const Repay:
  damlTypes.Serializable<Repay> & {
  }
;


export declare type Borrow = {
  symbol: string;
  amount: damlTypes.Numeric;
  poolCid: damlTypes.ContractId<Cantara_Pool.LendingPool>;
  oracleCids: damlTypes.ContractId<Cantara_Oracle.OraclePrice>[];
};

export declare const Borrow:
  damlTypes.Serializable<Borrow> & {
  }
;


export declare type Deposit = {
  assetCid: damlTypes.ContractId<Cantara_Wallet.AssetHolding>;
  poolCid: damlTypes.ContractId<Cantara_Pool.LendingPool>;
};

export declare const Deposit:
  damlTypes.Serializable<Deposit> & {
  }
;


export declare type Portfolio = {
  user: damlTypes.Party;
  admin: damlTypes.Party;
  deposits: damlTypes.Map<string, damlTypes.Numeric>;
  borrows: damlTypes.Map<string, damlTypes.Numeric>;
  lastAccrualTime: damlTypes.Time;
};

export declare interface PortfolioInterface {
  Deposit: damlTypes.Choice<Portfolio, Deposit, damlTypes.ContractId<Portfolio>, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
  Borrow: damlTypes.Choice<Portfolio, Borrow, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Portfolio>, damlTypes.ContractId<Cantara_Wallet.AssetHolding>>, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
  Repay: damlTypes.Choice<Portfolio, Repay, damlTypes.ContractId<Portfolio>, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
  Withdraw: damlTypes.Choice<Portfolio, Withdraw, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Portfolio>, damlTypes.ContractId<Cantara_Wallet.AssetHolding>>, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
  Liquidate: damlTypes.Choice<Portfolio, Liquidate, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<Portfolio>, damlTypes.ContractId<Cantara_Wallet.AssetHolding>>, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
  Archive: damlTypes.Choice<Portfolio, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Portfolio.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Portfolio, Portfolio.Key>>;
}
export declare const Portfolio:
  damlTypes.Template<Portfolio, Portfolio.Key, '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac:Cantara.Position:Portfolio'> &
  damlTypes.ToInterface<Portfolio, never> &
  PortfolioInterface;

export declare namespace Portfolio {
  export type Key = damlTypes.Party
  export type CreateEvent = damlLedger.CreateEvent<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Portfolio, typeof Portfolio.templateId>
  export type Event = damlLedger.Event<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
  export type QueryResult = damlLedger.QueryResult<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
}



export declare type UserAction = {
  actor: damlTypes.Party;
  user: damlTypes.Party;
  actionType: string;
  assetSymbol: string;
  amount: damlTypes.Numeric;
  timestamp: damlTypes.Time;
};

export declare interface UserActionInterface {
  Archive: damlTypes.Choice<UserAction, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<UserAction, undefined>>;
}
export declare const UserAction:
  damlTypes.Template<UserAction, undefined, '8940a9fd6a414732665a9c7ad3e19c5a67e47f109b665c04e8ac3a0a60873aac:Cantara.Position:UserAction'> &
  damlTypes.ToInterface<UserAction, never> &
  UserActionInterface;

export declare namespace UserAction {
  export type CreateEvent = damlLedger.CreateEvent<UserAction, undefined, typeof UserAction.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<UserAction, typeof UserAction.templateId>
  export type Event = damlLedger.Event<UserAction, undefined, typeof UserAction.templateId>
  export type QueryResult = damlLedger.QueryResult<UserAction, undefined, typeof UserAction.templateId>
}


