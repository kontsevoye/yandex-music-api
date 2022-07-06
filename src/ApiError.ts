class ApiError extends Error {
	constructor(error:{name:string;message:string}) {
		super();
		this.name = error.name || "unknown";
		this.message = error.message || "An unknown error has occurred";
	}
}

export default ApiError;