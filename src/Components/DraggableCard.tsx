import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { IToDo, toDosState } from "../atoms";
import { MaterialIcon } from "./Board";

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.2rem;
	width: 2rem;
	height: 2rem;
	transition: opacity 0.3s, background-color 0.3s, color 0.3s;
	cursor: pointer;
	color: ${(props) => props.theme.secondaryTextColor};
	background-color: transparent;
	border: none;
	font-size: 1.2rem;

	&:hover,
	&:active,
	&:focus-within {
		background-color: ${(props) => props.theme.hoverButtonOverlayColor};
	}
`;

const Buttons = styled.div`
	display: flex;
	position: absolute;
	top: calc(50% - 1rem);
	right: 0.375rem;
	justify-content: space-between;
	gap: 0.125rem;
`;

const Card = styled.li`
	background-color: ${(props) => props.theme.cardColor};
	padding: 0.8rem;
	border-radius: 0.4rem;
	box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.15);
	margin-bottom: 0.6rem;
	height: 2.75rem;
	display: block;
	/* align-items: center;
	justify-content: space-between; */
	transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, opacity 0.3s;
	user-select: none;
	position: relative;
	font-size: 1rem;

	&.dragging {
		box-shadow: 0 0.4rem 0.8rem rgba(0, 0, 0, 0.25);
	}

	&.dragging-over-trash {
		background-color: tomato !important;
		color: white;
	}

	&:focus-within {
		background-color: ${(props) => props.theme.accentColor};
		outline: 0.15rem solid ${(props) => props.theme.textColor};
		color: white;
	}

	& > :first-child {
		width: 100%;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
		transition: width 0.3s;
		margin-top: 0.1rem;
	}

	&:not(:hover):not(:focus-within) ${Button} {
		opacity: 0;
	}

	&:hover > :first-child,
	&:focus-within > :first-child {
		width: 8.75rem;
	}

	&:focus-within ${Button} {
		color: white;
	}

	&:focus-within ${Button}:focus {
		outline: 0.15rem solid white;
	}
`;

interface IDraggableCardProps {
	toDo: IToDo;
	index: number;
	boardId: number;
}

function DraggableCard({ toDo, index, boardId }: IDraggableCardProps) {
	const setToDos = useSetRecoilState(toDosState);

	const onEdit = () => {
		const newToDoText = window
			.prompt(`${toDo.text} 할 일의 새 이름을 입력해주세요.`, toDo.text)
			?.trim();

		if (newToDoText !== null && newToDoText !== undefined) {
			if (newToDoText === "") {
				alert("이름을 입력해주세요.");
				return;
			}

			setToDos((prev) => {
				const toDosCopy = [...prev];
				const boardIndex = toDosCopy.findIndex((board) => board.id === boardId);
				const boardCopy = { ...toDosCopy[boardIndex] };
				const listCopy = [...boardCopy.toDos];
				const toDoIndex = boardCopy.toDos.findIndex((td) => td.id === toDo.id);

				listCopy.splice(toDoIndex, 1, {
					text: newToDoText,
					id: toDo.id,
				});

				boardCopy.toDos = listCopy;
				toDosCopy.splice(boardIndex, 1, boardCopy);

				return toDosCopy;
			});
		}
	};

	const onDelete = () => {
		if (window.confirm(`${toDo.text} 할 일을 삭제하시겠습니까?`)) {
			setToDos((prev) => {
				const toDosCopy = [...prev];
				const boardIndex = toDosCopy.findIndex((board) => board.id === boardId);
				const boardCopy = { ...toDosCopy[boardIndex] };
				const listCopy = [...boardCopy.toDos];
				const toDoIndex = boardCopy.toDos.findIndex((td) => td.id === toDo.id);

				listCopy.splice(toDoIndex, 1);
				boardCopy.toDos = listCopy;
				toDosCopy.splice(boardIndex, 1, boardCopy);

				return toDosCopy;
			});
		}
	};

	return (
		<Draggable draggableId={"todo-" + toDo.id} index={index}>
			{(provided, snapshot) => (
				<Card
					className={`${snapshot.isDragging ? "dragging" : ""} ${
						snapshot.draggingOver === "trash" ? "dragging-over-trash" : ""
					}`}
					ref={provided.innerRef}
					{...provided.draggableProps}
					{...provided.dragHandleProps}
				>
					<div>{toDo.text}</div>
					<Buttons>
						<Button onClick={onEdit}>
							<MaterialIcon name="edit" />
						</Button>
						<Button onClick={onDelete}>
							<MaterialIcon name="delete" />
						</Button>
					</Buttons>
				</Card>
			)}
		</Draggable>
	);
}

// prevents re-rendering of the component
export default React.memo(DraggableCard);
