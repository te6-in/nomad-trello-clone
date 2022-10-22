import { atom } from "recoil";

export const isLightState = atom<boolean>({
	key: "isLightState",
	default: JSON.parse(localStorage.getItem("isLight") ?? JSON.stringify(true)),
});

export interface IToDo {
	id: number;
	text: string;
}

interface IToDoState {
	[key: string]: IToDo[];
}

export const categoryState = atom<string[]>({
	key: "category",
	default: ["해야 함", "하는 중", "끝"],
});

export const toDoState = atom<IToDoState>({
	key: "toDo",
	default: {
		"해야 함": [
			{ text: "빨래 널기", id: 0 },
			{ text: "코로나 검사하기", id: 1 },
			{ text: "강의 듣기", id: 2 },
			{ text: "책 읽기", id: 3 },
			{ text: "키친타올 사기", id: 4 },
			{ text: "커피 마시기", id: 5 },
			{ text: "오버워치 하기", id: 6 },
			{ text: "공부하기", id: 7 },
			{ text: "운동하기", id: 8 },
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
		"하는 중": [],
		끝: [{ text: "은행 다녀오기", id: 27 }],
	},
});
