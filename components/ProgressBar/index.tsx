// ProgressBarComponent.tsx
import React, {useEffect} from 'react';
import { gsap } from 'gsap';
import styles from './ProgressBarComponent.module.css';
import {useGSAP} from "@gsap/react"; // Assuming CSS is defined here

interface ProgressBarComponentProps {
	visible: boolean;
	steps: number;
}

const Indicator = () => {
	useGSAP(() => {
		gsap.to("#indicator_path", {
			duration: 2,
			stroke: "#FF0000",  // Change the stroke color to red
			repeat: -1,         // Repeat infinitely
			yoyo: true          // Reverse animation on each repeat
		});

		// Self-rotation animation
		gsap.to("#indicator", {
			duration: 15,
			rotate: 360,  // Rotate 360 degrees
			repeat: -1,   // Repeat infinitely
			ease: "linear" // Keep rotation smooth
		});
	},[])

	return (
		<svg id="indicator" width="276" height="100" viewBox="0 0 276 100" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path id="indicator_path"
				d="M106.75 91.6668V70.8335M106.75 29.1668V8.3335M96.3333 18.7502H117.167M96.3333 81.2502H117.167M142.167 12.5002L134.941 31.2871C133.766 34.3422 133.178 35.8698 132.265 37.1547C131.455 38.2935 130.46 39.2885 129.321 40.0982C128.036 41.0118 126.509 41.5994 123.454 42.7744L104.667 50.0002L123.454 57.2259C126.509 58.4009 128.036 58.9885 129.321 59.9021C130.46 60.7119 131.455 61.7068 132.265 62.8456C133.178 64.1305 133.766 65.6581 134.941 68.7132L142.167 87.5002L149.392 68.7132C150.567 65.6581 151.155 64.1305 152.069 62.8456C152.878 61.7068 153.873 60.7119 155.012 59.9021C156.297 58.9885 157.825 58.4009 160.88 57.2259L179.667 50.0002L160.88 42.7744C157.825 41.5994 156.297 41.0118 155.012 40.0982C153.873 39.2885 152.878 38.2935 152.069 37.1547C151.155 35.8698 150.567 34.3422 149.392 31.2871L142.167 12.5002Z"
				stroke="#3D9CFB" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
		</svg>
	)
}

const ProgressBarComponent: React.FC<ProgressBarComponentProps> = ({visible, steps}) => {
	const [percent, setPercent] = React.useState(5);

	useEffect(() => {
		if (!visible) {
			// Set up the interval
			const intervalId = setInterval(() => {
				setPercent((prevPercent) => {
					if (prevPercent >= 100) {
						prevPercent = 2
						return prevPercent
						// clearInterval(intervalId); // Clear interval when progress reaches 100%
						// return 100;
					}
					return prevPercent + 2; // Increment progress
				});
			}, 1000); // Update progress every 1000 milliseconds (1 second)

			// Clean up interval on component unmount
			return () => clearInterval(intervalId);
		}
	}, [])

	if (!visible) return null;

	return (
		<div className={styles.progress_bar_container}>
			<div className={styles.progress_bar_content}>
				<Indicator/>
				<h5>{percent}</h5>
				{/*<Progress strokeColor={"yellow"} trailColor={"white"} steps={steps} percent={percent} size={[20, 30]}*/}
				{/*          status="active" showInfo={false}/>*/}
			</div>
		</div>
	);
};

export default ProgressBarComponent;
