import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./theme";
import {
	DragDropContext,
	Draggable,
	DraggingStyle,
	DragStart,
	Droppable,
	DropResult,
	NotDraggingStyle,
} from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import {
	categoriesState,
	isDraggingTaskState,
	isLightState,
	toDosState,
} from "./atoms";
import Board, { MaterialIcon } from "./Components/Board";
import { useEffect, useState } from "react";

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	line-height: 1;
	font-family: "Pretendard", sans-serif;
	background-color: ${(props) => props.theme.bgColor};
	color: ${(props) => props.theme.textColor};
	transition: background-color 0.3s, color 0.3s;
	overflow-y: hidden;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
a {
	text-decoration: none;
	color: inherit;
}
* {
	box-sizing: border-box;
}
input, button {
	font-family: "Pretendard", sans-serif;
	color: inherit;
}
`;

const Navigation = styled.nav`
	display: flex;
	position: fixed;
	padding: 2.5rem 3rem;
	align-items: center;
	justify-content: space-between;
	width: 100vw;
	color: ${(props) => props.theme.textColor};
`;

const Title = styled.h1`
	font-size: 2rem;
	font-weight: 600;
	transition: color 0.3s;
`;

const Buttons = styled.div`
	display: flex;
	align-items: center;
	gap: 2rem;
	transition: color 0.3s;
	color: ${(props) => props.theme.secondaryTextColor};
`;

const Button = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.8rem;
	width: 2rem;
	height: 2rem;
	background: none;
	border: none;
	transition: color 0.3s;
	padding: 0;
	border-radius: 0.2rem;

	&:hover,
	&:focus {
		cursor: pointer;
		color: ${(props) => props.theme.accentColor};
	}

	&:focus {
		outline: 0.15rem solid ${(props) => props.theme.accentColor};
	}
`;

const Boards = styled.div`
	display: flex;
	align-items: flex-start;
	justify-content: flex-start;
	min-width: calc(100vw - 4rem);
	margin-right: 2rem;
	height: calc(100vh - 10rem);
	margin-top: 7rem;
	margin-left: 2rem;
`;

const Trash = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	top: 7.5rem;
	right: -4rem;
	width: 8rem;
	height: 8rem;
	border-radius: 33%;
	background-color: tomato;
	box-shadow: -0.1rem 0 0.4rem rgb(210 77 77 / 15%);
	font-size: 2.25rem;
	z-index: 5;

	& > div {
		margin-right: 4rem;
		color: rgba(0, 0, 0, 0.6);
	}
`;

function getStyle(style: DraggingStyle | NotDraggingStyle) {
	if (style?.transform) {
		const axisLockX = `${style.transform.split(",").shift()}, 0px)`;
		return {
			...style,
			transform: axisLockX,
		};
	}
	return style;
}

function App() {
	const [isLight, setIsLight] = useRecoilState(isLightState);
	const toggleTheme = () => setIsLight((current) => !current);

	const [isDraggingTask, setIsDraggingTask] =
		useRecoilState(isDraggingTaskState);

	const [toDos, setToDos] = useRecoilState(toDosState);
	const [categories, setCategories] = useRecoilState(categoriesState);

	useEffect(() => {
		window
			.matchMedia("(prefers-color-scheme: light")
			.addEventListener("change", (e) => {
				setIsLight(e.matches);
			});
	}, []);

	const onAdd = () => {
		const name = window.prompt("새 보드의 이름을 입력해주세요.")?.trim();

		if (name !== null && name !== undefined) {
			if (name === "") {
				alert("이름을 입력해주세요.");
				return;
			}

			if (name && categories.includes(name)) {
				alert(`${name} 보드가 이미 있습니다.`);
				return;
			}

			setCategories((prev) => {
				return [...prev, name];
			});

			setToDos((prev) => {
				return {
					...prev,
					[name]: [],
				};
			});
		}
	};

	const onDragStart = ({ source: { droppableId } }: DragStart) => {
		if (droppableId === "BOARDS") {
			setIsDraggingTask(false);
		} else {
			setIsDraggingTask(true);
		}
	};

	const onDragEnd = ({ draggableId, source, destination }: DropResult) => {
		console.log(source, destination);

		if (source.droppableId === "boards") {
			if (!destination) return;

			if (destination.droppableId === "trash") {
				const boardId = categories[source.index];

				setToDos((prev) => {
					const toDosCopy = { ...prev };
					delete toDosCopy[boardId];

					return toDosCopy;
				});

				setCategories((prev) =>
					prev.filter((category) => category !== boardId)
				);

				return;
			}

			if (source.index === destination.index) return;

			if (source.index !== destination.index) {
				setCategories((oldCategories) => {
					const categoryCopy = [...oldCategories];
					const prevCategory = categoryCopy[source.index];

					categoryCopy.splice(source.index, 1);
					categoryCopy.splice(destination.index, 0, prevCategory);

					return categoryCopy;
				});
			}
		} else if (source.droppableId !== "boards") {
			if (!destination) return;

			if (destination.droppableId === "trash") {
				setToDos((prev) => {
					const boardCopy = [...prev[source.droppableId]];
					const toDoIndex = boardCopy.findIndex(
						(toDo) => toDo.id + "" === draggableId
					);

					boardCopy.splice(toDoIndex, 1);

					return { ...prev, [source.droppableId]: boardCopy };
				});
				return;
			}

			if (source.droppableId === destination.droppableId) {
				setToDos((oldToDos) => {
					const boardCopy = [...oldToDos[source.droppableId]];
					const prevToDo = boardCopy[source.index];

					boardCopy.splice(source.index, 1);
					boardCopy.splice(destination.index, 0, prevToDo);

					return {
						...oldToDos,
						[source.droppableId]: boardCopy,
					};
				});
			}

			if (source.droppableId !== destination.droppableId) {
				setToDos((oldToDos) => {
					const sourceCopy = [...oldToDos[source.droppableId]];
					const destinationCopy = [...oldToDos[destination.droppableId]];
					const prevToDo = sourceCopy[source.index];

					sourceCopy.splice(source.index, 1);
					destinationCopy.splice(destination.index, 0, prevToDo);

					return {
						...oldToDos,
						[source.droppableId]: sourceCopy,
						[destination.droppableId]: destinationCopy,
					};
				});
			}
		}
	};

	return (
		<ThemeProvider theme={isLight ? lightTheme : darkTheme}>
			<GlobalStyle />
			<Navigation>
				<Title>할 일</Title>
				<Buttons>
					<Button onClick={onAdd}>
						<MaterialIcon name="library_add" />
					</Button>
					<Button onClick={toggleTheme}>
						<MaterialIcon name={isLight ? "dark_mode" : "light_mode"} />
					</Button>
				</Buttons>
			</Navigation>
			<DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
				<Droppable
					droppableId="boards"
					direction="horizontal"
					isDropDisabled={isDraggingTask}
				>
					{(provided, snapshot) => (
						<Boards ref={provided.innerRef} {...provided.droppableProps}>
							{categories.map((boardId, index) => (
								<Draggable draggableId={boardId} key={boardId} index={index}>
									{(provided, snapshot) => (
										<Board
											parentProvided={provided}
											boardId={boardId}
											key={boardId}
											toDos={toDos[boardId]}
											isHovering={snapshot.isDragging}
											style={getStyle(provided.draggableProps.style!)}
										/>
									)}
								</Draggable>
							))}
							{provided.placeholder}
						</Boards>
					)}
				</Droppable>
				<Droppable droppableId="trash">
					{(provided, snapshot) => (
						<div>
							<Trash ref={provided.innerRef} {...provided.droppableProps}>
								<MaterialIcon name="delete" />
							</Trash>
							{provided.placeholder}
						</div>
					)}
				</Droppable>
			</DragDropContext>
		</ThemeProvider>
	);
}

export default App;
