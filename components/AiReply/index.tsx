import React from 'react';
import {Card, Divider} from "antd";
import Meta from "antd/es/card/Meta";
import {MessageCategory} from "@/common";
import styles from "./AiReplyComponent.module.css";

const CardReply = ({imageUrl, message}:{message: string, imageUrl: string}) => {
	return (
		<>
			<Card bodyStyle={{padding: 5}}  className="card_message"
				style={{width: 240, border: "1px solid #79c5c5", marginLeft: "auto"}}
				cover={<img height={60} alt="example" src={imageUrl}/>}
			>
				<Meta style={{fontSize: 12}} description={message}/>
				<div className={styles.card_message_button_container}>
					<button className={styles.card_message_button}>推荐</button>
					<button className={styles.card_message_button}>购买</button>
				</div>
			</Card>
		</>
	);
}
const HumanQuestion = ({message}: { message: string }) => {
	return (
		<Card bodyStyle={{padding: 5}}  style={{width: 240, border: "1px solid #79c5c5"}}>
			<Meta style={{fontSize: 12}} description={message} />
		</Card>
	);
}


const AiReplyComponent = ({category, imageUrl, message}:{category: MessageCategory, message: string, imageUrl: string}) => {
	return (
		<>
			{
				category === MessageCategory.Card && <CardReply imageUrl={imageUrl} message={message}/>
			}
			{
				category === MessageCategory.Human && <HumanQuestion message={message}/>
			}
		</>
	);
}

export default AiReplyComponent
