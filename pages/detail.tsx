import React, {useState} from 'react';
import {useTranslations} from 'next-intl';
import LayoutMobile from "@/components/layout_mobile";

export default function MobileHome() {
	const [activeId, setActiveId] = useState("");
	const [activeName, setActiveName] = useState<string>("")
	const t = useTranslations('Index');

	return (
		<LayoutMobile showTabs={false} onRefresh={(name: string) => setActiveName(name)} onChangeId={(newId: string) => setActiveId(newId)}
		              title={t('title')}
		              description={t('description')}>
			<></>
		</LayoutMobile>
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
