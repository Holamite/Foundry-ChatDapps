import {React, useState} from 'react'
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { getProvider } from '../constants/Providers';
import { getContract } from '../constants/contracts';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import Header from './Header';
import {  useNavigate } from "react-router-dom";


const Resigtration = () => {

  const navigate= useNavigate();
    const  {walletProvider} = useWeb3ModalProvider();
    const [files, setFiles] = useState();
    const [ensName, setEnsName] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
    
        if (!files && !ensName) {
          return toast.error("Please select an image or enter an ensName");
        } else {
          formData.append("file", files);
    
          const res = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
              },
              body: formData,
            }
          );
    
          const fileUrl = await res.json();
    
          const readWriteProvider = getProvider(walletProvider);
          const signer = await readWriteProvider.getSigner();
    
          const contract = getContract(signer);
    
          try {
            const tx = await contract.registerNameService(
              ethers.encodeBytes32String(ensName),
              fileUrl.IpfsHash
            );
            const receipt = await tx.wait();
    
            console.log("receipt: ", receipt);
    
            let notification;
    
            if (receipt.status) {
              notification = "Account created successfully";
              navigate("/Message")
            } else {
              return toast.error("Account creation failed");
            }
    
            toast.success(notification);
          } catch (error) {
            console.log(error);
    
            let errorMessage;
    
            if (error.reason === "rejected") {
              errorMessage = "Transaction rejected";
            } else {
              console.log("Error", error);
            }
    
            return toast.error(errorMessage);
          }
        }
    
        setEnsName("");
        setFiles();
      };

  return (
    <>
    <Header/>
    <div className='flex justify-center items-center'>
        <div className='border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-[2rem] w-full max-w-sm bg-white '>
         <input aria-describedby="file_input_help" id="file_input" type="file" onChange={e => setFiles(e.target.files[0])} hidden/>

         <div className='mb-[2rem]'>
         <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 ml-[auto] mr-[auto]">
                {
                    files ?  <img
                    src={URL.createObjectURL(files)}
                    className="w-full h-full object-cover rounded-lg"
                    alt="Selected File"
                  /> : 
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input"><svg className="absolute w-15 h-13 text-gray-400 -left-1 cursor-pointer" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg></label>
                }
                
            </div>
            {files ? "" : <p className='text-center mt-[1rem]'>Upload Image</p>}
         </div>

        <form  onSubmit={handleSubmit}>  
            <div>
                <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">ENS Name</label>
                <input type="text" 
                id="first_name"
                value={ensName}
                onChange={e => setEnsName(e.target.value)} 
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Holamite.eth" required />
            </div>

            
            <button type="submit" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 my-[1rem]  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 w-full" >Register</button>
            
        </form>
    </div>
    </div>
    </>
  )
}

export default Resigtration