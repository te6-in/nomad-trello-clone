import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.li`
	background-color: ${(props) => props.theme.cardColor};
	padding: 0.8rem;
	border-radius: 0.4rem;
	box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
	margin-bottom: 0.6rem;
	min-height: 2.75rem;
	display: flex;
	align-items: center;
	overflow: hidden;
	transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, opacity 0.3s;
	user-select: none;

	&.dragging {
		box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.25);
	}

	&:focus {
		background-color: ${(props) => props.theme.accentColor};
		outline: 0.2rem solid ${(props) => props.theme.textColor};
		color: white;
	}
`;

interface IDraggableCardProps {
	toDoId: number;
	toDoText: string;
	index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
	return (
		<Draggable draggableId={toDoId + ""} index={index}>
			{(provided, snapshot) => (
				<Card
					className={snapshot.isDragging ? "dragging" : ""}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					{toDoText}
				</Card>
			)}
		</Draggable>
	);
}

// prevents re-rendering of the component
export default React.memo(DraggableCard);
