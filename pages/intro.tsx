import {useTranslations} from "next-intl";
import React, {useEffect} from "react";
import PitchPage from "@/components/Pitch";
import Head from "next/head";

export default function AppInfo() {
	const t = useTranslations('Login');

	useEffect(() => {
		return () => {
			console.log("Cleaning up or unmounting app intro page...");
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
			<PitchPage tips={t}/>
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
