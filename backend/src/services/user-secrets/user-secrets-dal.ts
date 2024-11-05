import { TDbClient } from "@app/db";
import { TableName } from "@app/db/schemas";
import { ormify } from "@app/lib/knex";

export type TUserSecretsDALFactory = ReturnType<typeof userSecretsDALFactory>;

export const userSecretsDALFactory = (db: TDbClient) => {
  const userSecretOrm = ormify(db, TableName.UserSecrets);

  // const countAllUserOrgSharedSecrets = async ({ orgId, userId }: { orgId: string; userId: string }) => {
  //   try {
  //     interface CountResult {
  //       count: string;
  //     }

  //     const count = await db
  //       .replicaNode()(TableName.SecretSharing)
  //       .where(`${TableName.SecretSharing}.orgId`, orgId)
  //       .where(`${TableName.SecretSharing}.userId`, userId)
  //       .count("*")
  //       .first();

  //     return parseInt((count as unknown as CountResult).count || "0", 10);
  //   } catch (error) {
  //     throw new DatabaseError({ error, name: "Count all user-org shared secrets" });
  //   }
  // };

  // const pruneExpiredSharedSecrets = async (tx?: Knex) => {
  //   logger.info(`${QueueName.DailyResourceCleanUp}: pruning expired shared secret started`);
  //   try {
  //     const today = new Date();
  //     const docs = await (tx || db)(TableName.SecretSharing)
  //       .where("expiresAt", "<", today)
  //       .andWhere("encryptedValue", "<>", "")
  //       .update({
  //         encryptedValue: "",
  //         tag: "",
  //         iv: ""
  //       });
  //     logger.info(`${QueueName.DailyResourceCleanUp}: pruning expired shared secret completed`);
  //     return docs;
  //   } catch (error) {
  //     throw new DatabaseError({ error, name: "pruneExpiredSharedSecrets" });
  //   }
  // };

  // const findActiveSharedSecrets = async (filters: Partial<TSecretSharing>, tx?: Knex) => {
  //   try {
  //     const now = new Date();
  //     return await (tx || db)(TableName.SecretSharing)
  //       .where(filters)
  //       .andWhere("expiresAt", ">", now)
  //       .andWhere("encryptedValue", "<>", "")
  //       .select(selectAllTableCols(TableName.SecretSharing))
  //       .orderBy("expiresAt", "asc");
  //   } catch (error) {
  //     throw new DatabaseError({
  //       error,
  //       name: "Find Active Shared Secrets"
  //     });
  //   }
  // };

  // const softDeleteById = async (id: string) => {
  //   try {
  //     await userSecretOrm.updateById(id, {
  //       // encryptedValue: "",
  //       // iv: "",
  //       // tag: ""
  //     });
  //   } catch (error) {
  //     throw new DatabaseError({
  //       error,
  //       name: "Soft Delete Shared Secret"
  //     });
  //   }
  // };

  return {
    ...userSecretOrm
    // countAllUserOrgSharedSecrets,
    // pruneExpiredSharedSecrets,
    // softDeleteById,
    // findActiveSharedSecrets
  };
};
