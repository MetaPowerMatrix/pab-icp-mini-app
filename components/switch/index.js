import React, { useState } from 'react';
import styles from './ModalSwitch.module.css';
import {Divider} from "antd";
import { useRouter } from 'next/router';

function ModalSwitch({onClose, tips, options}) {
	const [userid, setUserid] = useState('');
	const router = useRouter();

	const toLogin = () => {
		router.push('/login');
	};

	const handleLogin = (event) => {
		event.preventDefault();
		// alert(userid)
		onClose(userid)
	};

	const userIdChange = (event) => {
		event.preventDefault();
		setUserid(event.target.value)
	}

	return (
		<>
			<div className={styles.modal}>
				<div className={styles.modal_content_mobile}>
					<div className={styles.form_group}>
						<select style={{padding: 10, width: "100%"}} id="userid" name="userid" onChange={userIdChange}>
							{options.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
					<button className={styles.button} onClick={handleLogin}>{tips('buttonLogin')}</button>
					<Divider/>
					<button className={styles.create_button} onClick={toLogin}>{tips('buttonRegister')}</button>
				</div>
			</div>
		</>
	);
}

export default ModalSwitch;
