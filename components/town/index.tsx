import React from "react";
import styles from './TownComponent.module.css'
import KolTownComponent from "@/components/KolTown";
import {q} from "@noble/curves/pasta";

const TownMobile = ({id, name, onShowProgress, ctrlVoiceStart, query}:{id: string,name:string, onShowProgress: (s: boolean)=>void,
	ctrlVoiceStart: (startStop: boolean)=>void, query: string
}) => {
	return (
		<div>
			<div className={styles.town_container}>
				<div className={styles.town_content}>
          <KolTownComponent ctrlVoiceStart={ctrlVoiceStart} query={query} name={name} activeId={id} onShowProgress={onShowProgress}/>
				</div>
			</div>
		</div>
	)
}

export default TownMobile
