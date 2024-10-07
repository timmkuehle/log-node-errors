import { NodeErrorBoundary } from "./NodeErrorBoundary";

export { hans } from "./hans";

export { wurst } from "./wurst";

const errorBoundary = new NodeErrorBoundary();

errorBoundary.execute(() => {
	throw Error("Das doof jetzt...");
});
