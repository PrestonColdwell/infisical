import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { ForbiddenRequestError, NotFoundError } from "@app/lib/errors";

import { TKmsServiceFactory } from "../kms/kms-service";
import { TOrgDALFactory } from "../org/org-dal";
import { TUserSecretsDALFactory } from "./user-secrets-dal";
import {
  TCreateUserSecretDTO,
  TDeleteUserSecretDTO,
  TEditUserSecretDTO,
  TGetActiveUserSecretByIdDTO,
  TGetUserSecretsDTO
} from "./user-secrets-types";

type TUserSecretsServiceFactoryDep = {
  permissionService: Pick<TPermissionServiceFactory, "getOrgPermission">;
  userSecretsDAL: TUserSecretsDALFactory;
  orgDAL: TOrgDALFactory;
  kmsService: TKmsServiceFactory;
};

export type TUserSecretsServiceFactory = ReturnType<typeof userSecretsServiceFactory>;

export const userSecretsServiceFactory = ({ permissionService, userSecretsDAL }: TUserSecretsServiceFactoryDep) => {
  const createUserSecret = async ({
    actor,
    actorId,
    orgId,
    actorAuthMethod,
    actorOrgId,
    name,
    encryptedData,
    type
  }: TCreateUserSecretDTO) => {
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);
    if (!permission) throw new ForbiddenRequestError({ name: "User is not a part of the specified organization" });

    const newUserSecret = await userSecretsDAL.create({
      name,
      type,
      userId: actorId,
      orgId,
      encryptedData
    });

    const idToReturn = `${Buffer.from(newUserSecret.id, "hex").toString("base64url")}`;

    return { id: idToReturn };
  };

  const getUserSecrets = async ({ actor, actorId, actorAuthMethod, actorOrgId, offset, limit }: TGetUserSecretsDTO) => {
    if (!actorOrgId) throw new ForbiddenRequestError();

    const { permission } = await permissionService.getOrgPermission(
      actor,
      actorId,
      actorOrgId,
      actorAuthMethod,
      actorOrgId
    );
    if (!permission) throw new ForbiddenRequestError({ name: "User does not belong to the specified organization" });

    const secrets = await userSecretsDAL.find(
      {
        userId: actorId,
        orgId: actorOrgId
      },
      { offset, limit }
    );

    return {
      secrets,
      totalCount: secrets.length
    };
  };

  const getUserSecretById = async ({ userSecretId }: TGetActiveUserSecretByIdDTO) => {
    const sharedSecret = await userSecretsDAL.findOne({
      id: userSecretId
    });

    if (!sharedSecret)
      throw new NotFoundError({
        message: `Shared secret with ID '${userSecretId}' not found`
      });

    return {
      secret: {
        ...sharedSecret
      }
    };
  };

  const editUserSecretById = async (editUserSecretInput: TEditUserSecretDTO) => {
    const { actor, actorId, orgId, actorAuthMethod, actorOrgId, id, name, type, encryptedData } = editUserSecretInput;
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);
    if (!permission) throw new ForbiddenRequestError({ name: "User does not belong to the specified organization" });

    const updatedSecret = await userSecretsDAL.updateById(id, {
      name,
      type,
      encryptedData
    });

    return updatedSecret;
  };

  const deleteUserSecretById = async (deleteUserSecretInput: TDeleteUserSecretDTO) => {
    const { actor, actorId, orgId, actorAuthMethod, actorOrgId, userSecretId } = deleteUserSecretInput;
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);
    if (!permission) throw new ForbiddenRequestError({ name: "User does not belong to the specified organization" });

    const userSecret = await userSecretsDAL.findById(userSecretId);

    if (userSecret.orgId && userSecret.orgId !== orgId)
      throw new ForbiddenRequestError({ message: "User does not have permission to delete shared secret" });

    const deletedUserSecret = await userSecretsDAL.deleteById(userSecretId);

    return deletedUserSecret;
  };

  return {
    createUserSecret,
    editUserSecretById,
    getUserSecrets,
    deleteUserSecretById,
    getUserSecretById
  };
};
