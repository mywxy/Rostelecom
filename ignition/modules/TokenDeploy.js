const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TokenDeploy", (m) => {
  const account0 = m.getAccount(0);
  const erc20_smart_contract = m.contract("Token", [], { from: account0 });
  return { erc20_smart_contract };
});
