import "styled-components";

declare module "styled-components" {
	export interface DefaultTheme {
		bgColor: string;
		textColor: string;
		secondaryTextColor: string;
		accentColor: string;
		accentFadedColor: string;
		cardColor: string;
		boardColor: string;
		activeCardColor: string;
		buttonColor: string;
		hoverButtonColor: string;
		hoverButtonOverlayColor: string;
		glassColor: string;
		scrollBarColor: string;
	}
}
