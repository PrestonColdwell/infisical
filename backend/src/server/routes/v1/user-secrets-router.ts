import { z } from "zod";

import { UserSecretsSchema } from "@app/db/schemas";
import { readLimit, writeLimit } from "@app/server/config/rateLimiter";
import { verifyAuth } from "@app/server/plugins/auth/verify-auth";
import { AuthMode } from "@app/services/auth/auth-type";

export const registerUserSecretRouter = async (server: FastifyZodProvider) => {
  server.route({
    method: "GET",
    url: "/",
    config: {
      rateLimit: readLimit
    },
    schema: {
      querystring: z.object({
        offset: z.coerce.number().min(0).max(100).default(0),
        limit: z.coerce.number().min(1).max(100).default(25)
      }),
      response: {
        200: z.object({
          secrets: z.array(UserSecretsSchema),
          totalCount: z.number()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { secrets, totalCount } = await req.server.services.userSecrets.getUserSecrets({
        actor: req.permission.type,
        actorId: req.permission.id,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.query
      });

      return {
        secrets,
        totalCount
      };
    }
  });

  // server.route({
  //   method: "POST",
  //   url: "/public/:id",
  //   config: {
  //     rateLimit: publicEndpointLimit
  //   },
  //   schema: {
  //     params: z.object({
  //       id: z.string()
  //     }),
  //     body: z.object({
  //       hashedHex: z.string().min(1).optional(),
  //       password: z.string().optional()
  //     }),
  //     response: {
  //       200: z.object({
  //         isPasswordProtected: z.boolean(),
  //         secret: SecretSharingSchema.pick({
  //           encryptedValue: true,
  //           iv: true,
  //           tag: true,
  //           expiresAt: true,
  //           expiresAfterViews: true,
  //           accessType: true
  //         })
  //           .extend({
  //             orgName: z.string().optional(),
  //             secretValue: z.string().optional()
  //           })
  //           .optional()
  //       })
  //     }
  //   },
  //   handler: async (req) => {
  //     const sharedSecret = await req.server.services.secretSharing.getSharedSecretById({
  //       sharedSecretId: req.params.id,
  //       hashedHex: req.body.hashedHex,
  //       password: req.body.password,
  //       orgId: req.permission?.orgId
  //     });

  //     return sharedSecret;
  //   }
  // });

  server.route({
    method: "PUT",
    url: "/:userSecretId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      body: z.object({
        id: z.string(),
        name: z.string().max(50),
        type: z.string(),
        encryptedData: z.string()
      }),
      response: {
        200: z.object({
          id: z.string()
        })
      }
    },
    handler: async (req) => {
      const updatedSecret = await req.server.services.userSecrets.editUserSecretById({
        actor: req.permission.type,
        actorId: req.permission.id,
        orgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body
      });
      return { id: updatedSecret.id };
    }
  });

  server.route({
    method: "POST",
    url: "/",
    config: {
      // rateLimit: publicSecretShareCreationLimit
    },
    schema: {
      body: z.object({
        name: z.string().max(50),
        type: z.string(),
        encryptedData: z.string()
      }),
      response: {
        200: z.object({
          id: z.string()
        })
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const userSecret = await req.server.services.userSecrets.createUserSecret({
        actor: req.permission.type,
        actorId: req.permission.id,
        orgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        ...req.body
      });
      return { id: userSecret.id };
    }
  });

  server.route({
    method: "DELETE",
    url: "/:userSecretId",
    config: {
      rateLimit: writeLimit
    },
    schema: {
      params: z.object({
        userSecretId: z.string()
      }),
      response: {
        200: UserSecretsSchema
      }
    },
    onRequest: verifyAuth([AuthMode.JWT]),
    handler: async (req) => {
      const { userSecretId } = req.params;
      const deletedUserSecret = await req.server.services.userSecrets.deleteUserSecretById({
        actor: req.permission.type,
        actorId: req.permission.id,
        orgId: req.permission.orgId,
        actorAuthMethod: req.permission.authMethod,
        actorOrgId: req.permission.orgId,
        userSecretId
      });

      return { ...deletedUserSecret };
    }
  });
};
