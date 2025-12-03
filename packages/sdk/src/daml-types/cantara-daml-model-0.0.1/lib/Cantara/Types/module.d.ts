// Generated from Cantara/Types.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

export declare type RiskParams = {
  rpMaxLtv: damlTypes.Numeric;
  rpLiquidationThreshold: damlTypes.Numeric;
  rpLiquidationBonus: damlTypes.Numeric;
  rpMinHealthFactor: damlTypes.Numeric;
  rpRailType: RailType;
};

export declare const RiskParams:
  damlTypes.Serializable<RiskParams> & {
  }
;


export declare type AssetClass =
  | 'ClassA'
  | 'ClassAA'
  | 'ClassB'
  | 'ClassR'
;

export declare const AssetClass:
  damlTypes.Serializable<AssetClass> & {
  }
& { readonly keys: AssetClass[] } & { readonly [e in AssetClass]: e }
;


export declare type Visibility =
  | 'Public'
  | 'Private'
;

export declare const Visibility:
  damlTypes.Serializable<Visibility> & {
  }
& { readonly keys: Visibility[] } & { readonly [e in Visibility]: e }
;


export declare type RailType =
  | 'Permissionless'
  | 'Permissioned'
;

export declare const RailType:
  damlTypes.Serializable<RailType> & {
  }
& { readonly keys: RailType[] } & { readonly [e in RailType]: e }
;

