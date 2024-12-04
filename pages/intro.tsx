import {useTranslations} from "next-intl";
import {useEffect} from "react";
import PitchPage from "@/components/Pitch";

export default function AppInfo() {
	const t = useTranslations('Login');

	useEffect(() => {
		return () => {
			console.log("Cleaning up or unmounting app intro page...");
		};
	}, []);

	return(
		<>
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
