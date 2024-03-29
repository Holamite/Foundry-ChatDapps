import { ethers } from "ethers";
import ens from "./abi/ensNameServices.json";

export const getContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_ens_contract_address,
        ens,
        providerOrSigner
    );