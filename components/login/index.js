import React, { useState } from 'react';
import styles from './ModalLogin.module.css';
import {Modal} from "antd";
import commandDataContainer from "../../container/command";
import {useTranslations} from "next-intl";
import {ExclamationCircleFilled} from "@ant-design/icons";
import ProgressBarComponent from "../ProgressBar";

function ModalLogin({onClose, tips}) {
	const [username, setUsername] = useState('');
	const command = commandDataContainer.useContainer()
	const [loading, setLoading] = useState(false);
	const t = useTranslations('Login');
	const {confirm} = Modal;

	const handleRegister = async (event) => {
		event.preventDefault();
		if (username === "") {
			alert(t("name_tips"))
			return
		}
		setLoading(true)
		let userid = await command.create_pato(username)
		if (userid !== "" || userid !== null) {
			// alert("创建成功")
			let localInfoStr = localStorage.getItem("local_patos")
			if (localInfoStr === null){
				const localInfo ={ids: [`${userid}:${username}`], active_id: `${userid}`}
				localStorage.setItem("local_patos", JSON.stringify(localInfo))
			}else{
				const localInfo = JSON.parse(localInfoStr)
				localInfo.ids.push(`${userid}:${username}`)
				const newlocalInfo = {ids: localInfo.ids, active_id: `${userid}`}
				localStorage.setItem("local_patos", JSON.stringify(newlocalInfo))
			}
			setLoading(false)
			confirm({
				icon: <ExclamationCircleFilled />,
				content: t('login_tips'),
				okText: t('confirm'),
				cancelText: t('cancel'),
				onOk() {
					onClose(userid)
				}
			})
		}
	};
	const usernameInput = (event) => {
		event.preventDefault();
		setUsername(event.target.value)
	}

	return (
		<>
			<div className={styles.modal}>
				<div className={styles.modal_content_mobile}>
					<input placeholder={tips('loginCreate')} style={{padding: 10, width: "100%"}} id="username"
						   name="username" onChange={usernameInput}/>
					<button className={styles.button} onClick={handleRegister}>{tips('buttonRegister')}</button>
				</div>
			</div>
			<ProgressBarComponent visible={loading} steps={15}/>
		</>
	);
}

export default ModalLogin;
