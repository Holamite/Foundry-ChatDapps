import {useState, useEffect} from 'react';
import { ethers } from "ethers";
import { chatContract, getContract } from "../constants/contracts";
import { toast } from "react-toastify";
import { readOnlyProvider, getProvider } from "../constants/Providers";
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
  


const Message = () => {
    const [senderEnsName, setSenderEnsName] = useState("");
    const [receiverEnsName, setReceiverEnsName] = useState("");
    const [messageContent, setMessageContent] = useState("");
    const [{ data: messages }, setMessages] = useState({ data: [] });
    const [{ data: registeredUsers }, setRegisteredUsers] = useState({
      data: [],
    });
    const [selectedUser, setSelectorUser] = useState();
    const { walletProvider } = useWeb3ModalProvider();
    const { address } = useWeb3ModalAccount();

    useEffect(() => {
        const contract = chatContract(readOnlyProvider);
    
        contract
          .getRegisteredUsers()
          .then((res) => {
            const converted = res.map((item) => ({
              ensName: ethers.decodeBytes32String(item.ensName),
              DisplayPictureURI: item.DisplayPictureURI,
            }));
    
            setRegisteredUsers({
              data: converted,
            });
          })
          .catch((err) => {
            console.error("error fetching proposals: ", err);
          });
      }, []);
    
      const selectReceiver = (selectedUser) => {
        setReceiverEnsName(selectedUser);
        setSelectorUser(selectedUser);
      };
    
      const sendMessage = async () => {
        const readWriteProvider = getProvider(walletProvider);
        const signer = await readWriteProvider.getSigner();
    
        const contract = chatContract(signer);
        try {
          const tx = await contract.sendMessage(receiverEnsName, messageContent);
          const txReceipt = await tx.wait();
          console.log("Receipt: ", txReceipt);
          setMessageContent("");
        } catch (error) {
          console.error("Error sending message:", error);
        }
      };
    
      useEffect(() => {
        const chat = chatContract(readOnlyProvider);
        const nameService = getContract(readOnlyProvider);
    
        async () => {
          const senderName = await nameService.domains(address);
          setSenderEnsName(senderName[0]);
    
          const history = await chat
            .getMessages(senderEnsName, receiverEnsName)
            .then((res) => {
              const response = res.map((item) => ({
                sender: item.sender,
                receiver: item.receiver,
                content: item.content,
              }));
    
              setRegisteredUsers({
                data: response,
              });
            })
            .catch((err) => {
              console.error("error fetching proposals: ", err);
            });
    
          setMessages(history);
        };
      }, []);

  return (
    <>   
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
                
                <a href='./' className="text-2xl text-[#888] lg:text-[4rem] font-bold md:text-[3rem] text-[1.5rem]">
                    Chat Messager       
                </a>
                <w3m-button />
            </div>
        </div>
        </nav>

        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 " aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">

        <h2 className="text-xl font-semibold mb-4 text-black">Chats</h2>
        <ul className="pace-y-2 font-medium">
          {registeredUsers.map((user, index) => (
            <li
              key={index}
              onClick={() => selectReceiver(user.ensName)}
              className={`text-black flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-gray-200 ${
                selectedUser === user.ensName ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={`${import.meta.env.VITE_PINATA_GATEWAY}${
                  user.DisplayPictureURI
                }`}
                alt=""
                className="w-10 h-10 rounded-md"
              />
              <p>{user.ensName}</p>
            </li>
          ))}
        </ul>
        </div>
        </aside>  

        <div className=" sm:ml-64">
            <div className="border-gray-200 rounded-lg dark:border-gray-700 mt-14">
                    
                    {/* Body */}
                <div className="flex-1 flex flex-col justify-between">

                            {/* Name Header */}
                    <div className="bg-gray-400 text-[black] py-3 px-4 flex items-center justify-between">
                    <span className="text-lg font-semibold">
                        {selectedUser ? selectedUser : "Select a contact"}
                    </span>
                    
                    </div>
                            {/* Messages section */}
                    <div className="flex-1 bg-[white] px-4 py-2 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div
                        key={index}
                        className={`mb-4 ${
                            msg.sender === senderEnsName ? "self-end" : "self-start"
                        }`}
                        >
                        <div
                            className={`rounded-lg p-2 max-w-md ${
                            msg.sender === senderEnsName
                                ? "bg-whatsapp-green text-white"
                                : "bg-whatsapp-light"
                            }`}
                        >
                            {msg.content}
                        </div>
                        <div
                            className={`text-xs ${
                            msg.sender === senderEnsName ? "text-right" : ""
                            }`}
                        >
                            {msg.sender}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                    {/* Input field && button */}
                <div className='fixed bottom-0 left-0 w-full bg-gray-200 p-4'>
                <label htmlFor="search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Type a message...</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"/>
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"/>
            </svg>
                </div>
                <input 
                id="search" 
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-black-500 dark:focus:border-black-500"
                type="text"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type a message..." required />

                <button 
                type="submit"
                onClick={sendMessage} 
                className="text-white absolute end-2.5 bottom-2.5 bg-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Send</button>
            </div>
                </div>

            </div>
        </div>
    </>
  )
}

export default Message


{/* <div className="flex-1 flex flex-col justify-between"> */}
        {/* Chat Header */}
        {/* <div className="bg-whatsapp-light text-[white] py-3 px-4 flex items-center justify-between">
          <span className="text-lg font-semibold">
            {selectedUser ? selectedUser : "Select a contact"}
          </span>
        //   <span>{senderEnsName}</span>
        </div> */}

        {/* Messages */}
        {/* <div className="flex-1 bg-[#17141f] px-4 py-2 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 ${
                msg.sender === senderEnsName ? "self-end" : "self-start"
              }`}
            >
              <div
                className={`rounded-lg p-2 max-w-md ${
                  msg.sender === senderEnsName
                    ? "bg-whatsapp-green text-white"
                    : "bg-whatsapp-light"
                }`}
              >
                {msg.content}
              </div>
              <div
                className={`text-xs ${
                  msg.sender === senderEnsName ? "text-right" : ""
                }`}
              >
                {msg.sender}
              </div>
            </div>
          ))}
        </div> */}