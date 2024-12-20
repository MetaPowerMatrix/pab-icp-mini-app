import { useRouter } from 'next/router';
import {useTranslations} from "next-intl";
import React, {useEffect, useState} from "react";
import ModalSwitch from "@/components/switch";
import Head from "next/head";

export default function LoginPage() {
	const router = useRouter();
	const t = useTranslations('Login');
	const [availableIds, setAvailableIds] = useState([]);

	const toHome = () => {
		router.push('/home');
	};

	useEffect(() => {
		return () => {
			console.log("Cleaning up or unmounting app login page...");
		};
	}, []);

	useEffect(() => {
		const localInfoStr = localStorage.getItem("local_patos")
		if (localInfoStr !== null) {
			const localInfo = JSON.parse(localInfoStr)
			const ids = localInfo.ids;
			const idsMap = ids.map((id: any) => {
				const id_name = id.split(":")
				if (id_name.length > 1){
					return {label: id.split(":")[1], value: id.split(":")[0]};
				}
			});
			idsMap.unshift({label:'请选择',value:'tips'})
			setAvailableIds(idsMap);
		}
	},[]);

	return(
		<>
			<Head>
				<link rel="icon" href="/favicon.ico"/>
				<meta name="description" content={t('description')}/>
				<meta name="og:title" content={t('title')}/>
				<meta name="viewport" content="width=device-width, user-scalable=0, interactive-widget=overlays-content, initial-scale=1"/>
			</Head>
			<ModalSwitch tips={t} options={availableIds}
        onClose={(id: any) => {
          if (id !== '') {
            const localInfoStr = localStorage.getItem("local_patos")
            if (localInfoStr !== null) {
	            let localInfo = JSON.parse(localInfoStr)
	            localInfo.active_id = id
	            localStorage.setItem("local_patos", JSON.stringify(localInfo))
	            toHome()
            }
          }
        }}
			/>
		</>
	)
}

export async function getStaticProps({locale}: {
	locale: string
}) {
	return {
		props: {
			messages: {
				...require(`../messages/zh-CN.json`),
			}
		},
	};
}
