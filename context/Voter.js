import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

// INTERNAL IMPORT

import { VotingAddress, VotingAddressABI } from "./constants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
  const votingTitle = "Voting DAPP";
  const router = useRouter();
  const [currentAccount, setCurrentAccount] = useState("");
  const [candidateLength, setCandidateLength] = useState("");
  const pushCandidate = [];
  const candidateIndex = [];
  const [candidateArray, setCandidateArray] = useState(pushCandidate);

  //   -------END OF CANDIDATE DATA
  const [error, setError] = useState("");
  const highestVote = [];

  //    -------VOTER SECTION
  const pushVoter = [];
  const [voterArray, setVoterArray] = useState(pushVoter);
  const [voterLength, setVoterLength] = useState("");
  const [voterAddress, setVoterAddress] = useState([]);

  //   ----------CONNECTING METAMASK

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return setError("Please Insall MetaMask");

    const account = await window.ethereum.request({ method: "eth_accounts" });

    if (account.length) {
      setCurrentAccount(account[0]);
      return true;
    } else {
      setError("Please Install Metamask& Connect,Reload");
      return false;
    }
  };

  //   --------CONNECT WALLET
  const connectWallet = async () => {
    if (!window.ethereum) return setError("Please Insall MetaMask");

    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount[account[0]];
    router.push("/");
  };

  //   ----------UPLOAD TO IPFS VOTER IMAGE

  const uploadToPinata = async (file) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "8e2f3078c48db2832c19",
            pinata_secret_api_key:
              "cf36bcadc8debabbcd3c1789d8718f8138abb37fc27b5ed4b06599e78c71064c",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://harlequin-random-gopher-817.mypinata.cloud/ipfs/${resFile.data.IpfsHash}`;

        return ImgHash;
      } catch (error) {
        alert("unable to upload to Pinata");
      }
    }
  };

  // -----------CREATE VOTER

  const createVoter = async (formInput, fileUrl, router) => {
    try {
      const { name, address, position } = formInput;
      if (!name || !address || !position) {
        return console.log("Input data is missing");
      }

      // CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, position, image: fileUrl });

      try {
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: data,
          headers: {
            pinata_api_key: "8e2f3078c48db2832c19",
            pinata_secret_api_key:
              "cf36bcadc8debabbcd3c1789d8718f8138abb37fc27b5ed4b06599e78c71064c",
            "Content-Type": "application/json",
          },
        });

        const url = `https://harlequin-random-gopher-817.mypinata.cloud/ipfs/${response.data.IpfsHash}`;

        const voter = await contract.voterRight(address, name, fileUrl, url);

        voter.wait();
        router.push("/voterList");
      } catch (error) {
        alert("unable to upload to Pinata data");
      }
    } catch (error) {
      setError("Error in creating voter");
    }
  };

  // -----------CREATE VOTER DATA

  const getAllVoterData = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterListData = await contract.getVoterList();
      setVoterAddress(voterListData);

      voterListData.map(async (el) => {
        const singleVoterData = await contract.getVoterdata(el);
        pushVoter.push(singleVoterData);
      });
      setVoterArray(pushVoter);

      // VOTER LENGTH
      const voterListLength = await contract.getVoterLength();

      setVoterLength(voterListLength.toNumber().toString());
    } catch (error) {
      setError("Something went wrong while fetching data");
    }
  };

  // useEffect(() => {
  //   getAllVoterData();
  // }, []);

  // ------GIVE VOTE

  const giveVote = async (id) => {
    try {
      const voterAddress = id.address;
      const voterId = id.id;
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const voterd = await contract.vote(voterAddress, voterId);
      console.log(voterd);
    } catch (error) {
      setError("Unable to give to vote");
    }
  };

  // --------CANDIDATE SECTION

  const setCandidate = async (candidateForm, fileUrl, router) => {
    try {
      const { name, address, age } = candidateForm;
      if (!name || !address || !age) {
        return console.log("Input data is missing");
      }

      // console.log(address, age, name, fileUrl);

      // CONNECTING SMART CONTRACT
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const data = JSON.stringify({ name, address, image: fileUrl, age });

      try {
        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: data,
          headers: {
            pinata_api_key: "8e2f3078c48db2832c19",
            pinata_secret_api_key:
              "cf36bcadc8debabbcd3c1789d8718f8138abb37fc27b5ed4b06599e78c71064c",
            "Content-Type": "application/json",
          },
        });

        const url = `https://harlequin-random-gopher-817.mypinata.cloud/ipfs/${response.data.IpfsHash}`;

        const candidate = await contract.setCandidate(
          address,
          age,
          name,
          fileUrl,
          url
        );

        candidate.wait();
        router.push("/");
      } catch (error) {
        alert("unable to upload to Pinata data");
      }
    } catch (error) {
      setError("Error in creating voter");
    }
  };

  // -----GET CANDIDATE DATA

  const getNewCandidate = async () => {
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();

      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContract(signer);

      const allCandidates = await contract.getCandidates();
      // console.log(allCandidates);

      allCandidates.map(async (el) => {
        const singleCandidate = await contract.getCandiadteData(el);
        pushCandidate.push(singleCandidate);
        candidateIndex.push(singleCandidate[2].toNumber());
      });
      setCandidateArray(pushCandidate);
      const allCandidatesLength = await contract.getCandidateLength();
      setCandidateLength(allCandidatesLength.toNumber().toString());
    } catch (error) {
      setError("Unable to fetch candidate data");
    }
  };

  return (
    <VotingContext.Provider
      value={{
        votingTitle,
        checkIfWalletIsConnected,
        connectWallet,
        uploadToPinata,
        createVoter,
        getAllVoterData,
        giveVote,
        setCandidate,
        getNewCandidate,
        error,
        voterArray,
        voterLength,
        voterAddress,
        currentAccount,
        candidateArray,
        candidateLength,
        candidateIndex,
      }}
    >
      {children}
    </VotingContext.Provider>
  );
};
