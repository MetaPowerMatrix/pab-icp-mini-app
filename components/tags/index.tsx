import React, {useEffect, useState} from 'react'
import { Tag } from 'antd'
import commandDataContainer from '@/container/command'

const TagsComponent = ({ tags, presetTags, myTags, height=80 }:{tags: string[], presetTags: string[], myTags: (tags: string[])=>void, height?: number}) =>{
	const [selectedTags, setSelectedTags] = useState<string[]>(presetTags);

	const handleTagChange = (tag: string, checked: boolean) => {
		const nextSelectedTags = checked
			? [...selectedTags, tag]
			: selectedTags.filter((t) => t !== tag);
		console.log('You are interested in: ', nextSelectedTags);
		setSelectedTags(nextSelectedTags);
		myTags(nextSelectedTags);
	};

	return (
		<>
			<div style={{ height: height, overflow: 'scroll', width: '100%' }}>
				{tags.map<React.ReactNode>((tag) => (
					<Tag.CheckableTag
						key={tag}
						checked={selectedTags.includes(tag)}
						onChange={(checked) => handleTagChange(tag, checked)}
					>
						<h3 style={{ fontSize: 12, color: "#eeb075" }}>{tag}</h3>
					</Tag.CheckableTag>
				))}
			</div>
		</>
	);
}

export default TagsComponent
