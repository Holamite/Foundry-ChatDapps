import { ethers } from "ethers";
import ens from "./abi/ensNameServices.json";
import chat from "./abi/chatsystem.json";

export const getContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_ens_contract_address,
        ens,
        providerOrSigner
    );

    export const chatContract = (providerOrSigner) =>
    new ethers.Contract(
      import.meta.env.VITE_Chats_contract_address,
      chat,
      providerOrSigner
    );