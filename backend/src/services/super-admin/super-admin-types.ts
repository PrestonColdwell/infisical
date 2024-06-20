import { TSuperAdminUpdate } from "@app/db/schemas";

export type TAdminSignUpDTO = {
  email: string;
  password: string;
  publicKey: string;
  salt: string;
  lastName?: string;
  verifier: string;
  firstName: string;
  protectedKey: string;
  protectedKeyIV: string;
  protectedKeyTag: string;
  encryptedPrivateKey: string;
  encryptedPrivateKeyIV: string;
  encryptedPrivateKeyTag: string;
  ip: string;
  userAgent: string;
};

export type TUpdateServerCfgDTO = Omit<TSuperAdminUpdate, "defaultAuthOrgId"> & {
  defaultAuthOrgSlug?: string | null;
};
