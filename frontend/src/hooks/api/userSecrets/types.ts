export type TUserSecret = {
  id: string;
  name: string;
  type: string;
  encryptedData: { [key: string]: string; };
  userId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TCreatedUserSecret = {
  id: string;
};

export type TCreateUserSecretRequest = {
  name: string;
  type: string;
  encryptedData: string;
};

export type TEditUserSecretRequest = {
  id: string;
  name: string;
  type: string;
  encryptedData: string;
};

export type TViewUserSecretResponse = {
  id: string;
  name: string;
  type: string;
  encryptedData: string;
  userId: string;
  orgId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type TDeleteUserSecretRequest = {
  userSecretId: string;
};

export enum UserSecretType {
  WebLogin = "Web Login",
  CreditCard = "Credit Card",
  SecureNote = "Secure Note"
}