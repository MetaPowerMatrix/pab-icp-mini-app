import React, {useState} from 'react';
import {
	notification,
} from "antd";
import {useTranslations} from 'next-intl';
import LayoutMobile from "@/components/layout_mobile";

export default function MobileHome() {
	const [activeName, setActiveName] = useState<string>("")
	const [api, contextHolder] = notification.useNotification();
	const t = useTranslations('Index');

	return (
		<LayoutMobile showTabs={true} onRefresh={(name: string) => setActiveName(name)}
		              title={t('title')}
		              description={t('description')}>
			{contextHolder}
		</LayoutMobile>
	)
}

export async function getStaticProps({locale}: {
	locale: string
}) {
	return {
		props: {
			messages: {
				...require(`../messages/${locale}.json`),
			}
		},
	};
}
