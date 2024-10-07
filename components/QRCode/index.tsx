import React, {useEffect, useState} from 'react';
import {useTranslations} from "next-intl";
import styles from "./QRCodeComponent.module.css"
import QRCode from 'qrcode.react';
import {Button, Col, Form, Modal, Row} from "antd";
import commandDataContainer from "@/container/command";
import BuyKolComponent from "@/components/BuyKol";

interface QRCodeProps {
	id: string,
}

const QRCodeComponent: React.FC<QRCodeProps> = ({id}) => {
	const t = useTranslations('others');
	const [token, setToken] = React.useState<string>('');
	const [reload, setReload] = useState<number>(0)
	const [isKol, setIsKol] = useState<boolean>(false)
	const command = commandDataContainer.useContainer()

	useEffect(() => {
		command.query_kol_rooms().then((res) => {
			let testKol = false
			res.forEach((info) => {
				console.log(info)
				if (info.id === id) {
					setIsKol(true)
					testKol = true
				}
			})
			setIsKol(testKol)
		})
	},[id, reload])

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text);
			console.log('Text copied to clipboard');
		} catch (err) {
			console.error('Failed to copy text to clipboard: ', err);
		}
	};

	return (
			<div className={ styles.qrcode_content_mobile }>
				{
					isKol ?
						<>
							<Row>
								<Col span={24} style={{textAlign: "center"}}>
									<div><h5>{t("tipsQRCode")}</h5></div>
									<QRCode value={"https://social.metapowermatrix.ai/authorize?owner=" + token}/>
									<div><a>
										<span onClick={() => {
											copyToClipboard("https://social.metapowermatrix.ai/authorize?owner=" + token)
											Modal.success({
												content: (t('copied'))
											})
										}}>{t('copy')}
										</span>
									</a>
									</div>
								</Col>
							</Row>
						</>
						:
						<BuyKolComponent id={id} room_id={''}  buyWhat={'kol'}
	             onClose={(token: string) => { setReload(reload + 1); setToken(token)}}
						/>
				}
		</div>
	);
}

export default QRCodeComponent;
