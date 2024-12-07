import type { AppProps } from "next/app";
import CommandDataContainer from "@/container/command";
import {NextIntlClientProvider} from 'next-intl';
import "antd/lib/tabs/style/index";
import "@/styles/global.css";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <NextIntlClientProvider
      locale={"zh-CN"}
      timeZone="Asia/Hong_Kong"
      messages={pageProps.messages}
    >
      <CommandDataContainer.Provider>
        <Component {...pageProps} />
      </CommandDataContainer.Provider>
    </NextIntlClientProvider>
  );
}
