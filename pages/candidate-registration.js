import React, { useState, useEffect, useCallback, useContext } from "react";
import Router, { useRouter } from "next/router";
import { useDropzone } from "react-dropzone";
import Image from "next/image";

// INTERNAL import

import { VotingContext } from "../context/Voter";
import Style from "../styles/allowedVoters.module.css";
import images from "../assets";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";

function CandidateRegistration() {
  const [fileUrl, setFileUrl] = useState(null);
  const [candidateForm, setCandidateForm] = useState({
    name: "",
    address: "",
    age: "",
  });

  const router = useRouter();
  const { uploadToPinata, setCandidate, candidateArray, getNewCandidate } =
    useContext(VotingContext);

  // -------VOTER IMAGE DROP
  const onDrop = useCallback(async (acceptedFile) => {
    const url = await uploadToPinata(acceptedFile[0]);
    setFileUrl(url);
  });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 5000000,
  });
  const func = () => {
    candidateArray.map((el, i) => {
      console.log(el);
    });
  };
  func();
  useEffect(() => {
    getNewCandidate();
    console.log(candidateArray);
  }, []);
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp; {candidateForm.name}</span>
              </p>
              <p>
                Address:{" "}
                <span>&nbsp; {candidateForm.address.slice(0, 20)}</span>
              </p>
              <p>
                Age: <span>&nbsp; {candidateForm.age}</span>
              </p>
            </div>
          </div>
        )}

        {!fileUrl && (
          <div className={Style.sideInfo}>
            <div className={Style.sideInfo_box}>
              <h4>Create Candidate For Voting</h4>
              <p>
                Blockchain voting organization, provide ethereum block system
              </p>
              <p className={Style.sideInfo_para}>Contract Candidate List</p>
            </div>

            <div className={Style.card}>
              {candidateArray.map((el, i) => {
                return (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[3]} alt="Profile Photo " />
                    </div>
                    <div className={Style.card_info}>
                      <p>
                        {el[1]} #{el[2].toNumber()}
                      </p>
                      <p>Age: {el[0]}</p>
                      <p>Address: {el[6].slice(0, 10)}...</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className={Style.voter}>
        <div className={Style.voter_container}>
          <h1>Create New Candidate</h1>
          <div className={Style.voter_container_box}>
            <div className={Style.voter_container_box_div}>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={Style.voter_container_box_div_info}>
                  <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>

                  <div className={Style.voter_container_box_div_image}>
                    <Image
                      src={images.upload}
                      width={150}
                      height={150}
                      alt="File upload"
                      priority
                    />
                  </div>
                  <p>Drag & Drop File</p>
                  <p>or Browse Media on your device</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={Style.input_container}>
          <Input
            inputType="text"
            title="Name"
            placeholder="Candidate Name"
            handleClick={(e) => {
              setCandidateForm({ ...candidateForm, name: e.target.value });
            }}
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Candidate Address"
            handleClick={(e) => {
              setCandidateForm({ ...candidateForm, address: e.target.value });
            }}
          />
          <Input
            inputType="text"
            title="Age"
            placeholder="Candidate Age"
            handleClick={(e) => {
              setCandidateForm({ ...candidateForm, age: e.target.value });
            }}
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorized Candidate"
              handleClick={() => {
                setCandidate(candidateForm, fileUrl, router);
              }}
            />
          </div>
        </div>
      </div>

      {/* ///////////////// */}

      <div className={Style.createdVoter}>
        <div className={Style.createdVoter_info}>
          <Image
            src={images.voter}
            priority
            width={150}
            height={150}
            alt="user Profile"
          />
          <p>Notice For User</p>
          <p>
            Organizer <span>0x92939495794028..</span>
          </p>
          <p>
            Only Organizer of the voting contract can create voter for voting
            election
          </p>
        </div>
      </div>
    </div>
  );
}

export default CandidateRegistration;
