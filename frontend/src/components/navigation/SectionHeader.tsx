interface SectionHeaderProps {
	title: string;
}

const SectionHeader = (props: SectionHeaderProps) => {
	return <div className="leading-6 font-semibold text-xs">{props.title}</div>;
};

export default SectionHeader;
