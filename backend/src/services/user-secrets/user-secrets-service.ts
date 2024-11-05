import { TPermissionServiceFactory } from "@app/ee/services/permission/permission-service";
import { ForbiddenRequestError, NotFoundError } from "@app/lib/errors";

import { TKmsServiceFactory } from "../kms/kms-service";
import { TOrgDALFactory } from "../org/org-dal";
import { TUserSecretsDALFactory } from "./user-secrets-dal";
import {
  TCreateUserSecretDTO,
  TDeleteUserSecretDTO,
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

// const isUuidV4 = (uuid: string) => z.string().uuid().safeParse(uuid).success;

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

    // if (secretValue.length > 10_000) {
    //   throw new BadRequestError({ message: "Shared secret value too long" });
    // }

    // const encryptWithRoot = kmsService.encryptWithRootKey();

    // const encryptedSecret = encryptWithRoot(Buffer.from(encryptedData));

    // const id = crypto.randomBytes(32).toString("hex");
    // const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

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

    // const count = await userSecretsDAL.countAllUserOrgSharedSecrets({
    //   orgId: actorOrgId,
    //   userId: actorId
    // });

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

    // const { accessType, expiresAt, expiresAfterViews } = sharedSecret;

    // const orgName = sharedSecret.orgId ? (await orgDAL.findOrgById(sharedSecret.orgId))?.name : "";

    // if (accessType === SecretSharingAccessType.Organization && orgId !== sharedSecret.orgId)
    // throw new ForbiddenRequestError();

    // all secrets pass through here, meaning we check if its expired first and then check if it needs verification
    // or can be safely sent to the client.
    // if (expiresAt !== null && expiresAt < new Date()) {
    // check lifetime expiry
    //   await secretSharingDAL.softDeleteById(sharedSecretId);
    //   throw new ForbiddenRequestError({
    //     message: "Access denied: Secret has expired by lifetime"
    //   });
    // }

    // if (expiresAfterViews !== null && expiresAfterViews === 0) {
    //   // check view count expiry
    //   await secretSharingDAL.softDeleteById(sharedSecretId);
    //   throw new ForbiddenRequestError({
    //     message: "Access denied: Secret has expired by view count"
    //   });
    // }

    // const isPasswordProtected = Boolean(sharedSecret.password);
    // const hasProvidedPassword = Boolean(password);
    // if (isPasswordProtected) {
    //   if (hasProvidedPassword) {
    //     const isMatch = await bcrypt.compare(password as string, sharedSecret.password as string);
    //     if (!isMatch) throw new UnauthorizedError({ message: "Invalid credentials" });
    //   } else {
    //     return { isPasswordProtected };
    //   }
    // }

    // If encryptedSecret is set, we know that this secret has been encrypted using KMS, and we can therefore do server-side decryption.
    // let decryptedSecretValue: Buffer | undefined;
    // if (sharedSecret.encryptedSecret) {
    //   const decryptWithRoot = kmsService.decryptWithRootKey();
    //   decryptedSecretValue = decryptWithRoot(sharedSecret.encryptedSecret);
    // }

    // decrement when we are sure the user will view secret.
    // await $decrementSecretViewCount(sharedSecret);

    return {
      // isPasswordProtected,
      secret: {
        ...sharedSecret
        // ...(decryptedSecretValue && {
        //   secretValue: Buffer.from(decryptedSecretValue).toString()
        // }),
        // orgName:
        //   sharedSecret.accessType === SecretSharingAccessType.Organization && orgId === sharedSecret.orgId
        //     ? orgName
        //     : undefined
      }
    };
  };

  const deleteUserSecretById = async (deleteUserSecretInput: TDeleteUserSecretDTO) => {
    const { actor, actorId, orgId, actorAuthMethod, actorOrgId, userSecretId } = deleteUserSecretInput;
    const { permission } = await permissionService.getOrgPermission(actor, actorId, orgId, actorAuthMethod, actorOrgId);
    if (!permission) throw new ForbiddenRequestError({ name: "User does not belong to the specified organization" });

    const sharedSecret = await userSecretsDAL.findById(userSecretId);

    if (sharedSecret.orgId && sharedSecret.orgId !== orgId)
      throw new ForbiddenRequestError({ message: "User does not have permission to delete shared secret" });

    const deletedSharedSecret = await userSecretsDAL.deleteById(userSecretId);

    return deletedSharedSecret;
  };

  return {
    createUserSecret,
    // createPublicSharedSecret,
    getUserSecrets,
    deleteUserSecretById,
    // getSharedSecretById
    getUserSecretById
  };
};
