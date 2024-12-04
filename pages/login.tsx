import ModalLogin from "@/components/login";
import { useRouter } from 'next/router';
import {useTranslations} from "next-intl";
import {useEffect} from "react";

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
