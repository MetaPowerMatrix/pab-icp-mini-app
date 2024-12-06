import ModalLogin from "@/components/login";
import { useRouter } from 'next/router';
import {useTranslations} from "next-intl";
import React, {useEffect} from "react";
import Head from "next/head";

export default function LoginPage() {
	const router = useRouter();
	const t = useTranslations('Login');

	const toHome = () => {
		router.push('/home');
	};

	useEffect(() => {
		return () => {
			console.log("Cleaning up or unmounting app login page...");
		};
	}, []);

	return(
		<>
			<Head>
				<link rel="icon" href="/favicon.ico"/>
				<meta name="description" content={t('description')}/>
				<meta name="og:title" content={t('title')}/>
				<meta name="viewport" content="width=device-width, user-scalable=0, interactive-widget=overlays-content, initial-scale=1"/>
			</Head>
			<ModalLogin onClose={()=> toHome()} tips={t}/>
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
