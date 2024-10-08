import React, {useEffect, useState} from 'react';
import styles from "./HotAIComponent.module.css";
import {
	Col, List, Row
} from "antd";
import {useTranslations} from "next-intl";
import {
	PlusOutlined
} from "@ant-design/icons";
import {KolInfo, ticketRecipientAddress} from "@/common";
import BuyKolComponent from "@/components/BuyKol";

interface HotAIPros {
	activeId: string,
	onClose: (token: string)=>void,
	kols: KolInfo[]
}

const KOLListComponent: React.FC<HotAIPros>  = ({activeId, onClose, kols}) => {
	const t = useTranslations('discovery');
	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
	const [showBuyTicket, setShowBuyTicket] = useState<boolean>(false)

	return (
			<div className={styles.hotai_content_mobile}>
				{
					!showBuyTicket ?
						<div style={{overflow: "scroll"}}>
							<h3 style={{textAlign:"center"}}>{t('hot')}</h3>
							<List
								size="large"
								dataSource={kols}
								renderItem={(item, index) => (
									<List.Item
										key={index}
										defaultValue={item.id}
										onClick={(e) => {
											setSelectedIndex(index)
										}}
									>
										<div className={styles.list_item}>
											<h5>{item.name}</h5>
											<h5>粉丝key价格: {Math.pow(item.followers.length+1, 2)*18750} PAB</h5>
											<div><PlusOutlined onClick={()=> setShowBuyTicket(true) }/></div>
										</div>
									</List.Item>
								)}
							/>
						</div>
						:
						<BuyKolComponent recipient={ticketRecipientAddress} id={activeId} room_id={kols[selectedIndex??0].id}  buyWhat={'follow'} onClose={onClose}/>
				}
			</div>
	);
};

export default KOLListComponent;
