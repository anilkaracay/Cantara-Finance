// Generated from Cantara/Permissioned.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

import * as Cantara_Types from '../../Cantara/Types/module';

export declare type Revoke = {
};

export declare const Revoke:
  damlTypes.Serializable<Revoke> & {
  }
;


export declare type KycVerifiedUser = {
  admin: damlTypes.Party;
  institution: damlTypes.Party;
  user: damlTypes.Party;
  railType: Cantara_Types.RailType;
  createdAt: damlTypes.Time;
};

export declare interface KycVerifiedUserInterface {
  Archive: damlTypes.Choice<KycVerifiedUser, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<KycVerifiedUser, undefined>>;
  Revoke: damlTypes.Choice<KycVerifiedUser, Revoke, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<KycVerifiedUser, undefined>>;
}
export declare const KycVerifiedUser:
  damlTypes.Template<KycVerifiedUser, undefined, 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:KycVerifiedUser'> &
  damlTypes.ToInterface<KycVerifiedUser, never> &
  KycVerifiedUserInterface;

export declare namespace KycVerifiedUser {
  export type CreateEvent = damlLedger.CreateEvent<KycVerifiedUser, undefined, typeof KycVerifiedUser.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<KycVerifiedUser, typeof KycVerifiedUser.templateId>
  export type Event = damlLedger.Event<KycVerifiedUser, undefined, typeof KycVerifiedUser.templateId>
  export type QueryResult = damlLedger.QueryResult<KycVerifiedUser, undefined, typeof KycVerifiedUser.templateId>
}



export declare type WithdrawCapital = {
  amount: damlTypes.Numeric;
  now: damlTypes.Time;
};

export declare const WithdrawCapital:
  damlTypes.Serializable<WithdrawCapital> & {
  }
;


export declare type DepositMoreCapital = {
  amount: damlTypes.Numeric;
  now: damlTypes.Time;
};

export declare const DepositMoreCapital:
  damlTypes.Serializable<DepositMoreCapital> & {
  }
;


export declare type InstitutionalCapital = {
  admin: damlTypes.Party;
  institution: damlTypes.Party;
  poolId: string;
  railType: Cantara_Types.RailType;
  visibility: Cantara_Types.Visibility;
  assetSymbol: string;
  suppliedAmount: damlTypes.Numeric;
  createdAt: damlTypes.Time;
  regulator: damlTypes.Optional<damlTypes.Party>;
};

export declare interface InstitutionalCapitalInterface {
  DepositMoreCapital: damlTypes.Choice<InstitutionalCapital, DepositMoreCapital, damlTypes.ContractId<InstitutionalCapital>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<InstitutionalCapital, undefined>>;
  WithdrawCapital: damlTypes.Choice<InstitutionalCapital, WithdrawCapital, damlTypes.ContractId<InstitutionalCapital>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<InstitutionalCapital, undefined>>;
  Archive: damlTypes.Choice<InstitutionalCapital, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<InstitutionalCapital, undefined>>;
}
export declare const InstitutionalCapital:
  damlTypes.Template<InstitutionalCapital, undefined, 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:InstitutionalCapital'> &
  damlTypes.ToInterface<InstitutionalCapital, never> &
  InstitutionalCapitalInterface;

export declare namespace InstitutionalCapital {
  export type CreateEvent = damlLedger.CreateEvent<InstitutionalCapital, undefined, typeof InstitutionalCapital.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<InstitutionalCapital, typeof InstitutionalCapital.templateId>
  export type Event = damlLedger.Event<InstitutionalCapital, undefined, typeof InstitutionalCapital.templateId>
  export type QueryResult = damlLedger.QueryResult<InstitutionalCapital, undefined, typeof InstitutionalCapital.templateId>
}



export declare type UpdateRiskProfile = {
  newRiskProfile: string;
};

export declare const UpdateRiskProfile:
  damlTypes.Serializable<UpdateRiskProfile> & {
  }
;


export declare type Institution = {
  admin: damlTypes.Party;
  institution: damlTypes.Party;
  name: string;
  country: string;
  riskProfile: string;
  visibility: Cantara_Types.Visibility;
  regulator: damlTypes.Optional<damlTypes.Party>;
};

export declare interface InstitutionInterface {
  UpdateRiskProfile: damlTypes.Choice<Institution, UpdateRiskProfile, damlTypes.ContractId<Institution>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Institution, undefined>>;
  Archive: damlTypes.Choice<Institution, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Institution, undefined>>;
}
export declare const Institution:
  damlTypes.Template<Institution, undefined, 'e80c8d9fb743a9f580a64b7c5fb99e33250eaaed765283ea9c7f39e3f1e8d42c:Cantara.Permissioned:Institution'> &
  damlTypes.ToInterface<Institution, never> &
  InstitutionInterface;

export declare namespace Institution {
  export type CreateEvent = damlLedger.CreateEvent<Institution, undefined, typeof Institution.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Institution, typeof Institution.templateId>
  export type Event = damlLedger.Event<Institution, undefined, typeof Institution.templateId>
  export type QueryResult = damlLedger.QueryResult<Institution, undefined, typeof Institution.templateId>
}


