const configuration = {
	base: {
		longTitle: "BackTestify",
		shortTitle: "BackTestify",
		description: "Backtesting platform for algorithmic trading strategies",
		apiDocsLink: "/api-docs",
		mainDomain: "https://backtestify.netlify.app",
		color: "#729B79",
		contact: {
			name: "Michelangelo De Francesco",
			url: "https://www.linkedin.com/in/michelangelodefrancesco",
			email: "df.michelangelo@gmail.com",
		},
	},
	production: {},
	development: {},
};

const config = {
	...(process.env.NODE_ENV === "production" ? configuration.production : configuration.development),
	...configuration.base,
};

export default config;
