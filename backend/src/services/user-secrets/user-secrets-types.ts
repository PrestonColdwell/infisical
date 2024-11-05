import { SecretSharingAccessType, TGenericPermission } from "@app/lib/types";

import { ActorAuthMethod, ActorType } from "../auth/auth-type";

export type TGetUserSecretsDTO = {
  offset: number;
  limit: number;
} & TGenericPermission;

export type TSharedSecretPermission = {
  actor: ActorType;
  actorId: string;
  actorAuthMethod: ActorAuthMethod;
  actorOrgId: string;
  orgId: string;
  accessType?: SecretSharingAccessType;
  name?: string;
  password?: string;
};

export type TCreatePublicSharedSecretDTO = {
  secretValue: string;
  expiresAt: string;
  expiresAfterViews?: number;
  password?: string;
  accessType: SecretSharingAccessType;
};

export type TGetActiveUserSecretByIdDTO = {
  userSecretId: string;
};

// export type TValidateActiveSharedSecretDTO = TGetActiveSharedSecretByIdDTO & {
//   password: string;
// };

export type TCreateSharedSecretDTO = TSharedSecretPermission & TCreatePublicSharedSecretDTO;

export type TDeleteSharedSecretDTO = {
  sharedSecretId: string;
} & TSharedSecretPermission;
