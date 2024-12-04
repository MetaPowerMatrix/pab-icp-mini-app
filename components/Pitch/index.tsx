import styles from "./Pitch.module.css"
import React from "react";
import { useRouter } from 'next/router';
import {Button} from "antd";

const PitchPage = ({tips}: {tips: any}) => {
	const router = useRouter();

	const toLogin = () => {
		router.push('/login');
	};

	return (
		<div className={styles.modal}>
			<Button className={styles.button} onClick={toLogin}>{tips('join')}</Button>
		</div>
	)
}
export default PitchPage
