import React from 'react';
import styled from 'styled-components';

export interface IDividerProps {
	width?: string;
	height?: string;
	bg?: string;
}

const DividerComponent = styled.span<{ $width?: string; $height?: string; $bg?: string }>`
	display: flex;
	width: ${({ $width }) =>
		$width ? ($width.includes('%') || $width.includes('px') ? $width : `${$width}px`) : 'auto'};
	height: ${({ $height }) =>
		$height ? ($height.includes('%') || $height.includes('px') ? $height : `${$height}px`) : 'auto'};
	background: ${({ $bg }) => ($bg ? `${$bg}` : 'transparent')};
`;

function Divider(props: IDividerProps) {
	return <DividerComponent $width={props.width} $height={props.height} $bg={props.bg} />;
}

export default Divider;
