import React from 'react'
import VoterStyle from "./VoterCard.module.css";
import Style from "../Card/Card.module.css"
import image from "../../assets"
import Image from 'next/image';



const VoterCard = ({ voterArray }) => {
    return (
        <div className={Style.card}>
            {voterArray.map((el, i) => {
                return (

                    <div key={i + 1} className={Style.card_box}>
                        <div className={Style.image}>
                            <img src={el[2]} alt='Profile Photo' />
                        </div>
                        <div className={Style.card_info}>
                            <h2>{el[1]} #{el[0].toNumber()}</h2>
                            <p>Address : {el[3]}.slice(0,30)</p>
                            <p>Details</p>
                            <p className={VoterStyle.vote_Status}>{el[6] == true ? "You are Already Voted" : "Not Voted"}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default VoterCard
