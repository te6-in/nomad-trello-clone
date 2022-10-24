import { atom } from "recoil";

export const isLightState = atom<boolean>({
	key: "isLigh",
	default: window.matchMedia("(prefers-color-scheme: light)").matches
		? true
		: false,
});

export interface IToDo {
	id: number;
	text: string;
}

export interface IBoard {
	id: number;
	title: string;
	toDos: IToDo[];
}

const instanceOfToDo = (object: any): object is IToDo => {
	return (
		object.constructor === Object &&
		"id" in object &&
		"text" in object &&
		typeof (object as IToDo).id === "number" &&
		typeof (object as IToDo).text === "string"
	);
};

const instanceOfBoard = (object: any): object is IBoard => {
	return (
		object.constructor === Object &&
		"id" in object &&
		"title" in object &&
		"toDos" in object &&
		typeof (object as IBoard).id === "number" &&
		typeof (object as IBoard).title === "string" &&
		(object as IBoard).toDos.every((toDo) => instanceOfToDo(toDo))
	);
};

const instanceOfBoards = (object: any): object is IBoard[] => {
	return (
		Array.isArray(object) &&
		(object as IBoard[]).every((board) => instanceOfBoard(board))
	);
};

const localStorageEffect =
	(key: string) =>
	({ setSelf, onSet }: any) => {
		const savedValue = localStorage.getItem(key);

		if (savedValue !== null && savedValue !== undefined) {
			const json = (raw: string) => {
				try {
					return JSON.parse(raw);
				} catch (error) {
					return false;
				}
			};

			if (json(savedValue) && instanceOfBoards(json(savedValue))) {
				setSelf(json(savedValue));
			}
		}

		onSet((newValue: IBoard[]) => {
			localStorage.setItem(key, JSON.stringify(newValue));
		});
	};

export const toDosState = atom<IBoard[]>({
	key: "toDos",
	default: [
		{
			title: "해야 함",
			id: 0,
			toDos: [
				{ text: "빨래 널기", id: 0 },
				{ text: "코로나 검사하기", id: 1 },
				{ text: "책 읽기", id: 2 },
				{ text: "마스크 사기", id: 3 },
				{ text: "커피 마시기", id: 4 },
				{ text: "설거지 하기", id: 5 },
				{ text: "공부하기", id: 6 },
				{ text: "운동하기", id: 7 },
				{ text: "이건 이름이 되게 긴데 마우스를 여기에도 올려보세요", id: 8 },
				{ text: "할", id: 9 },
				{ text: "일이", id: 10 },
				{ text: "왤케", id: 11 },
				{ text: "많아", id: 12 },
				{ text: "스크롤이랑 드래그도", id: 13 },
				{ text: "해보세요", id: 14 },
				{ text: "할 일 1", id: 15 },
				{ text: "할 일 2", id: 16 },
				{ text: "할 일 3", id: 17 },
				{ text: "할 일 4", id: 18 },
				{ text: "할 일 5", id: 19 },
				{ text: "할 일 6", id: 20 },
				{ text: "할 일 7", id: 21 },
				{ text: "할 일 8", id: 22 },
				{ text: "할 일 9", id: 23 },
				{ text: "할 일 10", id: 24 },
				{ text: "할 일 11", id: 25 },
				{ text: "할 일 12", id: 26 },
			],
		},
		{ title: "하는 중", id: 1, toDos: [] },
		{
			title: "끝",
			id: 2,
			toDos: [
				{ text: "은행 다녀오기", id: 27 },
				{ text: "보드나 할 일을 추가해보세요!", id: 28 },
			],
		},
	],
	effects: [localStorageEffect("trello-clone-to-dos")],
});
