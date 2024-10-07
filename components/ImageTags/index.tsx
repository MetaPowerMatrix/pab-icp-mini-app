import React, { useState } from 'react'
import { Tag } from 'antd'

const ImageTagsComponent = ({ tags, height=80 }:{tags: string[], height?: number}) =>{

	return (
		<>
			<div style={{ height: height, overflowX: 'scroll', overflowY: "hidden", whiteSpace: "nowrap" }}>
				{tags.map<React.ReactNode>((tag, index) => (
					<img key={index} style={{display: "inline"}} width={60} height={60} src={"images/lock.png"} alt={'achieve'}/>
				))}
			</div>
		</>
	);
}

export default ImageTagsComponent
