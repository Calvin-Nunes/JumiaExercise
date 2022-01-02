const LibUtils = {
	toDecimal(value) {
		if (typeof value === "number" || typeof value === "bigint") {
			return value;
		} else if (typeof value === "string") {
			let n = Number(value);
			if (!isNaN(n)) {
				return n;
			}
		} else if (typeof value === "boolean") {
			return value ? 1 : 0;
		}

		return 0;
	},

	toBoolean(value) {
		if (typeof value === "boolean") {
			return value;
		} else if (typeof value === "number") {
			return value >= 1 ? true : false;
		} else if (typeof value === "string") {
			let vStr = value.toString().toLowerCase();
			return vStr === "y" || vStr === "yes" || vStr === "true";
		}
		return false;
	},

	isEmpty(value) {
		if (value == null) {
			return true;
		}

		if (typeof value === "string") {
			if (value.trim().length == 0) {
				return true;
			}
		}

		if (typeof value === "number") {
			return value === 0;
		}

		if (value instanceof Array) {
			return value.length == 0;
		} else if (typeof value === "object") {
			return Object.keys(value).length == 0;
		}

		return false;
	},

	isFilled(value) {
		return !this.isEmpty(value);
	},

	isValidEmail(email) {
		const regex =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email.toString().toLowerCase());
	},

	getRandom() {
		let random = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
		return random + "x" + new Date().getTime();
	},
};

export default LibUtils;
