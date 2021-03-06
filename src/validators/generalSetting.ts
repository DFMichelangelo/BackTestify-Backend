import ajv from "./AJVInstance";
import { Response, Request, NextFunction } from "express";

const GeneralSettingsValidator = {
	getGeneralSettingByFeature: (req: Request, res: Response, next: NextFunction) => {
		const feature = req.params.feature;
		const schema = {
			type: "string",
		};
		const valid = ajv.validate(schema, feature);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	createGeneralSetting: (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const schema = {
			type: "object",
			required: ["value", "feature"],
			properties: {
				feature: { type: "string" },
				value: { type: "string" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},

	updateGeneralSetting: (req: Request, res: Response, next: NextFunction) => {
		const data = req.body;
		const schema = {
			type: "object",
			required: ["feature", "value"],
			properties: {
				feature: { type: "string" },
				value: { type: "string" },
			},
			additionalProperties: false,
		};
		const valid = ajv.validate(schema, data);
		if (valid) next();
		else next({ message: "Validation Error", errors: ajv.errors, status: 400 });
	},
};

export default GeneralSettingsValidator;
