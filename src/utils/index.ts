const JsonResponse = (body: unknown, init?: ResponseInit) => {
	const jsonBody = JSON.stringify(body);
	init = init || {
		headers: {
			"content-type": "application/json;charset=UTF-8",
		},
	};
	return new Response(jsonBody, init);
};

export { JsonResponse };
