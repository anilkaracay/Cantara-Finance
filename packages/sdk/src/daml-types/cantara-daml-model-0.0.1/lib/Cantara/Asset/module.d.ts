// Generated from Cantara/Asset.daml
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

export declare type UpdateRiskParams = {
  newRiskParams: Cantara_Types.RiskParams;
};

export declare const UpdateRiskParams:
  damlTypes.Serializable<UpdateRiskParams> & {
  }
;


export declare type SupportedAsset = {
  admin: damlTypes.Party;
  symbol: string;
  assetClass: Cantara_Types.AssetClass;
  decimals: damlTypes.Int;
  riskParams: Cantara_Types.RiskParams;
};

export declare interface SupportedAssetInterface {
  Archive: damlTypes.Choice<SupportedAsset, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, SupportedAsset.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SupportedAsset, SupportedAsset.Key>>;
  UpdateRiskParams: damlTypes.Choice<SupportedAsset, UpdateRiskParams, damlTypes.ContractId<SupportedAsset>, SupportedAsset.Key> & damlTypes.ChoiceFrom<damlTypes.Template<SupportedAsset, SupportedAsset.Key>>;
}
export declare const SupportedAsset:
  damlTypes.Template<SupportedAsset, SupportedAsset.Key, '015064c8bfa936039d8e04e5d370ef00ede4fe76e304d7940a53ad3e4071090d:Cantara.Asset:SupportedAsset'> &
  damlTypes.ToInterface<SupportedAsset, never> &
  SupportedAssetInterface;

export declare namespace SupportedAsset {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<SupportedAsset, SupportedAsset.Key, typeof SupportedAsset.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<SupportedAsset, typeof SupportedAsset.templateId>
  export type Event = damlLedger.Event<SupportedAsset, SupportedAsset.Key, typeof SupportedAsset.templateId>
  export type QueryResult = damlLedger.QueryResult<SupportedAsset, SupportedAsset.Key, typeof SupportedAsset.templateId>
}


