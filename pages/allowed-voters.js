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

function allowedVoters() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, setformInput] = useState({
    name: "",
    address: "",
    position: "",
  });

  const router = useRouter();
  const { uploadToPinata, createVoter, getAllVoterData, voterArray } =
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
  useEffect(() => {
    getAllVoterData();
    console.log(voterArray);
  }, []);
  return (
    <div className={Style.createVoter}>
      <div>
        {fileUrl && (
          <div className={Style.voterInfo}>
            <img src={fileUrl} alt="Voter Image" />
            <div className={Style.voterInfo_paragraph}>
              <p>
                Name: <span>&nbsp; {formInput.name}</span>
              </p>
              <p>
                Address: <span>&nbsp; {formInput.address.slice(0, 20)}</span>
              </p>
              <p>
                Postion: <span>&nbsp; {formInput.position}</span>
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
              {voterArray.map((el, i) => {
                const voted = el[6] == true ? "Voted" : "Not Voted";
                return (
                  <div key={i + 1} className={Style.card_box}>
                    <div className={Style.image}>
                      <img src={el[2]} alt="Profile Photo " />
                    </div>
                    <div className={Style.card_info}>
                      <p>
                        {el[1]} #{el[0].toNumber()}
                      </p>
                      <p>Vote: {voted}</p>
                      <p>Address: {el[3].slice(0, 10)}...</p>
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
          <h1>Create New Voter</h1>
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
                      priority
                      alt="File upload"
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
            placeholder="Voter Name"
            handleClick={(e) => {
              setformInput({ ...formInput, name: e.target.value });
            }}
          />
          <Input
            inputType="text"
            title="Address"
            placeholder="Voter Address"
            handleClick={(e) => {
              setformInput({ ...formInput, address: e.target.value });
            }}
          />
          <Input
            inputType="text"
            title="Position"
            placeholder="Voter Position"
            handleClick={(e) => {
              setformInput({ ...formInput, position: e.target.value });
            }}
          />

          <div className={Style.Button}>
            <Button
              btnName="Authorized Voter"
              handleClick={() => {
                createVoter(formInput, fileUrl, router);
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
            width={150}
            height={150}
            priority
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

export default allowedVoters;
