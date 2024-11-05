import { TUserSecret } from "@app/hooks/api/userSecrets";

const UserSecretsDataColumn = ({ encryptedData, type }: TUserSecret): React.ReactNode => {
  const data: { [key: string]: string } = encryptedData as {};
  const underlineStyle = { textDecoration: "underline", textDecorationThickness: "1px" };
  const preWrapStyle = { whiteSpace: "pre-wrap" };

  switch (type) {
    case "0": {
      // Login credentials
      const { username, password } = data;
      return (
        <div>
          <div>
            <strong style={underlineStyle}>Username:</strong> {username}
          </div>
          <div>
            <strong style={underlineStyle}>Password:</strong> {password}
          </div>
        </div>
      );
    }
    case "1": {
      // Credit card
      const { cvv, cardNumber, expirationDate } = data;
      return (
        <div>
          <div>
            <strong style={underlineStyle}>Card Number:</strong> {cardNumber}
          </div>
          <div>
            <strong style={underlineStyle}>Expiration Date:</strong> {expirationDate}
          </div>
          <div>
            <strong style={underlineStyle}>CVV:</strong> {cvv}
          </div>
        </div>
      );
    }
    case "2": {
      // Personal note
      const entries = Object.entries(data);
      return <div style={preWrapStyle}>{entries[0][1]}</div>;
    }
    default:
      return "******";
  }
};

export default UserSecretsDataColumn;
