import { TGenericPermission } from "@app/lib/types";

import { ActorAuthMethod, ActorType } from "../auth/auth-type";

export type TGetUserSecretsDTO = {
  offset: number;
  limit: number;
} & TGenericPermission;

export type TCreateUserSecretDTO = {
  actor: ActorType;
  actorId: string;
  actorAuthMethod: ActorAuthMethod;
  actorOrgId: string;
  orgId: string;
  name: string;
  encryptedData: string;
  type: string;
};

export type TEditUserSecretDTO = {
  id: string;
} & TCreateUserSecretDTO &
  TGenericPermission;

export type TGetActiveUserSecretByIdDTO = {
  userSecretId: string;
};

export type TDeleteUserSecretDTO = {
  orgId: string;
  userSecretId: string;
} & TGenericPermission;
