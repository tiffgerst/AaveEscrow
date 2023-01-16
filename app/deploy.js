import Escrow from './artifacts/contracts/Escrow.sol/Escrow';
import IERC20 from './artifacts/contracts/interfaces/IERC20.sol/IERC20';
import {ethers} from 'ethers';

// you can find a list of all AAVE contracts deployed to kovan here:
// https://docs.aave.com/developers/deployed-contracts
const poolAddress = "0x368EedF3f56ad10b9bC57eed4Dac65B26Bb667f6";
const aDaiAddress = "0x310839bE20Fc6a8A89f33A59C7D5fC651365068f";
const daiAddress = "0xDF1742fE5b0bFc12331D8EAec6b478DfDbD31464";

export default async function deploy(arbiter, beneficiary, value) {
  await ethereum.enable();
  const provider = new ethers.providers.Web3Provider(ethereum);
  const network = await provider.getNetwork();

  if(network.chainId === 5) {
    try {
      const signer = provider.getSigner();
      const signerAddress = await signer.getAddress();

      const escrowAddress = ethers.utils.getContractAddress({
          from: signerAddress,
          nonce: (await provider.getTransactionCount(signerAddress)) + 1,
      });

      const dai = new ethers.Contract(daiAddress, IERC20.abi, signer);
      const tx = await dai.approve(escrowAddress, value);
      await tx.wait();

      const factory = new ethers.ContractFactory(Escrow.abi, Escrow.bytecode, signer);
      return factory.deploy(poolAddress, aDaiAddress, daiAddress, arbiter, beneficiary, value);
    }
    catch(ex) {
      alert(ex.message);
    }
  }
  else {
    alert("Invalid network, please choose Kovan!");
  }
}
