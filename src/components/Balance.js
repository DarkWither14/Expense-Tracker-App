import React, { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

const Balance = () => {
  const { getBalance } = useContext(TransactionContext);

  return (
    <div className="balance">
      <h2>Current Balance: ${getBalance()}</h2>
    </div>
  );
};

export default Balance;