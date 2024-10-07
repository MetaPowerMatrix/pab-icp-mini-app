import styles from "./SplashScreen.module.css"

const SplashScreen = () => {

	return (
		<div className={styles.modal}>
			<svg width="430" height="930" fill="none" xmlns="http://www.w3.org/2000/svg">
				<rect width="430" height="930" fill="url(#paint0_linear_4050_5085)"/>
				<defs>
					<linearGradient id="paint0_linear_4050_5085" x1="-10.32" y1="32.1379" x2="430.685" y2="909.274"
					                gradientUnits="userSpaceOnUse">
						<stop stopColor="#000000"/>
						<stop offset="0.5" stopColor="#212121"/>
						<stop offset="1" stopColor="#FFFFFF"/>
					</linearGradient>
				</defs>
			</svg>
			<img src={"/images/pab-logo.png"} alt={"logo"} className={styles.logo}/>
		</div>
	)
}
export default SplashScreen
