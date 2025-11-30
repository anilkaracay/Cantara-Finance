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
import * as Cantara_Wallet from '../../Cantara/Wallet/module';

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
  damlTypes.Template<Portfolio, Portfolio.Key, '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Position:Portfolio'> &
  damlTypes.ToInterface<Portfolio, never> &
  PortfolioInterface;

export declare namespace Portfolio {
  export type Key = damlTypes.Party
  export type CreateEvent = damlLedger.CreateEvent<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Portfolio, typeof Portfolio.templateId>
  export type Event = damlLedger.Event<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
  export type QueryResult = damlLedger.QueryResult<Portfolio, Portfolio.Key, typeof Portfolio.templateId>
}


