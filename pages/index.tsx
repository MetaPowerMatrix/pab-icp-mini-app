import React from 'react';
import MobileHome from "@/channel/mobile";
import Head from "next/head";

export default function Home() {
	return (
			<MobileHome/>
	);
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
