// Generated from Cantara/Liquidation.daml
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

export declare type LiquidationRight = {
  liquidator: damlTypes.Party;
  admin: damlTypes.Party;
  user: damlTypes.Party;
  poolId: string;
  railType: Cantara_Types.RailType;
};

export declare interface LiquidationRightInterface {
  Archive: damlTypes.Choice<LiquidationRight, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, LiquidationRight.Key> & damlTypes.ChoiceFrom<damlTypes.Template<LiquidationRight, LiquidationRight.Key>>;
}
export declare const LiquidationRight:
  damlTypes.Template<LiquidationRight, LiquidationRight.Key, 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Liquidation:LiquidationRight'> &
  damlTypes.ToInterface<LiquidationRight, never> &
  LiquidationRightInterface;

export declare namespace LiquidationRight {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<LiquidationRight, LiquidationRight.Key, typeof LiquidationRight.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<LiquidationRight, typeof LiquidationRight.templateId>
  export type Event = damlLedger.Event<LiquidationRight, LiquidationRight.Key, typeof LiquidationRight.templateId>
  export type QueryResult = damlLedger.QueryResult<LiquidationRight, LiquidationRight.Key, typeof LiquidationRight.templateId>
}


