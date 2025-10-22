
export default {
	 async fetch(request, env) {
		if (request.method === "OPTIONS") {
		return new Response("", {
			headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
			},
		});
		}

		if (request.method === "POST") {
		const { text } = await request.json();

		const result = await env.AI.run("@cf/myshell-ai/melotts", {
			prompt: text,
		});

		const audioBase64 = result.audio;
		const audioBuffer = Uint8Array.from(atob(audioBase64), c => c.charCodeAt(0));

		return new Response(audioBuffer, {
			headers: {
			"Content-Type": "audio/mpeg",
			"Access-Control-Allow-Origin": "*",
			},
		});
		}

		return new Response("Use POST with JSON { text }", {
		headers: { "Access-Control-Allow-Origin": "*" },
		});
  },
};
