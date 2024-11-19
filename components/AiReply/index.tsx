import React from 'react';
import {Card, Divider} from "antd";
import Meta from "antd/es/card/Meta";
import {MessageCategory} from "@/common";
import styles from "./AiReplyComponent.module.css";
import Link from "next/link";

const CardReply = ({imageUrl, message, link}:{message: string, imageUrl: string, link: string}) => {
	return (
		<>
			<Card bodyStyle={{padding: 5}}  className="card_message"
				style={{width: 280, border: "1px solid #79c5c5", marginLeft: "auto"}}
				cover={<img height={60} alt="example" src={imageUrl}/>}
			>
				<Meta style={{fontSize: 12}} description={message}/>
				<div className={styles.card_message_button_container}>
					<button className={styles.card_message_button}><Link href={link}>{'详情>'}</Link> </button>
				</div>
			</Card>
		</>
	);
}
const HumanQuestion = ({message}: { message: string }) => {
	return (
		<Card bodyStyle={{padding: 5}}  style={{width: 280, border: "1px solid #79c5c5"}}>
			<Meta style={{fontSize: 12}} description={message} />
		</Card>
	);
}
const HumanChat = ({message, reply}:{message: string, reply: ()=>void}) => {
	return (
		<>
			<Card bodyStyle={{padding: 5}}  className="card_message"
			      style={{width: 280, border: "1px solid #79c5c5", marginLeft: "auto"}}
			>
				<Meta style={{fontSize: 12}} description={message}/>
				<div className={styles.card_message_button_container}>
					<button onClick={reply} className={styles.card_message_button}>{'回复>'}</button>
				</div>
			</Card>
		</>
	);
}


const AiReplyComponent = ({category, imageUrl, message, link, reply}
        :{category: MessageCategory, message: string, imageUrl: string, link: string, reply: ()=>void}) => {
	return (
		<>
			{
				category === MessageCategory.Card && <CardReply link={link} imageUrl={imageUrl} message={message}/>
			}
			{
				category === MessageCategory.Human && <HumanQuestion message={message}/>
			}
			{
				category === MessageCategory.Chat && <HumanChat reply={reply} message={message}/>
			}
		</>
	);
}

export default AiReplyComponent
